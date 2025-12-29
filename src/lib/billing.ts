import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

/**
 * Create Stripe Customer Portal session
 * Allows users to manage their subscription, payment methods, and billing history
 */
export async function createPortalSession(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (!organization?.stripeCustomerId) {
    throw new Error('No Stripe customer ID found');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: organization.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  });

  return session.url;
}

/**
 * Create checkout session for new subscription or plan change
 */
export async function createCheckoutSession({
  organizationId,
  priceId,
  plan,
}: {
  organizationId: string;
  priceId: string;
  plan: string;
}) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { subscription: true },
  });

  if (!organization) {
    throw new Error('Organization not found');
  }

  // If upgrading/downgrading existing subscription
  if (organization.stripeCustomerId && organization.subscription) {
    // Update existing subscription
    await stripe.subscriptions.update(organization.subscription.stripeSubscriptionId, {
      items: [
        {
          id: organization.subscription.stripePriceId,
          price: priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    return null; // No checkout needed, subscription updated
  }

  // Create new checkout session for first-time subscription
  const session = await stripe.checkout.sessions.create({
    customer: organization.stripeCustomerId || undefined,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
    metadata: {
      organizationId,
      plan,
    },
  });

  return session.url;
}

/**
 * Get subscription details
 */
export async function getSubscription(organizationId: string) {
  return prisma.subscription.findUnique({
    where: { organizationId },
  });
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(organizationId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
  });

  if (!subscription) {
    throw new Error('No subscription found');
  }

  // Cancel at period end (don't interrupt current billing cycle)
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}
