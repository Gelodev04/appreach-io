import mongoose from 'mongoose';
import { MONGODB_URI } from 'src/config-global';

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const dbMongoose = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Mongo Connection successfully established.');
  } catch (error) {
    throw new Error('Error connecting to Mongoose');
  }
};

export default dbMongoose;
