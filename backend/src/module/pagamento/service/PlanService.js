import stripeClient from "../config/stripe.js"
import { prisma } from "../../../shared/config/db.js"

export class PlanService {
    async createPlan(plan) {
        try {

            const product = await stripeClient.products.create({
                name: plan.name,
                description: plan.description,
            })

            const price = await stripeClient.prices.create({
                currency: 'brl',
                product: product.id,
                unit_amount: plan.price * 100, // O Stripe trabalha com centavos
                recurring: { interval: 'month' },
                product_data: {
                    name: plan.name,
                    description: plan.description,
                },
            })

            const resource = {
                name: plan.name,
                cronogramAccess: plan.cronogramAccess,
                cronogramAmount: plan.cronogramAmount,
                questionAmount: plan.questionAmount,
            }

            await prisma.plan.create({
                data: {
                    name: plan.name,
                    price: plan.price,
                    stripePriceId: price.id,
                    codigo: plan.codigo,
                    resources: JSON.stringify(resource),
                }
            })

            return {
                message: 'Plano criado com sucesso',
            }
            
        } catch (error) {
            return {
                message: 'Erro ao criar plano no Stripe',
                error: error.message,
            }
        }
    }

    async getAllPlans() {
        try {
            const plans = await prisma.plan.findMany()
            return plans
        } catch (error) {
            return {
                message: 'Erro ao buscar planos',
                error: error.message,
            }
        }
    }

    async removePlan(planId) {
        try {
            const plan = await prisma.plan.findUnique({
                where: {
                    id: planId,
                }
            })

            if (!plan) {
                return {
                    message: 'Plano não encontrado',
                }
            }

            await stripeClient.prices.update(plan.stripePriceId, {
                active: false,
            })

            await prisma.plan.update({
                where: {
                    id: planId,
                },
                data: {
                    actived: false,
                }
            })

            return {
                message: 'Plano removido com sucesso',
            }
        } catch (error) {
            return {
                message: 'Erro ao remover plano',
                error: error.message,
            }
        }
    }

    async retrievePlan(planId) {
        try {
            
            const plan = await prisma.plan.findUnique({
                where: {
                    id: planId,
                }
            })

            if (!plan) {
                return {
                    message: 'Plano não encontrado',
                }
            }

            await prisma.plan.update({
                where: {
                    id: planId,
                },
                data: {
                    actived: true,
                }
            })

            await stripeClient.prices.retrieve(plan.stripePriceId)



        } catch (error) {
            
        }
    }
}