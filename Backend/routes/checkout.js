import express from 'express';
import * as CheckoutController from '../controllers/checkout.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';
import CustomError from '../helpers/CustomError.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import 'express-async-errors';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.user_id;
  const [err, checkoutSession] = await asyncWrapper(CheckoutController.createCheckoutSession(userId));
  if (err) throw new CustomError(err.message, 500);
  res.json({checkoutSession});
});

export default router;
