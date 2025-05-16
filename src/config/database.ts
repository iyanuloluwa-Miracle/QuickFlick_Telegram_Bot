import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection function
export const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MongoDB connection string is not defined in environment variables');
    }
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB successfully✔');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};