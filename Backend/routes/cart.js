import express from 'express';
import * as CartController from '../controllers/cart.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';
import CustomError from '../helpers/CustomError.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import 'express-async-errors';

const router = express.Router();

router.post('/:id', authMiddleware, async (req, res) => {
  const data = {bookId: req.params.id, userId: req.user.user_id};
  const [err, addedItem] = await asyncWrapper(CartController.addItem(data));
  if (err) throw new CustomError(err.message, 422);
  res.json(addedItem);
});

router.get('/', authMiddleware, async (req, res) => {
  const [err, cartItems] = await asyncWrapper(CartController.getCartItems(req.user.user_id));
  if (err) throw new CustomError(err.message, 404);
  res.json(cartItems);
});

router.patch('/:id', authMiddleware, async (req, res) => {
  const data = {bookId: req.params.id, userId: req.user.user_id, quantity: req.body.quantity};
  const [err, updatedItem] = await asyncWrapper(CartController.updateItem(data));
  if (err) throw new CustomError(err.message, 422);
  res.json(updatedItem);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const data = {bookId: req.params.id, userId: req.user.user_id};
  const [err, deletedItem] = await asyncWrapper(CartController.removeItem(data));
  if (err) throw new CustomError(err.message, 404);
  res.json({message: 'Item removed successfully', deletedItem});
});

export default router;
