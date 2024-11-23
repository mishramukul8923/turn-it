// import { NextResponse } from "next/server";
// import createConnection from "@/app/lib/db";

// export async function POST(req) {
//     try {
//         const db = await createConnection();

//         // Parse the request body
//         const {userId, gptZeroApiKey, zeroGptApiKey, originalityApiKey, copyLeaksApiKey } = await req.json();

//         // Validate required data
//         if ( !userId ,!gptZeroApiKey || !zeroGptApiKey || !originalityApiKey || !copyLeaksApiKey) {
//             return NextResponse.json(
//                 { error: "All API keys are required." },
//                 { status: 400 }
//             );
//         }

//         // Insert API keys into the 'apiKeys' collection
//         const result = await db.collection('apiKeys').insertOne({
//             userId,
//             gptZeroApiKey,
//             zeroGptApiKey,
//             originalityApiKey,
//             copyLeaksApiKey,
//             createdAt: new Date(),
//         });

//         // Respond with success and the saved data
//         return NextResponse.json({ message: "API keys saved successfully", data: result }, { status: 200 });
//     } catch (error) {
//         console.log("Error handling request:", error);
//         return NextResponse.json({ error: "Failed to save API keys" }, { status: 500 });
//     }
// }


// import { NextResponse } from "next/server";
// import createConnection from "@/app/lib/db";

// export async function POST(req) {
//     try {
//         const db = await createConnection();

//         // Parse the request body
//         const { userId, gptZeroApiKey, zeroGptApiKey, originalityApiKey, copyLeaksApiKey } = await req.json();

//         // Filter out undefined or empty fields
//         const apiKeyData = {
//             ...(gptZeroApiKey && { gptZeroApiKey }),
//             ...(zeroGptApiKey && { zeroGptApiKey }),
//             ...(originalityApiKey && { originalityApiKey }),
//             ...(copyLeaksApiKey && { copyLeaksApiKey }),
//         };

//         // Check if there's at least one API key provided
//         if (Object.keys(apiKeyData).length === 0) {
//             return NextResponse.json(
//                 { error: "Please provide at least one API key." },
//                 { status: 400 }
//             );
//         }

//         // Insert API keys into the 'apiKeys' collection
//        // Insert API keys into the 'apiKeys' collection
// const result = await db.collection('apiKeys').insertOne({
//     ...apiKeyData, // Include API key data
//     userId: (userId), // Add userId (ensure it's in ObjectId format if using MongoDB ObjectId)
//     createdAt: new Date(), // Record creation timestamp
// });


//         // Respond with success and the saved data
//         return NextResponse.json({ message: "API keys saved successfully", data: result }, { status: 200 });
//     } catch (error) {
//         console.log("Error handling request:", error);
//         return NextResponse.json({ error: "Failed to save API keys" }, { status: 500 });
//     }
// }


// import { NextResponse } from "next/server";
// import createConnection from "@/app/lib/db";

// export async function GET() {
//     try {
//         const db = await createConnection();
//         const apiKeys = await db.collection('apiKeys').findOne({});
//         return NextResponse.json(apiKeys || {});
//     } catch (error) {
//         console.log("Error fetching API keys:", error);
//         return NextResponse.json({ error: "Failed to load API keys" }, { status: 500 });
//     }
// }

import { NextResponse } from "next/server";
import createConnection from "@/app/lib/db";


export async function POST(req) {
  try {
    // Establish database connection
    const db = await createConnection();

    // Parse request body
    const { userId, cloudKey } = await req.json();

    // Construct the API key data to update
    // Validate request data
    if (!userId ) {
      return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
    }

    // Perform the update operation
    const result = await db.collection("apiKeys").updateOne(
      { userId: userId }, // Match by userId
      { $set: { cloudKey : cloudKey, updatedAt: new Date() } }, // Update fields and set updatedAt timestamp
      { upsert: true } // Create a new document if no match is found
    );

    // Return success response
    return NextResponse.json(
      { message: "API keys updated successfully", modifiedCount: result.modifiedCount, upsertedId: result.upsertedId },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating API keys:", error);
    return NextResponse.json({ error: "Failed to update API keys" }, { status: 500 });
  }
}
