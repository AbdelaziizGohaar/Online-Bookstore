import express from 'express';
import * as OrderController from '../controllers/order.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';
import stripe from '../helpers/stripe.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// ======== create order ========
// router.post('/', authMiddleware, async (req, res) => {
//   const [err, order] = await asyncWrapper(OrderController.addOrder(req.body, req.user.user_id, req));

//   if (err) {
//     return res.status(422).json({error: err.message});
//   }
//   res.status(200).json({message: 'Order created successfully', order});
// });

// ======== create order with payment ========
router.post('/', authMiddleware, async (req, res) => {
  const {sessionId} = req.body; // Pass the Stripe session ID from the frontend
  console.log('the sessionIdddddarwa', sessionId);

  try {
    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('the session', session);

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
    console.log('the paymentIntentddddd', paymentIntent);

    // Extract metadata
    const cartItems = JSON.parse(session.metadata.cartItems);
    console.log('the cartItems', cartItems);

    // Prepare payment details
    const paymentDetails = {
      payment_id: paymentIntent.id,
      payment_method: paymentIntent.payment_method,
      amount_paid: paymentIntent.amount / 100, // Convert from cents to dollars
      currency: paymentIntent.currency
    };

    // Create the order with payment details
    const orderData = {
      user_id: req.user.user_id,
      books: cartItems,
      totalPrice: paymentDetails.amount_paid, // Use the amount paid from Stripe
      status: 'pending'
    };

    const [err, order] = await asyncWrapper(OrderController.addOrder(orderData, req, paymentDetails));

    if (err) {
      return res.status(422).json({error: err.message});
    }

    res.status(200).json({message: 'Order created successfully', order});
  } catch (err) {
    return res.status(422).json({error: err.message});
  }
});

// ======== get all orders with filters========
router.get('/', authMiddleware, async (req, res) => {
  const filters = req.query;
  const [err, orders] = await asyncWrapper(OrderController.getFilterdOrders(filters));

  if (err) {
    return res.status(422).json({error: err.message});
  }
  res.json(orders);
});

// ======== get all orders of specific User ========
router.get('/users', authMiddleware, async (req, res) => {
  console.log('Route handler reached'); // Debugging log
  console.log('User ID from token:', req.user.user_id); // Debugging log

  const user_id = Number(req.user.user_id); // Convert to number

  console.log('User ID after canges:', user_id); // Debugging log

  console.log('User ID from authMiddleware:', user_id); // Debugging log

  if (Number.isNaN(user_id)) {
    return res.status(400).json({error: 'Invalid user ID'});
  }
  const [err, orders] = await asyncWrapper(OrderController.getOrdersByUser(user_id));
  if (err) return res.status(422).json({error: err.message});
  res.status(200).json({orders});
});

// ======== get specific order========
router.get('/:order_id', authMiddleware, async (req, res) => {
  const [err, order] = await asyncWrapper(OrderController.getOrder(req.params.order_id));
  if (err) return res.status(422).json({error: err.message});

  res.status(200).json(order);
});

// ======== Update specific order ========
router.put('/:order_id', authMiddleware, async (req, res) => {
  const [err, order] = await asyncWrapper (OrderController.updateOrder(req.params.order_id, req.body, req));
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

export default router;
