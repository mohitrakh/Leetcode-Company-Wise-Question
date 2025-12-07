const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const QuestionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    appearances: [{
        company: String,
        period: String,
        frequency: Number,
        sourceFile: String
    }]
});

const Question = mongoose.model('Question', QuestionSchema);

async function inspectData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const sampleSlugQuestion = await Question.findOne({ _id: { $not: { $regex: /^\d+$/ } } }).lean();
        if (sampleSlugQuestion) {
            console.log('Sample Slug ID Question ID:', sampleSlugQuestion._id);
            console.log('Sample Slug ID Question Title:', sampleSlugQuestion.title);
        }

        const total = await Question.countDocuments();
        const numericIds = await Question.countDocuments({ _id: { $regex: /^\d+$/ } });
        const slugIds = await Question.countDocuments({ _id: { $not: { $regex: /^\d+$/ } } });

        console.log('Total Questions:', total);
        console.log('Numeric IDs:', numericIds);
        console.log('Slug/String IDs:', slugIds);

        const progressCount = await mongoose.connection.collection('progress').countDocuments();
        console.log('Total Progress Entries:', progressCount);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

inspectData();
