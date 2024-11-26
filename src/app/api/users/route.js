import createConnection from "../../lib/db";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/utils/sendEmail";
import { generateToken } from "@/utils/generateToken";
import { signIn, useSession, signOut } from 'next-auth/react'; // Import signIn from next-auth
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next"; // Correct import path for Next.js 13+
import  jwt  from "jsonwebtoken";


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
        const user = await db.collection('user').findOne(query); // Fetch a single user based on the query

        // Check if the user's expired_at has passed
        if (user && user.expired_at && new Date(user.expired_at) < new Date()) {
            const firstPlanId = user.plan_queue[0]; // Get the first plan_id from plan_queue

            if (firstPlanId) {
                // Find the subscription entry with the first plan_id
                const subscriptions = await db.collection('subscription').find({
                    plan_id: firstPlanId,
                    userId: user._id // Assuming userId is the field in subscription collection
                }).toArray();

                // If multiple subscriptions are found, find the one with the nearest started_at date
                let selectedSubscription = null;
                if (subscriptions.length > 0) {
                    selectedSubscription = subscriptions.reduce((prev, curr) => {
                        return new Date(curr.started_at) > new Date(prev.started_at) ? prev : curr;
                    });
                }

                // If a subscription entry is found, update the user
                if (selectedSubscription) {
                    user.plan_id = firstPlanId; // Update plan_id
                    user.expired_at = selectedSubscription.expired_at; // Update expired_at
                    user.prompt = selectedSubscription.prompt; // Update prompt
                    user.plan_queue.shift(); // Remove the first entry from plan_queue

                    // Update the user in the database
                    await db.collection('user').updateOne(
                        { _id: user._id },
                        { $set: { plan_id: user.plan_id, expired_at: user.expired_at, prompt: user.prompt, plan_queue: user.plan_queue } }
                    );
                }
            }
        }

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
        if (data?.social) {
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

        const { email, plan_id, expired_at, prompt, subscription, ...updateFields } = body;

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
            if (currentUser && Array.isArray(currentUser.subscription)) {
                // Append new subscriptions to the existing array
                const updatedSubscriptions = [...new Set([...currentUser.subscription, ...subscription])]; // Use Set to avoid duplicates
                updateFields.subscription = updatedSubscriptions; // Set the updated subscriptions
            } else {
                updateFields.subscription = subscription; // If no existing subscriptions, just set the new ones
            }
        }

        // Check if user exists
        const currentUser = await db.collection("user").findOne({ email });
        if (!currentUser) {
            console.error(`User not found with email: ${email}`);
            return NextResponse.json(
                { error: "User not found with the provided email." },
                { status: 404 }
            );
        }

        // Check if expired_at is not expired
        const currentDate = new Date();

        // Update plan_id, expired_at, and prompt
        updateFields.plan_id = plan_id; // Update plan_id
        updateFields.expired_at = expired_at; // Update expired_at
        updateFields.prompt = prompt; // Update prompt


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
    // console.log("thiis is user datd in social login", user)
    console.log("Handling social login... on registration page");
    const { email, name } = user;
    const nameParts = name.split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ");
    

    const db = await createConnection(); // Get the MongoDB database instance

    try {
        // Check if the user already exists
        const existingUser = await db.collection('user').findOne({ email });
        // console.log("this is exixting user", existingUser)
       
        if (existingUser) {
            const id = existingUser?._id
            const plan_id =existingUser?.plan_id || -1 ;
            const prompt =existingUser?.prompt  || 0;
            const image = existingUser?.image || null;
            
            const payload = {email};
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }); // JWT secret and expiration
            console.log("User already exists. Logged in successfully.");
            return NextResponse.json({ message: "User already exists. Logged in successfully.",  token,
                firstname,
                lastname,
                email,
                id,
                image,
                plan_id,
                prompt }, { status: 200 });
        } else {
            // Insert new user with social login
            const result = await db.collection('user').insertOne({
              firstname,
              lastname,
              email,
              auth: true,
              social: true,
              image: null, // Store the user's profileimage
              plan_id: -1, // Default value, can be updated later
              prompt: 0 // Default value, can be updated later
            });
      
            // Generate token
            const token = jwt.sign({ email}, process.env.JWT_SECRET, { expiresIn: '24h' });
      
            console.log("User created successfully with social login.");
            return NextResponse.json({
              message: "User created successfully with social login.",
              token,
              firstname,
              email,
              lastname,
              id: result.insertedId,
              image:null,
              plan_id: null, // Or any value related to the plan
              prompt: null // Or any value related to the prompt
            }, { status: 201 });
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
                // resetToken: null, // Additional fields as required
                // resetTokenExpiration: null,
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

