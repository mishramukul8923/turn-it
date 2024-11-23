import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';


const stripe = new Stripe(process.env.SECRET_KEY);

export async function POST(request) {
  try {
    const data = await request.json();

    const { email } = data.planData;

    const db = await createConnection()
    const userCollections = db.collection('user'); // Use the 'admin' collection
    const user = await userCollections.findOne({ email });

    if (user) {
      const userExpiredAt = user.expired_at ? new Date(user.expired_at) : null;
      const currentDate = new Date();
      if (currentDate <= userExpiredAt && user.prompt > 0 && user.prompt != -99) {
        return new NextResponse(JSON.stringify({ data: 'Contact customer support', code: 403 }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }, // Specify the content type
        });
      }

      // Validate the planData price
      if (!data.planData.price || isNaN(data.planData.price)) {
        return new NextResponse('Invalid price', { status: 400 });
      }

      // Create a Stripe Checkout Session for a subscription
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: data.planData.name,
              },
              recurring: {
                interval: data.planData.interval,
              },
              unit_amount: data.planData.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL_VERCEL}/payment-success?session_id={CHECKOUT_SESSION_ID}&${new URLSearchParams(data.planData).toString()}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL_VERCEL}/payment-failed`,
        metadata: {
          userId: data.planData.user_id,
        },
      });

      return NextResponse.json({ result: checkoutSession, ok: true });
    } else {
      return new NextResponse('User not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
