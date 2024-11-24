import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique names
import createConnection from '@/app/lib/db';

export async function POST(request) {
    const db = await createConnection();
    try {
        const data = await request.formData();
        const file = data.get('file');
        const email = data.get('email'); // Assume email is sent along with the file

        if (!file || !email) {
            return NextResponse.json({ success: false, error: "No file or email provided" });
        }

        if (typeof file.arrayBuffer !== 'function') {
            throw new Error('File does not support arrayBuffer conversion');
        }

        const bufferData = await file.arrayBuffer();
        const buffer = Buffer.from(bufferData);
        const randomName = `${uuidv4()}-${file.name}`; // Generate a unique name

        // Define the upload directory and file path
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const filePath = path.join(uploadDir, randomName);
        const relativeFilePath = `/uploads/${randomName}`; // Relative path to save in the database

        // Ensure the uploads directory exists
        await mkdir(uploadDir, { recursive: true });

        // Write the file to the server
        await writeFile(filePath, buffer);

        // Update the user's profile picture path in the database
        await db.collection('user').updateOne(
            { email }, // Filter to find the specific user by email
            { $set: { image: relativeFilePath } } // Set the new image path
        );

        return NextResponse.json({ response: "File uploaded and path saved successfully", success: true });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'File upload or database update failed' }, { status: 500 });
    }
}
