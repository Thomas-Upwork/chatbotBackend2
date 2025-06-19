import mongoose from 'mongoose';
import 'dotenv/config';

const mongoConnectionString = process.env.mongoConnectionString || '';

export const dbConnection = async () => {
  try {
    await mongoose.connect(mongoConnectionString);
    console.log('Connected to database');
  } catch (err) {
    console.error(`Error connecting to database: ${err}`);
    throw new Error(`Error connecting to database: ${err}`);
  }
};

// Gracefully close the Mongoose connection
export const closeDBConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('Mongoose connection closed');
  } catch (err) {
    console.error('Error closing Mongoose connection:', err);
  }
};
