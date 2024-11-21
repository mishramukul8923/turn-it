import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const endpointSecret = process.env.WEBHOOK_SECRET_KEY;
  const sig = headers().get('stripe-signature');
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log("Received event:", event);
  } catch (err) {
    console.error('Error constructing event:', err.message);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400
    });
  }

  const eventType = event.type;

  if (
    eventType !== 'checkout.session.completed' &&
    eventType !== 'checkout.session.async_payment_succeeded'
  ) {
    return new Response('Server Error', {
      status: 500
    });
  }

  const data = event.data.object;
  const metadata = data.metadata;
  const userId = metadata.userId;
  const priceId = metadata.priceId;
  const created = data.created;
  const currency = data.currency;
  const customerDetails = data.customer_details;
  const amount = data.amount_total;

  const transactionDetails = {
    userId,
    priceId,
    created,
    currency,
    customerDetails,
    amount,
  };

  if (eventType === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const amount = session.amount_total;

    console.log("Payment successful for user:", userId, "Amount:", amount);
  }

  try {
    // Perform database update here
    console.log("web hook reponse : ", transactionDetails);
    return new Response('Subscription added', {
      status: 200
    });
  } catch (error) {
    return new Response('Server error', {
      status: 500
    });
  }
}
