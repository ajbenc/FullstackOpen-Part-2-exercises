import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import personRoutes from './routes/persons.js';

dotenv.config();

const app = express();
const allowedOrigins = [
  'https://fullstackopen-part-2-exercises.pages.dev/', // Cloudflare
  'http://localhost:5173' // Local dev
];

// Middleware
app.use(cors({
  origin: [
    'https://fullstackopen-part-2-exercises.pages.dev/',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//Add helmet security

app.use(helmet());

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