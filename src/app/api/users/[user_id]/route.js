import { NextResponse } from "next/server";
import createConnection from "@/app/lib/db";
import { ObjectId } from "mongodb";

// Named export for the GET method
export async function GET(req, { params }) {
  try {
    const { user_id: userId } =   await params; // Get user_id from the dynamic route
   
//  console.log("this is userid in api", userId)
    // Validate the userId format (MongoDB ObjectId)
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
    }

    // Connect to the database and fetch user data
    const  db  = await createConnection();
    const userData = await db.collection("user").findOne({ userId });

    // Return appropriate response
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
