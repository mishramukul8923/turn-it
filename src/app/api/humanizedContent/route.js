import { NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';
import { ObjectId } from "mongodb";

export const POST = async (req) => {
  try {
    // Parse the request body
    const { text, humanizedContent, user_id, email , copied,
      regenerated } = await req.json();

    // Validate required fields
    if (!text || !humanizedContent) {
      console.error('Validation failed: Missing text or humanizedContent');
      return NextResponse.json(
        { error: 'Text and humanizedContent are required' },
        { status: 400 }
      );
    }

    // Establish database connection
    const db = await createConnection();

    const result = await db.collection('humanizer').insertOne({
      text,
      humanizedContent,
      copied,
      regenerated,
      user_id,
      createdAt: new Date(),
    });

    // Fetch the user by email
    const users = await db.collection('user').findOne({ email });
    console.log('User fetched:', users);
    if (!users) {
      console.error('User not found with email:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Determine the new plan
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

    // Update the user's plan_id
    const updateResult = await db.collection('user').updateOne(
      { email },
      { $set: { plan_id: newPlan } }
    );
    console.log('Update result:', updateResult);

    // Return a success response
    return NextResponse.json(
      {
        message: 'Content saved successfully',
        data: {
          insertedId: result.insertedId,
          plan_id: newPlan,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
};










export async function PATCH(req) {
  try {
    const { saveContentId, copied, regenerated } = await req.json();


    if (!saveContentId) {
      return NextResponse.json(
        { error: "Missing saveContentId parameter." },
        { status: 400 }
      );
    }

    const db = await createConnection();
    const collection = db.collection("humanizer"); // Replace with your actual collection name

    const result = await collection.updateOne(
      { _id: new ObjectId(saveContentId) }, // Ensure the `saveContentId` is valid
      {
        $set: {
          copied: copied || false, // Defaults to false if not provided
          regenerated: regenerated || false, // Defaults to false if not provided
          updatedAt: new Date(), // Add a timestamp for updates
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "No content found with the provided ID." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Content updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
