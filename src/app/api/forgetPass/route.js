import createConnection from '@/app/lib/db'; // MongoDB connection utility
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail } from '@/utils/sendEmail'; // Ensure this function is defined properly

export async function POST(req) {
    const { email } = await req.json();

    if (!email) {
        return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
    }

    const db = await createConnection(); // MongoDB connection

    // Check if the user exists in the MongoDB collection
    const user = await db.collection('user').findOne({ email });

    if (!user) {
        return new Response(JSON.stringify({ message: 'User with this email does not exist' }), { status: 404 });
    }

    // Generate a reset token (JWT)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Send the password reset email
    try {
        await sendResetPasswordEmail(email, token);
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ message: 'Failed to send reset email. Please try again later.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Password reset link sent. Please check your email.' }), { status: 200 });
}
