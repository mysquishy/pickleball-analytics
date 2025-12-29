import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { SubscriptionStatus, SubscriptionPlan } from '@prisma/client';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Create or update subscription in database
      if (session.subscription && session.metadata?.organizationId) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await prisma.subscription.upsert({
          where: {
            organizationId: session.metadata.organizationId,
          },
          create: {
            organizationId: session.metadata.organizationId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            price: subscription.items.data[0].price.unit_amount || 0,
            stripeCurrentPeriodEnd: new Date(
              (subscription.items.data[0].current_period_end || 0) * 1000
            ),
            status: subscription.status.toUpperCase() as SubscriptionStatus,
            plan: (session.metadata.plan as SubscriptionPlan) || SubscriptionPlan.HOBBY,
          },
          update: {
            status: subscription.status.toUpperCase() as SubscriptionStatus,
            stripePriceId: subscription.items.data[0].price.id,
            price: subscription.items.data[0].price.unit_amount || 0,
            stripeCurrentPeriodEnd: new Date(
              (subscription.items.data[0].current_period_end || 0) * 1000
            ),
          },
        });
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          status: subscription.status.toUpperCase() as SubscriptionStatus,
          stripeCurrentPeriodEnd: new Date(
            (subscription.items.data[0].current_period_end || 0) * 1000
          ),
        },
      });
      break;
    }

    default:
      // Unhandled event type
      break;
  }

  return NextResponse.json({ received: true });
}
