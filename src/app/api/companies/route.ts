import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Question } from '@/lib/models';

export async function GET() {
    try {
        await connectDB();

        const companies = await Question.aggregate([
            { $unwind: "$companies" },
            { $group: { _id: "$companies", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        return NextResponse.json(companies);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
