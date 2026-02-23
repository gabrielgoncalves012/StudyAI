import { prisma } from "../../../shared/config/db.js"
import stripeClient from "../config/stripe.js"

export default class SubscriptionService {

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

    async getSubscriptionStatus(userId) {
      try {
        const subscription = await prisma.subscriptions.findFirst({
          where: {
            client: {
              userId,
            }
          },
          select: {
            status: true,
          }
        })

        if (!subscription) throw new Error(`Assinatura não encontrada para userId: ${userId}`);

        return {
          status: subscription.status,
        };
      } catch (error) {
        return {
          message: 'Erro ao buscar status da assinatura',
          error: error.message,
        };
      }
    }

    async changePlan(userId, newPlanId) {

      const subscription = await prisma.subscriptions.findFirst({
        where: {
          client: {
            userId,
          }
        },
        select: {
          stripeSubscriptionId: true,
          status: true,
          id: true,
        }
      })

      if (!subscription) throw new Error("Assinatura não encontrada");
      if (subscription.status === "canceled") throw new Error("Assinatura cancelada");

      const newPlan = await prisma.plan.findFirst({
        where: { id: newPlanId },
        select: { stripePriceId: true },
      });

      if (!newPlan) throw new Error("Plano não encontrado");

      // busca a assinatura no Stripe para pegar o item atual
      const stripeSub = await stripeClient.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      );

      // atualiza o plano no Stripe com prorate (cobra/desconta a diferença)
      await stripeClient.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [
          {
            id: stripeSub.items.data[0].id, // item atual
            price: newPlan.stripePriceId,   // novo preço
          },
        ],
        proration_behavior: "create_prorations", // cobra a diferença proporcional
      });

      await prisma.subscriptions.update({
        where: { id: subscription.id },
        data: { planId: newPlanId },
      })

      return {
        message: 'Plano alterado com sucesso',
      };

    }

    async cancelSubscription(userId, subscriptionId) {
      try {
        const subscription = await prisma.subscriptions.findFirst({
          where: {
            id: subscriptionId,
            client: {
              userId,
            }
          },
          select: {
            stripeSubscriptionId: true,
          }
        })

        if (!subscription) throw new Error(`Assinatura não encontrada para userId: ${userId} e subscriptionId: ${subscriptionId}`);
        if (!subscription.stripeSubscriptionId) throw new Error(`Assinatura sem stripeSubscriptionId para subscriptionId: ${subscriptionId}`);

        await stripeClient.subscriptions.del(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });

        return {
          message: 'Assinatura cancelada com sucesso',
        };
      } catch (error) {
        return {
          message: 'Erro ao cancelar assinatura',
          error: error.message,
        };
      }
    }
}