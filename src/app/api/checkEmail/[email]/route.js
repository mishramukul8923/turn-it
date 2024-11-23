import { NextResponse } from "next/server";
import createConnection from "@/app/lib/db";

export async function GET(req, { params }) {
  try {
    const { email } = await params; // Extract email from dynamic route
    console.log("this is email i get", email)

    // Validate email format
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid or missing email" },
        { status: 400 }
      );
    }

    // Connect to the database
    const db = await createConnection();

    // Query the database for the user by email
    const userData = await db.collection("user").findOne({ email });

    // Check if the user was found
    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return the user data
    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
