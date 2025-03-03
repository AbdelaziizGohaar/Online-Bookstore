import express from 'express';
import BooksRouter from './books.js';
import ReviewsRouter from './reviews.js';

const router = express.Router();

router.use('/books', BooksRouter);
router.use('/reviews', ReviewsRouter);

export default router;
