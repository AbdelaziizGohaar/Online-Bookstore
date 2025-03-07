import Joi from 'joi';

export const cartItemSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  bookId: Joi.number().integer().positive().required()
});

export const updateItemSchema = Joi.object({
  bookId: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().positive().required()
});
