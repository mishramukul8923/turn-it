import createConnection from "../../lib/db";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
    let db;
    let updateFields = {}; // Initialize updateFields

    try {
        // Connect to the database
        db = await createConnection();

        // Parse and validate the request body
        let body = await req.json();
        const { email, subscription } = body;

        // Validate email
        if (!email) {
            return NextResponse.json(
                { error: "The 'email' field is required in the request body." },
                { status: 400 }
            );
        }

        // Handle subscription updates if provided
        if (Array.isArray(subscription) && subscription.length > 0) {
            const currentUser = await db.collection("user").findOne({ email });
            console.log("currentUser : ", currentUser)
            if (currentUser && Array.isArray(currentUser.subscription)) {
                // Remove specified subscriptions from the existing array
                const updatedSubscriptions = currentUser.subscription.filter(
                    (sub) => !subscription.includes(sub)
                );
                updateFields.subscription = updatedSubscriptions; // Set the updated subscriptions
            }
        }

        console.log("my payload : ", body)
        console.log("my updateFields : ", updateFields)

        // Ensure there are fields to update
        if (!Object.keys(updateFields).length) {
            return NextResponse.json(
                { error: "At least one key-value pair is required to update." },
                { status: 400 }
            );
        }

        // Perform the email-based database update
        const result = await db.collection("user").findOneAndUpdate(
            { email },
            { $set: updateFields },
            { returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json(
                { error: "User not found with the provided email." },
                { status: 404 }
            );
        }

        const { _id, ...updatedUser } = result;

        return NextResponse.json(
            {
                message: "User updated successfully.",
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "An internal server error occurred." },
            { status: 500 }
        );
    }
};