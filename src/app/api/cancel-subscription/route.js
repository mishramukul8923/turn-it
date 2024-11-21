import createConnection from '@/app/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { subscriptionId, email } = body;

    // Validate subscriptionId
    if (!subscriptionId) {
      return new Response(JSON.stringify({ error: 'Subscription ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cancel the subscription
    const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true, // Cancels the subscription at the end of the billing cycle
    });

    const db = await createConnection();
    let updateFields = {};

    if (subscriptionId) {
      const currentUser = await db.collection("user").findOne({ email });
      if (currentUser && Array.isArray(currentUser.subscription)) {
        // Remove specified subscriptions from the existing array
        const updatedSubscriptions = currentUser.subscription.filter(
          (sub) => sub != subscriptionId
        );
        updateFields.subscription = updatedSubscriptions; // Set the updated subscriptions
      }
    }


    const result = await db.collection("user").findOneAndUpdate(
      { email },
      { $set: updateFields },
      { returnDocument: "after" }
    );



    // // Update the user document with the subscription field
    // const result = await db.collection('user').updateOne(
    //   { email }, // Find the user by their email
    //   { $set: { subscription: null } } // Clear the subscription field
    // );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Respond with the updated subscription object
    return new Response(
      JSON.stringify({
        message: 'Subscription cancellation initiated successfully.',
        subscription: canceledSubscription,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error canceling subscription:', error);

    // Handle Stripe-specific errors
    if (error.type === 'StripeInvalidRequestError') {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // General server error
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
