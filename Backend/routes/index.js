import express from 'express';
import BooksRouter from './books.js';
import CartRouter from './cart.js';
import checkoutRouter from './checkout.js';
import OrderRouter from './order.js';
import ReviewsRouter from './reviews.js';
import UsersRouter from './Users.js';

const router = express.Router();

router.use('/books', BooksRouter);
router.use('/reviews', ReviewsRouter);
router.use('/cart', CartRouter);
router.use('/orders', OrderRouter);
router.use('/users', UsersRouter);
router.use('/checkout', checkoutRouter);

export default router;
