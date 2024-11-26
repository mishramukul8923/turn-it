import bcrypt from 'bcrypt';
import createConnection from "../../lib/db";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendVerificationEmail } from '@/utils/sendEmail';

export const POST = async (req) => {
    const session = await getServerSession(authOptions);

    try {
        const data = await req.json();
        // Check if the request is for social login
        if (data?.social) {
            return await handleSocialLogin(session.user);
        } else {
            return await handleLogin(data);
        }
    } catch (error) {
        return NextResponse.json({ error: "An error occurred while processing your request.", details: error.message }, { status: 500 });
    }
};

const handleLogin = async (data) => {
    const { email, password } = data;
    // Validate required fields
    if (!email || !password) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await createConnection();
    const payload = {email}
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }); // Generate token
    console.log("token value in handel login", token)

    // Check if the user exists
    const users = await db.collection('user').findOne({ email });
    console.log("this is useer login user", users)
    const auth = users.auth;
    if (!users) {
        // No user found
        return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    if (users.password === null) {
        // User exists, but has no password set (e.g., social login only)
        return NextResponse.json({ error: "User registered through social login. Please use social login." }, { status: 400 });
    }
    if (!auth) {
        await sendVerificationEmail(email, token);

        return NextResponse.json(
          { message: 'Verification email resent. Please check your inbox.' },
          { status: 200 },
        );
        // return NextResponse.json({ error: "Please verify your email.." }, { status: 400 });

    }

    const { password: hashedPassword } = users;
    // Check if the password is provided and matches
    if (!password) {
        return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordMatch) {
        // Passwords match, generate JWT token
        // const payload = { email }; // Simplified payload
        // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }); // Generate token
        const firstname = users.firstname;
        const lastname = users.lastname;
        const id = users._id;
        const image = users.image;
        const plan_id = users.plan_id;
        const prompt = users.prompt


        let newPlan = -1; // Default to -1
        // Add login time to the user's logins array
        const loginTime = new Date();
        // Update the user document with the new login time and plan_id



        await db.collection('loginData').updateOne(

            { email },
            {
                $push: { logins: { loginTime } },
                $set: { userId: id },
                // $set: { plan_id: newPlan }
            },
            { upsert: true, new: true } // Create a new document if it doesn't exist
        );
        // Return the token in the response
        return NextResponse.json({ message: "Login successful", token, firstname, lastname, id, image, plan_id, prompt }, { status: 200 });
    } else {
        // Passwords do not match
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
};








// Social login handler
const handleSocialLogin = async (user) => {
    console.log("Handling social login...");
    const { email, name, image } = user;  // Assuming 'picture' is part of the social login response
    const [firstname, ...lastnameParts] = name.split(" ");
    const lastname = lastnameParts.join(" ");

    try {
        // Assuming createConnection establishes the DB connection
        const db = await createConnection();

        // Check if the user already exists
        const existingUser = await db.collection('user').findOne({ email });
        console.log("existingUser,", existingUser);

        // Generate token payload (adding more fields like id, image)
        let token;
        let userDetails = {
            firstname,
            lastname,
            email,
            image: image || null, // Assuming 'picture' is the user's profileimage from the social login
            plan_id: null, // You can adjust this if the user has a plan
            prompt: null // You can adjust this if the user has prompt details
        };

        if (existingUser) {
            console.log("User already exists. Logged in successfully.");

            // Extract additional user details if they exist
            const { _id: id, image, plan_id, prompt } = existingUser;
            token = jwt.sign({ email, id }, process.env.JWT_SECRET, { expiresIn: '24h' });  // JWT secret and expiration

            // Return the token along with user details
            return NextResponse.json({
                message: "User already exists. Logged in successfully.",
                token,
                firstname,
                lastname,
                email,
                id,
                image,
                plan_id,
                prompt
            }, { status: 200 });
        } else {
            // Insert new user with social login
            const result = await db.collection('user').insertOne({
                firstname,
                lastname,
                email,
                auth: false,
                social: true,
                image: image || null, // Store the user's profileimage
                plan_id: null, // Default value, can be updated later
                prompt: null // Default value, can be updated later
            });

            // Generate token
            token = jwt.sign({ email, id: result.insertedId }, process.env.JWT_SECRET, { expiresIn: '24h' });  // JWT secret and expiration

            console.log("User created successfully with social login.");
            return NextResponse.json({
                message: "User created successfully with social login.",
                token,
                firstname,
                email,
                lastname,
                id: result.insertedId,
                image: image || null,
                plan_id: null, // Or any value related to the plan
                prompt: null // Or any value related to the prompt
            }, { status: 201 });
        }
    } catch (error) {
        console.error("Error during social login:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
};
