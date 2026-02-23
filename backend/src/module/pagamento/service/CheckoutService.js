import { prisma } from "../../../shared/config/db.js"
import stripeClient from "../config/stripe.js"

export default class CheckoutService {

    async generateLink(data) {
        try {
          const plan = await prisma.plan.findFirst({
            where: { id: data.planId },
            select: { stripePriceId: true },
          });

          if (!plan) throw new Error(`Plano não encontrado: ${data.planId}`);
      
          const client = await prisma.clientStripe.findFirst({
            where: { userId: data.userId },
            select: { stripeCustomerId: true, email: true, id: true },
          });

          if (!client) throw new Error(`Cliente não encontrado para userId: ${data.userId}`);
          if (!client.stripeCustomerId) throw new Error(`Cliente sem stripeCustomerId: ${data.userId}`);
      
          const session = await stripeClient.checkout.sessions.create({
            mode: "subscription",
            payment_method_collection: "always",
            customer: client.stripeCustomerId,        // usa só customer, sem customer_email
            line_items: [{ price: plan.stripePriceId, quantity: 1 }],
            success_url: data.successUrl,
            cancel_url: data.cancelUrl,
            metadata: {
              clientId: client.id,
              planId: data.planId,
            },
          });
      
          return {
            message: 'Link para pagamento criado com sucesso',
            link: session.url,
          };
      
        } catch (error) {
          return {
            message: 'Erro ao criar fatura',
            error: error.message,
          };
        }
      }
}