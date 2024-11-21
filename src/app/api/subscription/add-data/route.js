import { NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';




export async function POST(request) {
  try {
    // Parse the request body
    const subscriptionData = await request.json();

    // Connect to MongoDB
    const db = await createConnection() // Replace with your DB name
    const collection = db.collection('subscription'); // Replace with your collection name

    // Insert data into the database
        const result = await collection.insertOne({
          userId: subscriptionData.userId,
          email: subscriptionData.email,
          stripeCustomerId: subscriptionData.stripeCustomerId,
          stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
          planId: subscriptionData.planId,
          stripePlanId: subscriptionData.stripePlanId,
          priceId: subscriptionData.priceId,
          status: subscriptionData.status,
          startDate: subscriptionData.startDate,
          currentPeriodStart: subscriptionData.currentPeriodStart,
          currentPeriodEnd: subscriptionData.currentPeriodEnd,
          canceledAt: subscriptionData.canceledAt,
          paymentMethodId: subscriptionData.paymentMethodId,
          billingInterval: subscriptionData.billingInterval,
          nextBillingDate: subscriptionData.nextBillingDate,
          trialStart: subscriptionData.trialStart,
          trialEnd: subscriptionData.trialEnd,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
   

    // Return success response
    return NextResponse.json({ message: 'Data added successfully', result });
  } catch (error) {
    console.error('Error adding data:', error);
    return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
  } finally {
    await client.close();
  }
}
