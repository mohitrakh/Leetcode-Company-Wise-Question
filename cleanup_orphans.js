const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function cleanupOrphans() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionName = collections.find(c => c.name === 'progress' || c.name === 'progresses')?.name;

        if (!collectionName) {
            console.log('Progress collection not found');
            return;
        }

        const progress = await mongoose.connection.collection(collectionName).find().toArray();
        console.log(`Total ${collectionName} Entries before cleanup:`, progress.length);

        const questionIds = new Set(progress.map(p => p.questionId));
        const questions = await mongoose.connection.collection('questions').find({ _id: { $in: Array.from(questionIds) } }).project({ _id: 1 }).toArray();
        const foundQuestionIds = new Set(questions.map(q => q._id));

        const orphans = progress.filter(p => !foundQuestionIds.has(p.questionId));
        console.log('Orphans to delete:', orphans.length);

        if (orphans.length > 0) {
            const orphanIds = orphans.map(p => p._id);
            const result = await mongoose.connection.collection(collectionName).deleteMany({ _id: { $in: orphanIds } });
            console.log('Deleted orphans:', result.deletedCount);
        }

        const remaining = await mongoose.connection.collection(collectionName).countDocuments();
        console.log(`Total ${collectionName} Entries after cleanup:`, remaining);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

cleanupOrphans();
