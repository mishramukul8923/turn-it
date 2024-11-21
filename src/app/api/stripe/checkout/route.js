import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';


const stripe = new Stripe(process.env.SECRET_KEY);

export async function POST(request) {
  try {
    const data = await request.json();

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
            currency: 'usd', // Set currency to USD
            product_data: {
              name: data.planData.name, // Replace with your actual product name
            },
            recurring: {
              interval: data.planData.interval, // Set the subscription interval (e.g., monthly or yearly)
            },
            unit_amount: data.planData.price * 100, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'subscription', // Set to 'subscription' mode for recurring payments
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL_VERCEL}/payment-success?session_id={CHECKOUT_SESSION_ID}&${new URLSearchParams(data.planData).toString()}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL_VERCEL}/payment-failed`,
      metadata: {
        userId: data.planData.user_id, // Pass additional metadata if needed
      },
    });


    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.log('Error creating checkout session:', error.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
