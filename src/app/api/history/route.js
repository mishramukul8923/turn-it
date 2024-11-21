import createConnection from "@/app/lib/db";
import { NextResponse }  from "next/server";

export async function GET(req, { params }) {
  try {
    const { user_id } = params; // Get userId from route parameters

    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await createConnection();

    // Fetch documents from "generator" collection where userId matches
    const historyData = await db
      .collection("generator")
      .find({ user_id }) // Ensure userId in MongoDB matches the string format
      .toArray();

    // Return history data as JSON
    return NextResponse.json(historyData);
  } catch (error) {
    console.error("Error fetching history data:", error);
    return NextResponse.json({ error: "Failed to fetch history data." }, { status: 500 });
  }
}