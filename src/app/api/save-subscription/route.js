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

  // Ensure email is defined before using it in getNearDate
  let email;

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

  async function getNearDate(date1) {
    try {
      const today = new Date();
  
      // Ensure email is available here (you should pass it to the function or make it globally accessible)
      if (!email) {
        throw new Error("Email is not provided.");
      }
  
      // Fetch plans with expired_at in the future
      const planTable = await collection
        .find({ email, expired_at: { $gt: today } })
        .sort({ started_at: -1 })
        .toArray();
  
      // Get the first plan matching the criteria
      const firstPlan = planTable.length > 0 ? planTable[0] : null;
  
      // Handle the case where no valid plans are found
      if (!firstPlan || !firstPlan.expiry) {
        return date1;
      }
  
      const date2 = firstPlan.expiry;
  
      // Ensure date1 is valid
      if (!date1 || isNaN(new Date(date1).getTime())) {
        throw new Error("Invalid date1 provided.");
      }
  
      // Ensure date2 is valid
      if (!date2 || isNaN(new Date(date2).getTime())) {
        return date1;
      }
  
      // Compare and return the earlier date
      return new Date(date1) < new Date(date2) ? date1 : date2;
    } catch (error) {
      return date1; // Return null or handle as needed in the calling context
    }
  }


  try {
    const data = await req.json();
    email = data?.email || null; // Assign email here

    // Validate email before proceeding
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

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
      subscription: data?.subscription,
      prompt: data.prompt
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
      expiry: await getNearDate(subscriptionData?.plan_expired)
    });
  } catch (error) {
    console.log('Error saving subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription', details: error.message }, { status: 500 });
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
