import {error} from 'node:console';
import Joi from 'joi';

const reviewSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  book_id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(0).max(5).required(),
  review: Joi.string().trim().max(500).optional()
});

const reviewUpdateSchema = Joi.object({
  user_id: Joi.number().integer(),
  book_id: Joi.number().integer(),
  rating: Joi.number().integer().min(0).max(5),
  review: Joi.string().trim().max(500).optional()
});

const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({errors: error.details.map((err) => err.message)});
  }
  next();
};

const validateReviewUpdate = (req, res, next) => {
  const {error} = reviewUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({errors: error.details.map((err) => err.message)});
  }
  next();
};

export {
  validateReview,
  validateReviewUpdate
};
