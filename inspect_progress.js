const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function inspectProgress() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const collectionName = collections.find(c => c.name === 'progress' || c.name === 'progresses')?.name;

        if (collectionName) {
            const indexes = await mongoose.connection.collection(collectionName).indexes();
            console.log(`Indexes on ${collectionName}:`, JSON.stringify(indexes, null, 2));

            const progress = await mongoose.connection.collection(collectionName).find().toArray();
            console.log(`Total ${collectionName} Entries:`, progress.length);

            let numericIds = 0;
            let slugIds = 0;
            const questionIds = new Set();

            for (const p of progress) {
                if (/^\d+$/.test(p.questionId)) {
                    numericIds++;
                } else {
                    slugIds++;
                }
                questionIds.add(p.questionId);
            }

            console.log('Numeric Question IDs:', numericIds);
            console.log('Slug Question IDs:', slugIds);

            // Check for orphans
            const questions = await mongoose.connection.collection('questions').find({ _id: { $in: Array.from(questionIds) } }).project({ _id: 1 }).toArray();
            const foundQuestionIds = new Set(questions.map(q => q._id));

            let orphans = 0;
            for (const p of progress) {
                if (!foundQuestionIds.has(p.questionId)) {
                    orphans++;
                }
            }
            console.log('Orphaned Progress Entries (question not found):', orphans);

            // Check for duplicates by grouping by userId and questionId
            const map = new Map();
            let duplicates = 0;
            for (const p of progress) {
                const key = `${p.userId}-${p.questionId}`;
                if (map.has(key)) {
                    duplicates++;
                    // console.log('Duplicate found:', key, p);
                } else {
                    map.set(key, p);
                }
            }
            console.log('Duplicate count (exact match userId+questionId):', duplicates);

        } else {
            console.log('Progress collection not found');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

inspectProgress();
