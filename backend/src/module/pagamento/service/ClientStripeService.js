import stripeClient from '../config/stripe.js';
import { prisma } from '../../../shared/config/db.js';

export default class ClientStripeService {

    async createClientStripe(userId) {
        try {

            const customer = await prisma.usuario.findFirst({
                where: {
                    id: userId,
                    verified: true,
                }
            })

            const existingClient = await prisma.clientStripe.findFirst({
                where: {
                    email: customer.email,
                }
            })

            if (existingClient) {
                
                await prisma.clientStripe.update({
                    where: {
                        id: existingClient.id,
                    },
                    data: {
                        actived: true,
                    }
                })

                return {
                    message: 'Cliente já existe, mas foi reativado',
                }

            }
            
            const stripeCustomer = await stripeClient.customers.create({
                name: customer.name,
                email: customer.email,
            })

            const clientStripe = await prisma.clientStripe.create({
                data: {
                    name: customer.name,
                    email: customer.email,
                    stripeCustomerId: stripeCustomer.id,
                    userId: customer.id,
                    actived: true,
                }
            })

        } catch (error) {
            console.error('Erro ao criar cliente no Stripe:', error);
            return {
                message: 'Erro ao criar cliente no Stripe',
                error: error.message,
            }
        }
    }

    async desativeClientStripe(userId) {
        try {
            const clientStripe = await prisma.clientStripe.findFirst({
                where: {
                    userId: userId,
                    actived: true,
                }
            })

            if (!clientStripe) {
                return {
                    message: 'Cliente não encontrado',
                }
            }

            await prisma.clientStripe.update({
                where: {
                    id: clientStripe.id,
                },
                data: {
                    actived: false,
                }
            })
        } catch (error) {
            return {
                message: 'Erro ao deletar cliente no Stripe',
                error: error.message,
            }
        }

    }

}