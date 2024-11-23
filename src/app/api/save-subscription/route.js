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
      const newExpirationTime = new Date(latestPlanExpired - createdAt + (existingPlanExpired?.getTime() || 0));
      return newExpirationTime.toISOString(); // ISO 8601 format
    }
    return existingPlanExpired ? existingPlanExpired.toISOString() : null;
  };

  const fetchExpiredDate = async (plan_expiry, userEmail) => {
    const user = await db.collection('user').findOne({ email: userEmail });
  
    if (user) {
      const userExpiredAt = user.expired_at ? new Date(user.expired_at) : null;
      const currentDate = new Date();
  
      // If user does not have an expiration date, default to plan_expiry
      if (userExpiredAt === null) {
        return plan_expiry;
      }
  
      // If user's plan has expired
      if (userExpiredAt < currentDate) {
        return plan_expiry;
      }
  
      // If user's plan is active and they have prompts > 0 (not -99)
      if (user.prompt > 0 && user.prompt !== -99) {
        return null; // No action needed, plan is still active
      }
  
      // If user's plan has expired but prompt is 0
      if (user.prompt === 0) {
        const daysRemaining = Math.ceil((userExpiredAt - currentDate) / (1000 * 60 * 60 * 24));
        const newDate =  new Date(new Date(plan_expiry).getTime() + daysRemaining * 24 * 60 * 60 * 1000).toISOString();
        return newDate
      }
    }
  
    return null; // Return null if user not found or no conditions met
  };
  

  try {
    const data = await req.json();
    const email = data?.email || null; // Assign email here
    const userId = data?.userId || null; // Extract email

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Fetch plans and get the latest one
    const planTable = await collection.find({ userId }).sort({ plan_expired: -1 }).toArray();
    const latestPlan = planTable.length > 1 ? planTable[0] : {};

    // Prepare subscription data
    const subscriptionData = {
      userId: data?.userId || null,
      email: email,
      totalAmount: data?.totalAmount || 0,
      status: data?.status || 'active',
      startDate: data?.createdTimestamp ? new Date(data.createdTimestamp) : null,
      currentPeriodStart: data?.currentPeriodStart ? new Date(data.currentPeriodStart) : null,
      currentPeriodEnd: data?.currentPeriodEnd ? new Date(data.currentPeriodEnd) : null,
      paymentId: data?.paymentIntentId || null,
      trialStart: data?.trialStart ? new Date(data.trialStart) : null,
      trialEnd: data?.trialEnd ? new Date(data.trialEnd) : null,
      price: data?.price || 0,
      planType: data?.planType || '',
      plan_expired: await fetchExpiredDate(data.plan_expired, email),
      plan_id: data?.plan_id || '-1',
      created_at: data?.created_at || new Date().toISOString(),
      started_at: data?.created_at,
      customerId: data?.customer,
      subscription: data?.subscription,
      prompt: data.prompt
    };

    if (!subscriptionData?.userId || !subscriptionData?.email) {
      return NextResponse.json({ error: 'userId and email are required fields' }, { status: 400 });
    }

    // Ensure only one entry for the paymentId
    const existingEntry = await collection.findOneAndUpdate(
      { paymentId: subscriptionData.paymentId }, // Query by paymentId
      { $set: subscriptionData }, // Update with new data
      { upsert: true, returnDocument: 'after' } // Insert if not found
    );

    if (!existingEntry) {
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({
      message: 'Subscription saved successfully!',
      id: data?.userId,
      subscription: subscriptionData.paymentId,
      expiry: subscriptionData?.plan_expired
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
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
