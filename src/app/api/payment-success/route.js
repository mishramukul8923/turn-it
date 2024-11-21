import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// Initialize Stripe with your secret key from environment variables
const stripe = new Stripe(process.env.SECRET_KEY); // Make sure the key is set in .env

// The handler function will handle both GET and POST requests
export async function GET(req) {
  // Extract the session_id from the query string
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get('session_id');

  if (!session_id) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
  }

  try {
    // Retrieve the session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    // Return the session details as JSON response
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}
