import { prisma } from "../../../shared/config/db.js";
import stripeClient from "../config/stripe.js";

export async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    // valida que o evento realmente veio do Stripe
    event = stripeClient.webhooks.constructEvent(
      req.body, // precisa ser raw buffer, não JSON parseado
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ message: `Assinatura inválida: ${err.message}` });
  }

  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ message: "Evento ignorado" });
  }

  const session = event.data.object; // ← correto

  if (session.status !== "complete") {
    return res.status(200).json({ message: "Sessão não concluída" });
  }

  const { clientId, planId } = session.metadata || {};
  const stripeCustomerId = session.customer;
  const stripeSubscriptionId = session.subscription; // ← id da assinatura

  if (!clientId || !planId || !stripeCustomerId || !stripeSubscriptionId) {
    return res.status(400).json({ message: "Dados insuficientes no webhook" });
  }

  try {

    const stripeSub = await stripeClient.subscriptions.retrieve(stripeSubscriptionId);
    const subItem = stripeSub.items.data[0];

    const subscription = await prisma.subscriptions.create({
      data: {
        clientId,
        planId,
        stripeSubscriptionId,
        status: "active",
        currentPeriodStart: new Date(subItem.current_period_start * 1000),
        currentPeriodEnd: new Date(subItem.current_period_end * 1000),
      },
    });

    await prisma.invoice.create({
      data: {
        subscription: {
          connect: { id: subscription.id }
        },
        paymentId: session.invoice,
        price: subItem.price.unit_amount / 100, // converte de centavos para reais
        status: "paid",
        datePayment: new Date(),
        dateMaturity: new Date(subItem.current_period_end * 1000),
        ivoicePdf: "pdf", // aqui você pode gerar o PDF da fatura usando uma biblioteca como pdfkit ou similar
      }
    })

    return res.status(200).json({ message: "Assinatura criada com sucesso" });

  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return res.status(500).json({ message: "Erro interno", error: error.message });
  }
}