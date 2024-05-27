import mongoose from 'mongoose';
import { MONGODB_URI } from 'src/config-global';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined');
}

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGODB_URI as string);
    if (connection.readyState === 1) {
      console.log('MongoDB Connected');
      return true;
    }
    return false; // Added to handle the case where connection.readyState is not 1
  } catch (error) {
    console.error(error);
    return false; // Changed to return false instead of rejecting the promise
  }
};
