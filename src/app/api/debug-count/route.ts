import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Question } from '@/lib/models';

export async function GET() {
    try {
        await connectDB();
        const count = await Question.countDocuments({});
        return NextResponse.json({ count });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
