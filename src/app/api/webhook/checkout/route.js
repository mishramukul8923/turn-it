import Stripe from 'stripe';

const stripe = new Stripe(process.env.SECRET_KEY);

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      console.error('Missing Stripe Signature');
      return new Response('Webhook Error: Missing Stripe Signature', { status: 400 });
    }

    const endpointSecret = process.env.WEBHOOK_SECRET_KEY;
    let event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.error('Error validating webhook:', err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      return
      const sessionData = event.data.object;
      saveSubscriptionData(sessionData);
    }

    return new Response('Webhook received successfully', { status: 200 });
  } catch (err) {
    console.error('Error handling webhook:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}

const PROMPT_MAP = {
  "1": 50,
  "2": 100,
  "4": 600,
  "5": 1200,
};

const saveSubscriptionData = async (sessionData) => {
  const metadata = sessionData.metadata || {};
  const subscriptionData = {
    userId: metadata?.user_id,
    email: metadata?.email,
    name: sessionData?.customer_details?.name,
    paymentIntentId: sessionData?.invoice,
    paymentStatus: sessionData?.payment_status,
    sessionId: sessionData?.id,
    customerEmail: sessionData?.customer_details?.email || sessionData?.customer_email,
    customerName: sessionData?.customer_details?.name || "",
    totalAmount: sessionData?.amount_total,
    currency: sessionData?.currency,
    createdTimestamp: sessionData?.created,
    price: metadata?.price,
    planType: metadata?.planType,
    plan_expired: metadata?.expired_at,
    created_at: new Date(),
    plan_id: metadata?.plan_id,
    customerId: sessionData?.customer,
    subscription: sessionData?.subscription,
    prompt: PROMPT_MAP[metadata?.plan_id] || -99,
  };


  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://turnit.vercel.app';
    const saveResponse = await fetch(`${baseUrl}/api/save-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriptionData),
    });

    const saveResult = await saveResponse.json();
    if (saveResponse.ok) {
      updateUser(metadata.email, metadata.plan_id, sessionData.subscription, saveResult.expiry);
    } else {
      console.error('Failed to save subscription:', saveResult.error);
    }
  } catch (error) {
    console.error('Error saving subscription:', error.message);
  }
};

const updateUser = async (email, newPlan, subscription_id, expiry) => {
  const body = {
    email: email,
    plan_id: newPlan,
    subscription: [subscription_id],
    prompt: PROMPT_MAP[newPlan] || -99,
    expired_at: expiry,
  };

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://turnit.vercel.app';
    const response = await fetch(`${baseUrl}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData.error);
    }
  } catch (error) {
    console.error('Unexpected error occurred:', error.message);
  }
};
