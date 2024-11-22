import { NextResponse } from 'next/server';
import createConnection from '@/app/lib/db';

export const POST = async (req) => {
  try {
    const { text, generatedContent, user_id, email, copied } = await req.json();

    if (!text || !generatedContent) {
      return NextResponse.json(
        { error: 'Text and generatedContent are required' },
        { status: 400 }
      );
    }

    const db = await createConnection();

    const [users, humanizerCount, generatorCount] = await Promise.all([
      db.collection('user').findOne({ email }),
      db.collection('humanizer').countDocuments({ user_id }),
      db.collection('generator').countDocuments({ user_id })
    ]);

    if (!users) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let newPlan = users.plan_id;

    if (users.plan_id === '-1' || new Date(users.expired_at) < new Date() || users.prompt === 0) {
      newPlan = '-1';
    } else if (users.prompt === -1) {
      // Do nothing, keep the same plan_id
    } else if (users.prompt > 0) {
      newPlan = users.plan_id;
      await db.collection('user').updateOne(
        { email },
        { $set: { prompt: users.prompt - 1 } }
      );
    } else {
      if (humanizerCount > 2 && generatorCount > 2) {
        newPlan = '-1';
      } else if (generatorCount > 2) {
        newPlan = '-3';
      } else if (humanizerCount > 2) {
        newPlan = '-2';
      } else {
        newPlan = '0';
      }
    }

    await db.collection('user').updateOne(
      { email },
      { $set: { plan_id: newPlan } }
    );

    const result = await db.collection('generator').insertOne({
      text,
      generatedContent,
      user_id,
      copied,
      createdAt: new Date(),
    });

    result.plan_id = newPlan;
    return NextResponse.json(
      { message: 'Content saved successfully', data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
};
