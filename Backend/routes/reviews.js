import express from 'express';
import * as ReviewsController from '../controllers/reviews.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import {validateReview, validateReviewUpdate} from '../validators/reviewValidator.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [err, retrievedReviews] = await asyncWrapper(
    ReviewsController.getReviews(req)
  );
  if (err) res.status(404).json({error: err.message});
  res.json(retrievedReviews);
});

router.post('/', authMiddleware, validateReview, async (req, res) => {
  const [err, addeddReviews] = await asyncWrapper(
    ReviewsController.addReview(req)
  );
  if (err) res.status(err.status).json({error: err.message});
  res.json(addeddReviews);
});

router.patch('/:id', authMiddleware, validateReviewUpdate, async (req, res) => {
  const [err, updatedReview] = await asyncWrapper(
    ReviewsController.updateReview(req)
  );
  if (err) res.status(404).json({error: err.message});
  res.json(updatedReview);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const [err, deletedReview] = await asyncWrapper(
    ReviewsController.deleteReview(req)
  );
  if (err) res.status(404).json({error: err.message});
  res.json(deletedReview);
});

export default router;
