import createConnection from '@/app/lib/db';
import { NextResponse } from 'next/server';
import { ObjectId } from "mongodb"; // Import ObjectId for MongoDB ID handling

export const GET = async (request) => {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const db = await createConnection(); // Ensure createConnection is awaited

    let users;

    // Query MongoDB based on whether an ID is provided
    if (id) {
      // Validate ID format
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }
      users = await db.collection('user').findOne({ _id: new ObjectId(id) }); // Query by ObjectId
    } else {
      users = await db.collection('user').find().toArray(); // Retrieve all users
    }

    // If no users were found and an ID was provided, return an error
    if (!users && id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};


export const POST = async (req) => {
  try {
    const data = await req.json();
    const db = await createConnection(); // Connect to MongoDB

    const { firstname, lastname, email } = data;

    // Insert the new user document into the 'users' collection
    const result = await db.collection("user").insertOne({
      firstname,
      lastname,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "User created successfully", id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};


export const PATCH = async (request) => {
  try {
    const id = request.nextUrl.searchParams.get("id"); // Retrieve ID from URL
    const data = await request.json(); // Get the updated data from the request
    const db = await createConnection(); // Connect to the database

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { firstname, lastname, email } = data;

    // Check if the ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Update user in MongoDB collection
    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(id) }, // Match by ObjectId
      { $set: { firstname, lastname, email, updatedAt: new Date() } } // Set updated values
    );

    // If no document was updated
    if (result.modifiedCount === 0) {
      // Check if the document exists but wasn't modified (i.e., no changes)
      return NextResponse.json({ error: "User not found or no changes made" }, { status: 404 });
    }

    // Return success message
    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    // Catch any errors and return them in the response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};



// DELETE method for deleting a user
export const DELETE = async (request) => {
  try {
    const id = request.nextUrl.searchParams.get("id"); // Get user id from query string

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const db = await createConnection(); // Create a database connection
    const result = await db.collection("user").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};