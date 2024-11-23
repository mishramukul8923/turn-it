import { hash, compare } from 'bcrypt'; // Ensure you have bcrypt installed
import createConnection from '@/app/lib/db'; // Adjust this path if necessary
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // Make sure to install jsonwebtoken

const SECRET_KEY = process.env.JWT_SECRET; // Replace with your secret key

export async function POST(req) {
    // Get the token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    console.log("Received token:", token);

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Decoded token:", decoded);

        // Check for token expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            return NextResponse.json({ error: 'Token expired' }, { status: 401 });
        }

        const userEmail = decoded.email; // Assuming the email is stored in the token
        const { currentPassword, newPassword, confirmNewPassword } = await req.json();
        console.log("Current password:", currentPassword);
        console.log("New password:", newPassword);
        console.log("Confirm password:", confirmNewPassword);

        // Validate passwords
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (newPassword !== confirmNewPassword) {
            return NextResponse.json({ error: 'New password and confirmation do not match' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 });
        }

        // Create a connection to the database
        const db = await createConnection();
        
      // Fetch the user's current password from the database
    const user = await db.collection('user').findOne({ email: userEmail });
    console.log("User from database:", user);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log("User's current password in DB:", user.password);

    // Compare the current password with the stored hashed password
    const isCurrentPasswordValid = await compare(currentPassword, user.password);
    console.log("Is current password valid?", isCurrentPasswordValid);

    if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);
    console.log("Hashed new password:", hashedPassword);

    // Update the user's password in the database
    const result = await db.collection('user').updateOne(
        { email: userEmail },
        { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount > 0) {
        return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
    } else {
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }

} catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
}
}
