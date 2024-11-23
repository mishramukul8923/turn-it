import createConnection from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email } = await req.json(); // Get the user's email (or other identifier)

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Create DB connection
        const db = await createConnection();

        // Add logout timestamp to the user's document
        const logoutTime = new Date();

        // Update the user document with the logout time
        const result = await db.collection("loginData").updateOne(
            { email },
            { $push: { logouts: { logoutTime } } } // Add to the 'logouts' array
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create the response object
        const response = NextResponse.json({ message: "Logout time recorded" }, { status: 200 });

        // Clear the token cookie by setting it with a past expiry date
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: new Date(0), // Expire immediately
        });

        return response;

    } catch (error) {
        console.error("Error saving logout time:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
