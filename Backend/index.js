import process from 'node:process';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index.js';
import connectDB from './dbconfig/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

connectDB();

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  });
});

app.use('*', (req,res)=>{
    res.sendStatus(404);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
