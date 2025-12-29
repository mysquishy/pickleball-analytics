import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

// Stripe pricing plans
export const STRIPE_PLANS = {
  HOBBY: {
    name: 'Hobby',
    price: 29,
    priceId: process.env.STRIPE_HOBBY_PRICE_ID!,
    features: ['10 projects', '100 API calls/day', 'Email support'],
  },
  PRO: {
    name: 'Pro',
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Unlimited projects',
      'Unlimited API calls',
      'Priority support',
      'Advanced analytics',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 299,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
  },
};
