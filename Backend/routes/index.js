import express from 'express';
import BooksRouter from './books.js';
import ReviewsRouter from './reviews.js';
import CartRouter from './cart.js';

const router = express.Router();

router.use('/books', BooksRouter);
router.use('/reviews', ReviewsRouter);
router.use('/cart', CartRouter);

export default router;
