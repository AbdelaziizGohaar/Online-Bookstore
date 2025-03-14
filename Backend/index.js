import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import connectDB from './dbconfig/db.js';
import errorHandler from './middlewares/errorHandler.js';
import router from './routes/index.js';

dotenv.config();

const app = express();

const logsDir = path.join('logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, {recursive: true}); // Create 'logs' directory if it doesn't exist
}

const logStream = fs.createWriteStream(path.join('logs', 'access.log'), {
  flags: 'a'
});

// Allow max 100 requests from the same IP address in one hour
const limiter = rateLimit({
  max: 900,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later!'
});

app.use('/', limiter);

app.use(morgan('common', {stream: logStream}));
app.use(express.json());
app.use(cors());
app.use(router);

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
// debug
// for check if data sended to mongodb or not
// const testDB = async () => {
//   const users = await User.find();
//   console.log(users);
// };

// testDB();
