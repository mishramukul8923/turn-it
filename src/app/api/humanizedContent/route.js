import { NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';
import { ObjectId } from "mongodb";

export const POST = async (req) => {
  try {
    // Parse the request body
    const { text, humanizedContent, user_id, email, copied, regenerated } = await req.json();

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

    // Fetch the user by email and insert content in one go
    const [users, result] = await Promise.all([
      db.collection('user').findOne({ email }),
      db.collection('humanizer').insertOne({
        text,
        humanizedContent,
        copied,
        regenerated,
        user_id,
        createdAt: new Date(),
      }),
    ]);

    if (!users) {
      console.error('User not found with email:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Determine the new plan
    let newPlan = users.plan_id;
    let myPrompt = users.prompt;
   
    if (users.plan_id == '-1' || new Date(users.expired_at) < new Date() || users.prompt == 0) {
      newPlan = '-1';
    } else if (users.prompt == -99) {
      // Do nothing, keep the same plan_id
    } else if (users.prompt > 0) {
      newPlan = users.plan_id;
      myPrompt = myPrompt - 1;
      await db.collection('user').updateOne(
        { email },
        { $set: { prompt: users.prompt - 1 } }
      );
    } else {
        newPlan = '-1';
    }

    // Update the user's plan_id
    await db.collection('user').updateOne(
      { email },
      { $set: { plan_id: newPlan } }
    );

    // Return a success response
    return NextResponse.json(
      {
        message: 'Content saved successfully',
        data: {
          insertedId: result.insertedId,
          plan_id: newPlan,
          prompt: myPrompt
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
