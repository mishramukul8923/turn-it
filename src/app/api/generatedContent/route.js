import { NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';

export const POST = async (req) => {
  try {
    const { text, generatedContent, user_id, email,copied } = await req.json();

    if (!text || !generatedContent) {
      return NextResponse.json(
        { error: 'Text and generatedContent are required' },
        { status: 400 }
      );
    }

    const db = await createConnection();

    const result = await db.collection('generator').insertOne({
      text,
      generatedContent,
      user_id,
      copied,
      createdAt: new Date(),
    });

    const users = await db.collection('user').findOne({ email });
    if (!users) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let newPlan = '-1';
    if (users.plan_id == '-1') {
      newPlan = '-1';
    } else if (users.plan_id == '0' || users.plan_id == '-2' || users.plan_id == '-3') {
      const humanizerCount = await db.collection('humanizer').find({ user_id }).count();
      const generatorCount = await db.collection('generator').find({ user_id }).count();

      if (humanizerCount > 2 && generatorCount > 2) {
        newPlan = '-1'; // Both counts are greater than 2
      } else if (generatorCount > 2) {
        newPlan = '-3'; // Only generatorCount is greater than 2
      } else if (humanizerCount > 2) {
        newPlan = '-2'; // Only humanizerCount is greater than 2
      } else {
        newPlan = '0'; // Both counts are less than or equal to 2
      }
    } else {
      const planTable = await db
        .collection('subscription')
        .find({ email }) // Fetch all subscriptions matching the email
        .sort({ plan_expired: -1 }) // Sort by `plan_expired` in descending order
        .toArray();

      if (planTable.length > 0) {
        const latestPlan = planTable[0]; // Get the latest plan

        if (new Date(latestPlan.plan_expired) > new Date()) {
          const today = new Date();

          // Find the nearest plan to today
          const nearestPlan = planTable
            .map(plan => ({
              ...plan,
              difference: Math.abs(new Date(plan.plan_expired) - today), // Calculate absolute difference
            }))
            .sort((a, b) => a.difference - b.difference)[0]; // Sort by difference and pick the nearest

          newPlan = nearestPlan.plan_id; // Assign the nearest plan's ID
        } else {
          newPlan = '-1'; // Fallback if the latest plan is expired
        }
      }
    }

    await db.collection('user').updateOne(
      { email },
      {
        $set: { plan_id: newPlan }
      }
    );

    result.plan_id = newPlan;
    return NextResponse.json(
      { message: 'Content saved successfully', data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
};
