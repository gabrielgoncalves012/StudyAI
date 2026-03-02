import stripeClient from "../config/stripe.js"
import { prisma } from "../../../shared/config/db.js"

export default class PlanService {
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
                recurring: { interval: 'month' }
            })

            const resource = {
                cronogramAccess: plan.cronogramAccess,
                cronogramAmount: plan.cronogramAmount,
                questionAmount: plan.questionAmount,
            }

            console.log('Criando plano no Stripe')

            const newPlan = await prisma.plan.create({
                data: {
                    name: plan.name,
                    price: plan.price,
                    stripePriceId: price.id,
                    codigo: plan.codigo,
                    resources: JSON.stringify(resource),
                }
            })

            console.log('Plano criado:', newPlan)

            return {
                message: 'Plano criado com sucesso',
            }
            
        } catch (error) {
            console.log('Erro completo:', error)
            return {
                message: 'Erro ao criar plano no Stripe',
                error: error.message,
            }
        }
    }

    async getAllPlans() {
        try {
            const plans = await prisma.plan.findMany({
                where: {
                    actived: true,
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    codigo: true,
                    resources: true,
                    actived: true,
                    dateCreated: true,
                    dateUpdated: true
                }
            })
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

    async returnPlanActual(userId) {
        try {

            const subscription = await prisma.subscriptions.findFirst({
                where: {
                    client: {
                        userId: userId,
                    }
                }
            })

            const plan  = await prisma.plan.findUnique({
                where: {
                    id: subscription.planId,
                },
                select: {
                    id: true,
                    name: true,
                    actived: true,
                    dateCreated: true,
                    dateUpdated: true
                }
            })

            return plan

        } catch (error) {
            return {
                message: 'Erro ao buscar plano atual',
                error: error.message,
            }
        }
    }
}