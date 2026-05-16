import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected...');
  const result = await mongoose.connection.collection('cars').deleteMany({});
  console.log(`Deleted ${result.deletedCount} cars`);
  process.exit();
}).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});