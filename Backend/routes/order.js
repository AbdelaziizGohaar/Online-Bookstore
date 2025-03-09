import express from 'express';
import * as OrderController from '../controllers/order.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// ======== create order========
router.post('/', authMiddleware, async (req, res) => {
  const [err, order] = await asyncWrapper(OrderController.addOrder(req.body, req.user.userID));

  if (err) {
    return res.status(422).json({error: err.message});
  }
  res.status(200).json({message: 'order created succsesfully', order});
});

// router.post('/', validate(registerValidation), registerUser);

// ======== get all orders with filters========
router.get('/', authMiddleware, async (req, res) => {
  const filters = req.query;
  const [err, orders] = await asyncWrapper(OrderController.getFilterdOrders(filters));

  if (err) {
    return res.status(422).json({error: err.message});
  }
  res.json(orders);
});

// ======== get specific order========
router.get('/:order_id', authMiddleware, async (req, res) => {
  const [err, order] = await asyncWrapper(OrderController.getOrder(req.params.order_id));
  if (err) return res.status(422).json({error: err.message});

  res.status(200).json(order);
});

// ======== get all orders of specific User ========
router.get('/users', authMiddleware, async (req, res) => {
  console.log('Route handler reached'); // Debugging log
  console.log('Decoded req.user:', req.user); // Debugging log
  console.log('User ID from token:', req.user.userID); // Debugging log

  const user_id = Number(req.user.userID); // Convert to number

  console.log('User ID after canges:', user_id); // Debugging log

  console.log('User ID from authMiddleware:', user_id); // Debugging log

  if (Number.isNaN(user_id)) {
    return res.status(400).json({error: 'Invalid user ID'});
  }
  const [err, orders] = await asyncWrapper(OrderController.getOrdersByUser(user_id));
  if (err) return res.status(422).json({error: err.message});
  res.status(200).json({orders});
});

// ======== Update specific order ========
router.put('/:order_id', authMiddleware, async (req, res) => {
  const [err, order] = await asyncWrapper (OrderController.updateOrder(req.params.order_id, req.body));
  if (err) return res.status(422).json({error: err.message});
  if (!order) {
    return res.status(422).json({message: 'Order not found'});
  }
  res.status(200).json({message: 'Order updated successfully'});
});

// ======== Update specific order Status ========
router.patch('/:order_id/status', authMiddleware, async (req, res) => {
  const [err, order] = await asyncWrapper (OrderController.updateOrderStatus(req.params.order_id, req.body.status));
  if (err) return res.status(422).json({error: err.message});

  if (!order) return res.status(404).json({message: 'Order not found'});

  res.status(200).json({message: 'Order status updated successfully', order});
});

// ======== delete specific order  ========
router.delete('/:order_id', authMiddleware, async (req, res) => {
  const [err, order] = await asyncWrapper (OrderController.deleteOrder(req.params.order_id));
  if (err) return res.status(422).json({error: err.message});
  if (!order) {
    return res.status(422).json({message: 'Order not found'});
  }
  res.status(200).json({message: 'Order Delete successfully'});
});

// ======== * specific order  ========
router.get('*', async (req, res) => {
  console.log('a7aaaaaaa');
});

export default router;
