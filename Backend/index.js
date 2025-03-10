import path from 'node:path';
import process from 'node:process';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './dbconfig/db.js';
import errorHandler from './middlewares/errorHandler.js';
import router from './routes/index.js';
import morgan from 'morgan';
import fs from'node:fs';

dotenv.config();
const app = express();

const logStream = fs.createWriteStream(path.join('logs', 'access.log'), {
  flags: 'a'
});

app.use(morgan('common', {stream: logStream}));
app.use(express.json());
app.use(cors());
app.use(router);

// eslint-disable-next-line no-multi-str
app.use('/uploads', express.static('uploads'));

connectDB();

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
