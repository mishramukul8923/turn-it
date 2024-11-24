// /src/app/api/fetchGeneratedContent/route.js
import { NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';

export const POST = async (req) => {
  try {
    // Connect to the database
    const db = await createConnection();
    const { id } = await req.json(); // Extract the user ID from the request body

    // Query the 'generator' collection, sort by 'createdAt' (latest first), and project only the 'text' field
    const results = await db.collection('generator')
      .find({ user_id: id }) // Fetch documents for the specific user
      .sort({ createdAt: -1 }) // Sort by 'createdAt' in descending order (latest first)
      .limit(3) // Limit to 3 documents
      .project({ text: 1,  createdAt:1 , generatedContent : 1 ,_id: 1 }) // Only include 'text' field and exclude '_id'
      .toArray(); // Convert the result into an array

    // console.log("Fetched text:", results);

    // Return the fetched text as a JSON response
    return NextResponse.json(
      { message: 'Content fetched successfully', data: results },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: 'Failed to fetch content', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
};
