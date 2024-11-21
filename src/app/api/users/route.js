import createConnection from "../../lib/db";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/utils/sendEmail";
import { generateToken } from "@/utils/generateToken";
import { signIn, useSession, signOut } from 'next-auth/react'; // Import signIn from next-auth
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next"; // Correct import path for Next.js 13+



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
        const user = await db.collection('user').find(query).toArray(); // Fetch users based on the query

        return NextResponse.json(user); // Return the result as JSON
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: error.message });
    }
};


export const POST = async (req) => {
    const db = await createConnection()
    const session = await getServerSession(authOptions);


    try {
        const data = await req.json();
        // console.log("Incoming request data:", data);

        // Check if the request is for social login
        if (session) {
            console.log("User logged in, handling social login...");
            return await handleSocialLogin(session.user);
        } else {
            console.log("No session found, handling registration...");
            return await handleRegistration(data);
        }
    } catch (error) {
        console.error("ERROR IS", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};


// export const PUT = async (req) => {
//     let db;
//     try {
//         // Step 1: Connect to the database
//         db = await createConnection();
//         console.log("Database connection established.");

//         // Step 2: Parse the request body
//         let body;
//         try {
//             body = await req.json();
//             console.log("Received request body:", body);
//         } catch (error) {
//             console.error("Invalid JSON in request body:", error);
//             return NextResponse.json(
//                 { error: "Invalid JSON in request body." },
//                 { status: 400 }
//             );
//         }

//         // Step 3: Validate required fields
//         if (!body.email) {
//             console.error("Missing required 'email' field in request body.");
//             return NextResponse.json(
//                 { error: "The 'email' field is required in the request body." },
//                 { status: 400 }
//             );
//         }

//         const { email, ...updateFields } = body;

//         // Step 4: Ensure there are fields to update
//         if (!Object.keys(updateFields).length) {
//             console.error("No fields provided to update.");
//             return NextResponse.json(
//                 { error: "At least one key-value pair is required to update." },
//                 { status: 400 }
//             );
//         }

//         // Step 5: Restrict certain fields from being updated
//         const restrictedFields = ['_id', 'password', 'createdAt'];
//         if (Object.keys(updateFields).some((key) => restrictedFields.includes(key))) {
//             console.error("Attempted update contains restricted fields.");
//             return NextResponse.json(
//                 { error: "Update contains restricted fields." },
//                 { status: 400 }
//             );
//         }

//         // Step 6: Perform the database update
//         try {
//             const result = await db.collection('user').findOneAndUpdate(
//                 { email },
//                 { $set: updateFields },
//                 { returnDocument: 'after' }
//             );

//             // Handle case where the user is not found
//             if (!result.email) {
//                 console.error(`User not found with email: ${email}`);
//                 return NextResponse.json(
//                     { error: "User not found with the provided email." },
//                     { status: 404 }
//                 );
//             }

//             // Return the updated user (excluding sensitive fields)
//             // const { _id, ...user } = result.value;
//             // console.log("User updated successfully:", user);
//             return NextResponse.json({
//                 message: "User updated successfully.",
//                 // user,
//             });
//         } catch (queryError) {
//             console.error("Database query failed:", queryError);
//             return NextResponse.json(
//                 { error: "An error occurred while updating the user." },
//                 { status: 500 }
//             );
//         }
//     } catch (error) {
//         console.error("Unexpected API error:", error);
//         return NextResponse.json(
//             { error: "An internal server error occurred." },
//             { status: 500 }
//         );
//     }

    

// };



export const PUT = async (req) => {
    let db;

    try {
        // Step 1: Connect to the database
        db = await createConnection();
        console.log("Database connection established.");

        // Step 2: Parse and validate the request body
        let body;
        try {
            body = await req.json();
        } catch (error) {
            console.error("Invalid JSON in request body:", error);
            return NextResponse.json(
                { error: "Invalid JSON in request body." },
                { status: 400 }
            );
        }

        const { email, subscription, ...updateFields } = body;

        // Step 4: Validate email-based updates
        if (!email) {
            console.error("Missing required 'email' field in request body.");
            return NextResponse.json(
                { error: "The 'email' field is required in the request body." },
                { status: 400 }
            );
        }

        // Step 5: Handle subscription updates if provided
        if (Array.isArray(subscription) && subscription.length > 0) {
            // Fetch the current user document to get existing subscriptions
            const currentUser = await db.collection("user").findOne({ email });
            console.log("currentUser : ", currentUser);
            if (currentUser && Array.isArray(currentUser.subscription)) {
                // Append new subscriptions to the existing array
                const updatedSubscriptions = [...new Set([...currentUser.subscription, ...subscription])]; // Use Set to avoid duplicates
                updateFields.subscription = updatedSubscriptions; // Set the updated subscriptions
            } else {
                updateFields.subscription = subscription; // If no existing subscriptions, just set the new ones
            }
            console.log("updateFields : ", updateFields);

        }

        // Ensure there are fields to update
        if (!Object.keys(updateFields).length) {
            console.error("No fields provided to update.");
            return NextResponse.json(
                { error: "At least one key-value pair is required to update." },
                { status: 400 }
            );
        }

        const restrictedFields = ["_id", "password", "createdAt"];
        if (Object.keys(updateFields).some((key) => restrictedFields.includes(key))) {
            console.error("Attempted update contains restricted fields.");
            return NextResponse.json(
                { error: "Update contains restricted fields." },
                { status: 400 }
            );
        }

        // Step 6: Perform the email-based database update
        try {
            const result = await db.collection("user").findOneAndUpdate(
                { email },
                { $set: updateFields },
                { returnDocument: "after" }
            );

            if (!result.email) {
                console.error(`User not found with email: ${email}`);
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
        } catch (updateError) {
            console.error("Error updating user:", updateError);
            return NextResponse.json(
                { error: "An error occurred while updating the user." },
                { status: 500 }
            );
        }
    } catch (connectionError) {
        console.error("Unexpected API error:", connectionError);
        return NextResponse.json(
            { error: "An internal server error occurred." },
            { status: 500 }
        );
    }
};





/// Social login handler
const handleSocialLogin = async (user) => {
    console.log("Handling social login...");
    const { email, name } = user;
    const nameParts = name.split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ");

    const db = await createConnection(); // Get the MongoDB database instance

    try {
        // Check if the user already exists
        const existingUser = await db.collection('user').findOne({ email });

        if (existingUser) {
            console.log("User already exists. Logged in successfully.");
            return NextResponse.json({ message: "User already exists. Logged in successfully." }, { status: 200 });
        } else {
            // Insert the new user into the MongoDB collection
            const newUser = {
                firstname,
                lastname,
                email,
                password: null, // Set password to null for social users
                auth: false,    // Adjust as per your requirements
                social: true,   // Mark as social user
                temporary: false, // Adjust as per your requirements
                resetToken: null, // Additional fields as required
                resetTokenExpiration: null,
                subscription: [], // Adjust as per your requirements
                token: null // Additional field if needed
            };

            await db.collection('user').insertOne(newUser); // Insert the new user document
            console.log("User created successfully with social login.");
            return NextResponse.json({ message: "User created successfully with social login." }, { status: 201 });
        }
    } catch (error) {
        console.error("Error during social login:", error);
        return NextResponse.json({ error: "Social login failed" }, { status: 500 });
    }
};

// User registration handler
const handleRegistration = async (data) => {
    const { firstname, lastname, email, password, plan_id } = data;

    // Validate required fields
    if (!firstname || !lastname || !email || !password) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await createConnection();

    try {
        // Check if the user already exists
        const existingUser = await db.collection('user').findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        } else {
            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert the new user into the MongoDB collection
            const newUser = {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                auth: false,      // Adjust as per your requirements
                social: false,    // Adjust as per your requirements
                temporary: true,  // Adjust as per your requirements
                resetToken: null, // Additional fields as required
                resetTokenExpiration: null,
                subscription: [], // Adjust as per your requirements
                token: null,         // Additional field if needed
                createdAt: new Date(),  // Set the createdAt timestamp to the current date and time
                updatedAt: new Date(),  // Set the updatedAt timestamp to the current date and time
                logins: [
                    {
                        loginTime: { type: Date, default: Date.now },
                        logoutTime: { type: Date },
                    },
                ],
                plan_id: plan_id

            };

            await db.collection('user').insertOne(newUser); // Insert the new user document

            // Generate verification token
            const token = generateToken(email);

            // Send verification email
            await sendVerificationEmail(email, token);

            return NextResponse.json({ message: "User created successfully" }, { status: 201 });
        }
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
};

