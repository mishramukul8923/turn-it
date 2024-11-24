import { NextResponse } from "next/server";
import createConnection from "@/app/lib/db";

// GET function to retrieve subscription plans
export async function GET(request) {
    try {
        const db = await createConnection();
        const plans = await db.collection('subPlans').find().toArray();  // Fetch plans from 'subPlans'
        // console.log("Plans retrieved:", plans);

        return NextResponse.json(plans, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to retrieve subscription plans', error: error.message },
            { status: 500 }
        );
    }
}

// POST function to add a new subscription plan
export async function POST(request) {
    const db = await createConnection();

    try {
        // Parse the incoming request body
        const { userId, name, stripe_price_id, trial_days, have_trial, amount, type } = await request.json();

        // Validate required fields
        if (!userId || !name || !stripe_price_id || !amount) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Prepare the document to insert
        const newPlan = {
            userId,
            name,
            stripe_price_id,
            trial_days: trial_days || null,
            have_trial: have_trial || null,
            amount,
            type: type || "0",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Insert the document into the 'subPlans' collection
        const result = await db.collection("subPlans").insertOne(newPlan);

        // Respond with the inserted document's ID
        return NextResponse.json(
            { message: "Subscription plan added successfully", id: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding subscription plan:", error);
        return NextResponse.json(
            { message: "Failed to add subscription plan", error: error.message },
            { status: 500 }
        );
    }
}
