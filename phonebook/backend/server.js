import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import personRoutes from './routes/persons.js';

dotenv.config();

const app = express();

// 1. CORS Configuration
const corsOptions = {
  origin: [
    'https://fullstackopen-part-2-exercises.pages.dev',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.options('*', cors());

// 2. Body Parser
app.use(express.json());

// 3. Security Headers
app.use(helmet());

// 4. Routes (VERIFY PATH)
app.use('/api/persons', personRoutes);

// 5. DB Connection
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('MongoDB Connected');
};

// 6. Server Start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});