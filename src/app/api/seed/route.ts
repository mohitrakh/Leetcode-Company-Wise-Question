import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Question } from '@/lib/models';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET() {
    try {
        await connectDB();

        const dataDir = path.join(process.cwd(), 'leetcode-companywise-interview-questions-master');

        if (!fs.existsSync(dataDir)) {
            return NextResponse.json({ error: 'Data directory not found' }, { status: 404 });
        }

        const companyDirs = fs.readdirSync(dataDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        let totalProcessed = 0;
        const questionMap = new Map();

        for (const company of companyDirs) {
            const companyPath = path.join(dataDir, company);
            const files = fs.readdirSync(companyPath).filter(file => file.endsWith('.csv'));

            for (const file of files) {
                const filePath = path.join(companyPath, file);
                const fileContent = fs.readFileSync(filePath, 'utf-8');

                // Determine period from filename
                let period = 'all_time';
                if (file.includes('thirty-days')) period = '30 days';
                else if (file.includes('three-months')) period = '3 months';
                else if (file.includes('six-months')) period = '6 months';
                else if (file.includes('more-than-six-months')) period = '> 6 months';
                else if (file.includes('two-years')) period = '2 years';
                else if (file.includes('all')) period = 'All time';

                // Parse CSV
                const records: any[] = parse(fileContent, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true
                });

                for (const record of records) {
                    const title = record['Title'];
                    const url = record['URL'] || record['Link'];
                    const difficulty = record['Difficulty'];

                    if (!title || !url) continue;

                    const acceptanceStr = record['Acceptance %'] || record['Acceptance'] || '0';
                    const frequencyStr = record['Frequency %'] || record['Frequency'] || '0';

                    const acceptance = parseFloat(acceptanceStr.replace('%', '')) / 100;
                    const frequency = parseFloat(frequencyStr.replace('%', '')) / 100;

                    const appearance = {
                        company,
                        period,
                        frequency,
                        sourceFile: `${company}/${file}`
                    };

                    if (questionMap.has(title)) {
                        const existing = questionMap.get(title);
                        existing.companies.add(company);
                        existing.appearances.push(appearance);
                        // Update max frequency or other stats if needed
                    } else {
                        // Extract ID from URL if possible, or use title as fallback ID (not ideal but works for now)
                        // URL format: https://leetcode.com/problems/two-sum
                        const urlParts = url.split('/');
                        const slug = urlParts[urlParts.length - 1] || title.toLowerCase().replace(/\s+/g, '-');

                        questionMap.set(title, {
                            _id: slug, // Using slug as ID for consistency
                            title,
                            url,
                            difficulty,
                            acceptanceRate: acceptance,
                            companies: new Set([company]),
                            appearances: [appearance]
                        });
                    }
                    totalProcessed++;
                }
            }
        }

        // Bulk write to DB
        // Process in chunks to avoid memory issues or large payloads
        const BULK_SIZE = 500;
        let bulkOps = [];
        let processedCount = 0;

        for (const [title, data] of questionMap) {
            bulkOps.push({
                updateOne: {
                    filter: { _id: data._id },
                    update: {
                        $set: {
                            title: data.title,
                            url: data.url,
                            difficulty: data.difficulty,
                            acceptanceRate: data.acceptanceRate,
                            updatedAt: new Date(),
                            appearances: data.appearances
                        },
                        $addToSet: {
                            companies: { $each: Array.from(data.companies) as string[] }
                        }
                    },
                    upsert: true
                }
            });

            if (bulkOps.length >= BULK_SIZE) {
                await Question.bulkWrite(bulkOps);
                processedCount += bulkOps.length;
                bulkOps = [];
            }
        }

        if (bulkOps.length > 0) {
            await Question.bulkWrite(bulkOps);
            processedCount += bulkOps.length;
        }

        return NextResponse.json({
            message: 'Database seeded successfully',
            processed: totalProcessed,
            uniqueQuestions: questionMap.size,
            dbOperations: processedCount
        });

    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
