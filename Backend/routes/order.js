import express from 'express';
import * as OrderController from '../controllers/order.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';

const router = express.Router();

// ======== create order========
router.post('/', async (req, res) => {
  const [err, order] = await asyncWrapper(OrderController.addOrder(req.body));
  if (err) {
    return res.status(422).json({error: err.message}); // Handle validation errors
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
    return res.status(422).json({message: 'Order not found'}); // Handle order not found
  }

  res.status(200).json(order); // Send order if found
});

// ======== get all orders of specific User ========
router.get('/Users/:user_id', (req, res) => {

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
