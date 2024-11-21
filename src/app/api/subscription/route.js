import createConnection from "../../lib/db";
import { NextResponse } from "next/server";


export const GET = async (req) => {
    try {
        const db = await createConnection(); // Ensure you're getting the db from your MongoDB connection

        const { searchParams } = new URL(req.url); // Get URL parameters
        const email = searchParams.get('email'); // Extract the email parameter

        let query = {};

        // If an email is provided, set the query filter
        if (email) {
            query.email = email;
        }

        // Use the find method to get users
        const user = await db.collection('subscription').find(query).toArray(); // Fetch users based on the query

        return NextResponse.json(user); // Return the result as JSON
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: error.message });
    }
};
