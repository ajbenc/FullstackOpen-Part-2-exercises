import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import personRoutes from './routes/persons.js';

dotenv.config();

const app = express();

// server.js - Full CORS setup

const corsOptions = {
  origin: [
    'https://fullstackopen-part-2-exercises.pages.dev',
    /https:\/\/.*--fullstackopen-part-2-exercises\.pages\.dev/,
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Enable preflight for all routes
app.options('*', cors(corsOptions)); 
app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '86400');
  }
  next();
});

app.use(express.json());

//Add helmet security

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://fullstackopen-part-2-exercises.onrender.com"]
    }
  }
}));

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