import Stripe from 'stripe';

const stripe = new Stripe(process.env.SECRET_KEY);

export async function POST(req) {
  try {
    const { customerId, paymentMethodId } = await req.json();

    if (!customerId || !paymentMethodId) {
      return new Response(JSON.stringify({ error: 'Customer ID and Payment Method ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Attach the new payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // Update the default payment method for future invoices
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    return new Response(JSON.stringify({ message: 'Payment method updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log('Error updating payment method:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
