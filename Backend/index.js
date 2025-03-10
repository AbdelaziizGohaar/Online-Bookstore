import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import connectDB from './dbconfig/db.js';
import errorHandler from './middlewares/errorHandler.js';

import router from './routes/index.js';

dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();

const logStream = fs.createWriteStream(path.join('logs', 'access.log'), {
  flags: 'a'
});

app.use(morgan('common', {stream: logStream}));
app.use(express.json());
app.use(cors());
app.use(router);

app.use('/uploads', express.static('uploads'));

connectDB();
console.log('Connected to MongoDB successfully!');

app.use(errorHandler);
// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({
//     message: err.message
//   });
// });

app.use('*', (req, res) => {
  res.sendStatus(404);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// for check if data sended to mongodb or not
// const testDB = async () => {
//   const users = await User.find();
//   console.log(users);
// };

// testDB();
