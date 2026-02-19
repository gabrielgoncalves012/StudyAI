import stripeClient from '../config/stripe.js';
import { prisma } from '../../../shared/config/db.js';

export class ClientStripeService {

    async createClientStripe(customer) {
        try {
            
            const stripeCustomer = await stripeClient.customers.create({
                name: customer.name,
                email: customer.email,
            })

            await prisma.clientStripe.create({
                data: {
                    name: customer.name,
                    email: customer.email,
                    stripeCustomerId: stripeCustomer.id,
                    userId: customer.userId,
                    actived: true,
                }
            })

        } catch (error) {
            return {
                message: 'Erro ao criar cliente no Stripe',
                error: error.message,
            }
        }
    }

}