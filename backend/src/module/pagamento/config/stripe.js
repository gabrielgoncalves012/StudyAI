import Stripe from 'stripe';

const stripeClient = Stripe(process.env.STRIPE_SECRET_KEY);

export default stripeClient;