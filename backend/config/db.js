const mongoose = require('mongoose');

let offlineMode = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farm2city', {
      serverSelectionTimeoutMS: 2000 // 2-second quick timeout to fallback to offline JSON DB
    });
    console.log(`\x1b[32m%s\x1b[0m`, ` >>> MongoDB Connected: ${conn.connection.host} <<<`);
    offlineMode = false;
  } catch (error) {
    console.log(`\x1b[33m%s\x1b[0m`, ` >>> MongoDB connection failed (${error.message}). Falling back to Offline JSON Database Engine <<<`);
    offlineMode = true;
  }
};

const isOffline = () => offlineMode;

module.exports = { connectDB, isOffline };
