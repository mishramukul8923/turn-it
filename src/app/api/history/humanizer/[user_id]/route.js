import createConnection from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    // Await params before extracting user_id
    const { user_id } = await params;

    // Check if user_id exists and is valid
    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await createConnection();

    // Fetch documents from the "humanizer" collection where user_id matches
    const historyData = await db
      .collection("humanizer")
      .find({ user_id }) // Assuming user_id is stored as a string in MongoDB
      .toArray();

    // Return the history data as a JSON response
    return NextResponse.json(historyData);
  } catch (error) {
    console.error("Error fetching history data:", error);
    return NextResponse.json({ error: "Failed to fetch history data." }, { status: 500 });
  }
}