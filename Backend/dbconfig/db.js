import process from 'node:process';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');
  } catch (err) {
    console.error('MongoDB connection error: ', err);
    process.exit(1);
  }
};

export default connectDB;
