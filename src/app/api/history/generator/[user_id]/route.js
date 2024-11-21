import createConnection from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {

  const { user_id } = await params; // Extract user_id from params

  try {
    
  
    // Check if user_id exists and is valid
    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await createConnection();

    // Fetch documents from the "generator" collection where user_id matches
    const historyData = await db
      .collection("generator")
      .find({ user_id }) // Assuming user_id is stored as a string in MongoDB
      .toArray();

    // Return the history data as a JSON response
    return NextResponse.json(historyData);
  } catch (error) {
    console.error("Error fetching history data:", error);
    return NextResponse.json({ error: "Failed to fetch history data." }, { status: 500 });
  }
}