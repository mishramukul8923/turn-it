import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import createConnection from '@/app/lib/db';

export async function POST(request) {
    const db = await createConnection();
    
    try {
        // Parse the JSON body from the request
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false, error: "No email provided" });
        }

        // Fetch the user to get the image path
        const user = await db.collection('user').findOne({ email });
        if (!user || !user.image) {
            return NextResponse.json({ success: false, error: "No image found for this user" });
        }

        // Get the image file path
        const imagePath = path.join(process.cwd(), 'public', user.image); // Join with public folder

        // Remove the image file from the server
        try {
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Synchronously remove the file
                console.log(`Image file ${imagePath} successfully removed`);
            } else {
                console.error(`Image file ${imagePath} does not exist.`);
                return NextResponse.json({ success: false, error: "Image file does not exist" });
            }
        } catch (fileError) {
            console.error('Error removing image file:', fileError.message);
            return NextResponse.json({ success: false, error: `Failed to remove image file: ${fileError.message}` });
        }

        // Update the user's image field to null in the database
        await db.collection('user').updateOne(
            { email },
            { $unset: { image: "" } } // Unset the image field
        );

        return NextResponse.json({ response: "Profile image removed successfully", success: true });

    } catch (error) {
        console.error('Error removing image:', error.message);
        return NextResponse.json({ error: `Failed to remove image: ${error.message}` }, { status: 500 });
    }
}
