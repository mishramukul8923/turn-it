import bcrypt from 'bcrypt';
import createConnection from '@/app/lib/db';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';


export const POST = async (req) => {

    try {
        const data = await req.json();
        // console.log("Incoming request data:", data);
            return await handleLogin(data);
        
    } catch (error) {
        console.error("ERROR IS", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

// Function to handle user login

export const handleLogin = async (data) => {
    console.log("handleLogin running");
    const { email, password } = data; 

    // Validate required fields
    if (!email || !password) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        // Connect to MongoDB
        
        const db = await createConnection() // Use your database name
        const collection = db.collection('admin'); // Use the 'admin' collection

        // Check if the user exists
        const admin = await collection.findOne({ email }); // Find the admin by email
        console.log("Retrieved user from database:", admin);

        if (!admin) {
            // No user found
            return NextResponse.json({ error: "Admin does not exist" }, { status: 404 });
        }
        
        if (!admin.password) {
            // User exists, but has no password set (e.g., social login only)
            return NextResponse.json({ error: "Admin registered through social login. Please use social login." }, { status: 400 });
        }

        // Check if the password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(password, admin.password);
        console.log("Comparing passwords...");

        if (passwordMatch) {
            // Passwords match, generate JWT token
            const payload = { email }; // Simplified payload
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }); // Generate token

            // Return the token in the response
            return NextResponse.json({ message: "Admin Login successful", token }, { status: 200 });
        } else {
            // Passwords do not match
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
    } catch (error) {
        console.error("ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } 
};








