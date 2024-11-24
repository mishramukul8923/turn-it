import createConnection from '@/app/lib/db'; // Assuming this handles MongoDB connection
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function POST(req) {
  const { token, password } = await req.json();

  // Validate input
  if (!token || !password) {
    return new Response(JSON.stringify({ message: 'Token and password are required' }), { status: 400 });
  }

  const db = await createConnection();

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password in the database using MongoDB
    const result = await db.collection('user').updateOne(
      { email }, // Find user by email
      { $set: { password: hashedPassword } } // Set the new password
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: 'User not found or already reset' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Password reset successfully' }), { status: 200 });
  } catch (error) {
    console.error("Error during password reset:", error);
    return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 400 });
  }
}
