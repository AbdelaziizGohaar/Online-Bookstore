import express from 'express';
import * as OrderController from '../controllers/order.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';

const router = express.Router();

// ======== create order========
router.post('/', async (req, res) => {
  const [err, order] = await asyncWrapper(OrderController.addOrder(req.body));
  if (err) {
    return res.status(422).json({error: err.message});
  }
  res.status(200).json({message: 'order created succsesfully', order});
});

// ======== get all orders with filters========
router.get('/', async (req, res) => {
  const filters = req.query;
  const [err, orders] = await asyncWrapper(OrderController.getFilterdOrders(filters));

  if (err) {
    return res.status(422).json({error: err.message});
  }
  res.json(orders);
});

// ======== get specific order========
router.get('/:order_id', async (req, res) => {
  const [err, order] = await asyncWrapper(OrderController.getOrder(req.params.order_id));
  if (err) return res.status(422).json({error: err.message});

  if (!order) {
    return res.status(422).json({message: 'Order not found'});
  }

  res.status(200).json(order);
});

// ======== get all orders of specific User ========
router.get('/Users/:user_id', async (req, res) => {
  const [err, orders] = await asyncWrapper(OrderController.getOrdersByUser(req.params.user_id));
  if (err) return res.status(422).json({error: err.message});
  if (!orders || orders.length === 0) {
    return res.status(422).json({message: 'No Orders found for this User'});
  }
  res.status(200).json({orders});
});

// ======== Update specific order ========
router.put('/:order_id', async (req, res) => {
  const [err, order] = await asyncWrapper (OrderController.updateOrder(req.params.order_id, req.body));
  if (err) return res.status(422).json({error: err.message});
  if (!order) {
    return res.status(422).json({message: 'Order not found'});
  }
  res.status(200).json({message: 'Order updated successfully'});
});

// ======== Update specific order Status ========
router.patch('/:order_id', (req, res) => {

});

// ======== delete specific order  ========
router.delete('/:order_id', async (req, res) => {
  const [err, order] = await asyncWrapper (OrderController.deleteOrder(req.params.order_id));
  if (err) return res.status(422).json({error: err.message});
  if (!order) {
    return res.status(422).json({message: 'Order not found'});
  }
  res.status(200).json({message: 'Order Delete successfully'});
});
export default router;
