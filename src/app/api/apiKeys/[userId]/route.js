import { NextResponse } from "next/server";
import createConnection from "@/app/lib/db";
import { ObjectId } from "mongodb";

// Named export for the GET method
export async function GET(req, { params }) {
  const { userId } =await params; // Extract userId from the dynamic route

  // Validate userId format
  if (!userId) {
    return NextResponse.json(
      { error: "Invalid userId format. Please provide a valid userId." },
      { status: 400 }
    );
  }

  try {
    // Connect to the database 
    const db = await createConnection();

    // Fetch user data by userId (since userId is a string in the database)
    const userData = await db.collection("apiKeys").findOne({ userId: userId });

    // Handle case where no user data is found
    if (!userData) {
      return NextResponse.json(
        { error: `User with ID ${userId} not found.` },
        { status: 404 }
      );
    }

    // Respond with the user data
    return NextResponse.json({ success: true, data: userData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);

    // Return an error response for unexpected server errors
    return NextResponse.json(
      { error: "An internal server error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
