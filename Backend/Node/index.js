import process from 'node:process';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

// import router from './routes/index.js';

dotenv.config();

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error: ', err);
  process.exit(1);
});
mongoose.connection.on('connected', () => {
  console.log('Connected to database');
});

app.use(express.json());

// app.use(router);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
