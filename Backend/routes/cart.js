import express from 'express';
import * as CartController from '../controllers/cart.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';
import CustomError from '../helpers/CustomError.js';
import 'express-async-errors';

const router = express.Router();

router.post('/', async (req, res) => {
  const [err, addedItem] = await asyncWrapper(CartController.addItem(req.body));
  if (err) throw new CustomError(err.message, 422);
  res.json(addedItem);
});

router.get('/', async (req, res) => {
  const [err, cartItems] = await asyncWrapper(CartController.getCartItems(req.query.userId));
  if (err) throw new CustomError(err.message, 404);
  res.json(cartItems);
});

router.patch('/:id', async (req, res) => {
  const [err, updatedItem] = await asyncWrapper(CartController.updateItem(req.params.id, req.body));
  if (err) throw new CustomError(err.message, 422);
  res.json(updatedItem);
});

router.delete('/:id', async (req, res) => {
  const [err, deletedItem] = await asyncWrapper(CartController.removeItem(req.params.id));
  if (err) throw new CustomError(err.message, 404);
  res.json({message: 'Item removed successfully', deletedItem});
});

export default router;
