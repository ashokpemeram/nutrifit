const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutrifit';
    
    // Set connection timeout to 3 seconds so fallback engages quickly if local MongoDB isn't running
    mongoose.set('strictQuery', false);
    
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[Database] Connected to MongoDB at ${mongoUri}`);
    } catch (err) {
      console.log('[Database] Local/Remote MongoDB not available. Starting in-memory MongoDB server...');
      mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB at ${inMemoryUri}`);
    }
  } catch (error) {
    console.error('[Database] Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
