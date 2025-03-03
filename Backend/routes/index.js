import express from 'express';
import BooksRouter from './books.js';

const router = express.Router();

router.use('/books', BooksRouter);

export default router;
