import { NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';

export async function POST(req) {
  let db;
  try {
    db = await createConnection(); // Connect to MongoDB
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  const collection = db.collection('subscription'); // "subscription" collection in MongoDB

  const calculatePlanExpired = (latestPlan, data) => {
    const latestPlanExpired = latestPlan?.plan_expired ? new Date(latestPlan.plan_expired) : null;
    const createdAt = data?.created_at ? new Date(data.created_at) : null;
    const existingPlanExpired = data?.plan_expired ? new Date(data.plan_expired) : null;

    if (latestPlanExpired && createdAt) {
      // Calculate new expiration date by adding the difference
      const newExpirationTime = new Date(latestPlanExpired - createdAt + (existingPlanExpired?.getTime() || 0));
      return newExpirationTime.toISOString(); // Return the result in ISO 8601 format
    }

    // Fallback to existing expiration date or null
    return existingPlanExpired ? existingPlanExpired.toISOString() : null;
  };



  try {
    const data = await req.json();
    const email = data?.email || null;

    // Fetch plans and get the latest one
    const planTable = await collection
      .find({ email })
      .sort({ plan_expired: -1 })
      .toArray();

    const latestPlan = planTable.length > 1 ? planTable[0] : {};

    // Validate essential fields and add fallback for optional fields
    const subscriptionData = {
      userId: data?.userId || null,
      email: email,
      totalAmount: data?.totalAmount || 0,
      status: data?.status || 'active', // Default to 'active' if status is not provided
      startDate: data?.createdTimestamp ? new Date(data.createdTimestamp) : null,
      currentPeriodStart: data?.currentPeriodStart
        ? new Date(data.currentPeriodStart)
        : null,
      currentPeriodEnd: data?.currentPeriodEnd ? new Date(data.currentPeriodEnd) : null,
      paymentId: data?.paymentIntentId || null,
      trialStart: data?.trialStart ? new Date(data.trialStart) : null,
      trialEnd: data?.trialEnd ? new Date(data.trialEnd) : null,
      price: data?.price || 0,
      planType: data?.planType || '',
      plan_expired: calculatePlanExpired(latestPlan, data),
      plan_id: data?.plan_id || '-1',
      created_at: data?.created_at || new Date().toISOString(),
      started_at: new Date(latestPlan?.plan_expired).getTime() > new Date(data?.created_at).getTime()
        ? latestPlan?.plan_expired
        : data?.created_at,
      customerId: data?.customer,
      subscription: data?.subscription
    };

    // Validate required fields
    if (!subscriptionData?.userId || !subscriptionData?.email) {
      return NextResponse.json({ error: 'userId and email are required fields' }, { status: 400 });
    }

    // Save data to MongoDB
    const result = await collection.insertOne(subscriptionData);

    // Send success response with inserted data details
    return NextResponse.json({
      message: 'Subscription saved successfully!',
      id: result.insertedId,
    });
  } catch (error) {
    console.log('Error saving subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription back' }, { status: 500 });
  }
}

export async function GET(req) {
  let db;
  try {
    db = await createConnection(); // Connect to MongoDB
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  const userId = req.nextUrl.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  const collection = db.collection('subscription'); // "subscription" collection in MongoDB

  try {
    const subscriptions = await collection.find({ userId }).toArray();
    return NextResponse.json({ data: subscriptions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve subscriptions', details: error.message }, { status: 500 });
  }
}
