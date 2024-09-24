import mongoose from 'mongoose';
import { getMongoUri } from '../mongodb/get-uri';

const dbMongoose = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    const uri = getMongoUri();
    await mongoose.connect(uri);
    console.log('Mongo Connection successfully established.');
  } catch (error) {
    throw new Error('Error connecting to Mongoose');
  }
};

export default dbMongoose;
