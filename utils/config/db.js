import mongoose from 'mongoose';
import colors from 'colors';

colors.enable();

mongoose.set('strictQuery', true);

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`.underline.cyan);
};

export default connectDB;
