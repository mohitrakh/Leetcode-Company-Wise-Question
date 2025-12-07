const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await mongoose.connection.collection('questions').deleteMany({});
        console.log('Deleted questions:', result.deletedCount);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

cleanup();
