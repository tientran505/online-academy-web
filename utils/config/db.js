import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

export default async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
