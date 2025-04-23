import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import personRoutes from './routes/persons.js';

dotenv.config();

const app = express();

// Middleware Order Matters!
// 1. CORS first
// 2. Body parser
// 3. Security headers

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://fullstackopen-part-2-exercises.pages.dev',
      /https:\/\/.*--fullstackopen-part-2-exercises\.pages\.dev/,
      'http://localhost:5173'
    ];
    
    if (!origin || allowedOrigins.some(pattern => 
      typeof pattern === 'string' ? origin === pattern : pattern.test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://fullstackopen-part-2-exercises.onrender.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Routes
app.use('/api/persons', personRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Server Startup
const PORT = process.env.PORT || 3001;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();