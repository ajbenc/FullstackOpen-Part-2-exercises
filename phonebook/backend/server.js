import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import personRoutes from './routes/persons.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/persons', personRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});