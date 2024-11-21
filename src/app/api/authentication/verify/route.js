import createConnection from '@/app/lib/db'; // Assuming this handles MongoDB connection
import jwt from 'jsonwebtoken';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  
  if (!token) {
    return new Response(JSON.stringify({ message: 'Token is required' }), { status: 400 });
  }

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const db = await createConnection(); // Await the DB connection

    // Update the user's auth status in MongoDB
    const result = await db.collection('user').updateOne(
      { email }, // Find the user by email
      { $set: { auth: 1 } } // Update the auth status to 1 (verified)
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: 'User not found or already verified' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Email verified. You can now log in.' }), { status: 200 });
  } catch (error) {
    console.error("Error during verification:", error);
    return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 400 });
  }
}
