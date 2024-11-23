// turnit/src/app/api/users/verifyEmail/route.js
import jwt from 'jsonwebtoken';
import createConnection from '@/app/lib/db';
// import User from '@/models/User';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  
  const token = searchParams.get('token');
// console.log('Extracting token from search parameters', token);

  if (!token) {
    console.log('Token is required');
    return new Response(JSON.stringify({ message: 'Token is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
   
    const { userId, newEmail } = decodedToken;
    //  console.log('Decoded Tokenfrom token field":', userId, newEmail);

    const db = await createConnection();

    const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      // console.log('User not found');
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    user.email = newEmail;
     // Update the user's email in the database
     await db.collection('user').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { email: newEmail } } // Use $set to update the email field
    );

    // console.log('Email updated successfully');
    return new Response(JSON.stringify({ message: 'Email updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    console.log('Invalid or expired token');
    return new Response(JSON.stringify({ message: 'Invalid or expired token' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}