import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import UserActivity from "@/models/UserActivity";

export async function POST(req) {
  try {
    const { userId, email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Find the user activity record or create a new one
    const userActivity = await UserActivity.findOneAndUpdate(
      { email },
      {
        $setOnInsert: { userId }, // Set userId only if it's a new document
        $set: { userId }, // Ensure userId is updated if missing
        $push: {
          sessions: { loginTime: new Date() }, // Add a new session
        },
      },
      { upsert: true, new: true } // Create a new document if it doesn't exist
    );

    return NextResponse.json({
      message: "Login time added successfully.",
      userActivity,
    });
  } catch (error) {
    console.error("Error saving login time:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
