import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import createConnection from '@/app/lib/db';
import { ObjectId } from 'mongodb';
// import User from '@/models/User'; // Adjust the model import

export async function POST(req) {
  const { userId, newEmail } = await req.json(); // Parse the JSON body

  if (!userId || !newEmail) {
    return new Response(JSON.stringify({ message: 'User ID and new email are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
   const db = await createConnection()

    // console.log(`Attempting to find user with ID: ${userId}`);
    // Assuming the collection name is 'users' and the method to find by ID is 'findOne'
    const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      // console.error(`User with ID: ${userId} not found`);
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // console.log('Generating token...');
    // Generate a token
    const token = jwt.sign(
      { userId, newEmail },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    console.log('Token generated:', token);

    console.log('Sending email...');
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verificationLink = `https://turnit.vercel.app/verifyEmailChange?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: newEmail,
      subject: 'Email Change Verification',
      html: `<p>Click the link below to verify your new email:</p>
             <a href="${verificationLink}">Verify Email</a>`,
    });
    console.log('Email sent to:', newEmail);

    return new Response(JSON.stringify({ message: 'Verification email sent' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
