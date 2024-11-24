import createConnection from "@/app/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { userId, firstname, lastname, email } = body;
       
        console.log('Request body:', body);
        console.log('Extracted fields:', {
            userId, firstname, lastname, email
        });

        if (!userId) {
            console.log('Missing userId in request');
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Connect to MongoDB
        const db = await createConnection();
        console.log('Database connection established');

        // Create update object with only provided fields
        const updateFields = {};
        if (firstname) updateFields.firstname = firstname;
        if (lastname) updateFields.lastname = lastname;
        if (email) updateFields.email = email;

        console.log('Update fields to be applied:', updateFields);

        // Update user document
        const result = await db.collection("user").updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateFields }
        );

        console.log('MongoDB update result:', result);

        if (result.matchedCount === 0) {
            console.log('No user found with ID:', userId);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log('Profile updated successfully');
        return NextResponse.json({
            message: "Profile updated successfully",
            success: true
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({
            error: "Failed to update profile",
            success: false
        }, { status: 500 });
    }
}