import createConnection from '@/app/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";
import { sendVerificationEmail  } from "@/utils/sendEmail";
import { generateToken } from "@/utils/generateToken";







export const GET = async () => {
    try {
        const db = await createConnection(); // Ensure the connection is awaited as a function
      
  
        const posts = await db.collection('admin').find().toArray(); // Fetch all admin documents
      
        return NextResponse.json(posts); // Return the result as JSON
    } catch (error) {
      
        return NextResponse.json({ error: error.message });
    }
};




export const POST = async (req) => {
    const db = await  createConnection()
    const { firstname, lastname, email, password } = await req.json();
    
    // Validate required fields
    if (!firstname || !lastname || !email || !password) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already exists
    const checkUserSql = 'SELECT * FROM admin WHERE email = ?';
    // const [existingUser] = await db.query(checkUserSql, [email]);
        const existingUser = await db.collection('admin').findOne({email})

        if (existingUser) {
            return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
        } else {
            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create the new admin object
            const newAdmin = {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role: "admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

             // Insert the new user into MongoDB
             await db.collection('admin').insertOne(newAdmin);

        // Generate verification token
        const token = generateToken(email);

        // Send verification email
        await sendVerificationEmail(email, token);

        return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
    }
};








