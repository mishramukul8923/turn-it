import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.SECRET_KEY);

export async function POST(req) {
  try {
    // Parse the incoming request body
    const body = await req.json();
    const { id, email, expired_at, price, planType } = body;

    // Ensure required fields are present
    if (!email || !price || !planType) {
      return NextResponse.json(
        { message: 'Invalid request: Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure the price is a number and convert it to cents
    if (isNaN(price) || price <= 0) {
      console.error('Invalid price provided:', price);
      return NextResponse.json(
        { message: 'Invalid price provided' },
        { status: 400 }
      );
    }

    // Create a new Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planType} Plan`, // Use the plan name here
            },
            unit_amount: price * 100, // Convert price to cents (Stripe uses cents)
          },
          quantity: 1,
        },
      ],
      customer_email: email, // Optionally include email
      mode: 'payment', // 'payment' for one-time payments, 'subscription' for recurring payments
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL_VERCEL}/payment-success?session_id={CHECKOUT_SESSION_ID}&${new URLSearchParams(body).toString()}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed`,
    });

    // Return the session ID to the frontend
    return NextResponse.json(
      { sessionId: session.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json(
      { message: 'Error creating Stripe session', error: error.message },
      { status: 500 }
    );
  }
}
