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

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case "invoice.payment_succeeded":
      await handleInvoicePaymentSucceeded(event.data.object);
      break;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionCanceled(event.data.object);
      break;
    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  return res.status(200).json({ received: true });
  
}

async function handleCheckoutSessionCompleted(session) {
  if (session.status !== "complete") return

  const { clientId, planId } = session.metadata || {};
  const stripeCustomerId = session.customer;
  const stripeSubscriptionId = session.subscription; // ← id da assinatura

  if (!clientId || !planId || !stripeCustomerId || !stripeSubscriptionId) return

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

  } catch (error) {
    console.error("Erro ao processar webhook:", error);
  }
}

async function handleInvoicePaymentSucceeded(invoice) {

  const subscription = await prisma.subscriptions.findFirst({
    where: { stripeSubscriptionId: invoice.subscription }
  })

  if(!subscription) {
    return;
  }

  if (invoice.billing_reason === "subscription_create") return; // ignora o primeiro pagamento, que já foi tratado no checkout.session.completed

  const stripeSub = await stripeClient.subscriptions.retrieve(subscription.stripeSubscriptionId);
  const subItem = stripeSub.items.data[0];

  await prisma.subscriptions.update({
    where: { id: subscription.id },
    data: {
      currentPeriodStart: new Date(subItem.current_period_start * 1000),
      currentPeriodEnd: new Date(subItem.current_period_end * 1000),
    }
  });

  await prisma.invoice.create({
    data: {
      subscription: {
        connect: { id: subscription.id }
      },
      paymentId: invoice.id,
      price: subItem.price.unit_amount / 100, // converte de centavos para reais
      status: "paid",
      datePayment: new Date(),
      dateMaturity: new Date(subItem.current_period_end * 1000),
      ivoicePdf: "pdf", // aqui você pode gerar o PDF da fatura usando uma biblioteca como pdfkit ou similar
    }
  })

}

async function handleInvoicePaymentFailed(invoice) {
  const subscription = await prisma.subscriptions.findFirst({
    where: { stripeSubscriptionId: invoice.subscription },
  });

  if (!subscription) {
    return;
  }

  const stripeSub = await stripeClient.subscriptions.retrieve(subscription.stripeSubscriptionId);
  const subItem = stripeSub.items.data[0];

  await prisma.subscriptions.update({
    where: { id: subscription.id },
    data: { status: "past_due" },
  });

  await prisma.invoice.create({
    data: {
      subscription: {
        connect: { id: subscription.id }
      },
      paymentId: invoice.id,
      price: subItem.price.unit_amount / 100, // converte de centavos para reais
      status: "failed",
      datePayment: new Date(),
      dateMaturity: new Date(subItem.current_period_end * 1000),
      ivoicePdf: "pdf", // aqui você pode gerar o PDF da fatura usando uma biblioteca como pdfkit ou similar
    }
  })

}

async function handleSubscriptionCanceled(stripeSubscription) {
  await prisma.subscriptions.updateMany({
    where: { stripeSubscriptionId: stripeSubscription.id },
    data: { status: "canceled" },
  });
}