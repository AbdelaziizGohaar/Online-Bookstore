import Joi from 'joi';

export const bookValidationSchema = Joi.object({
  title: Joi.string().min(2).max(255).trim().required(),
  author: Joi.string().min(2).max(100).trim().pattern(/^[A-Z.\s]+$/i).required(),
  price: Joi.number().min(1).max(10000).required(),
  description: Joi.string().min(10).max(2000).trim().required(),
  stock: Joi.number().integer().min(0).required(),
  image: Joi.string().trim().pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$|^[\w,\s-]+\.(?:png|jpg|jpeg|gif|webp)$/).required()
});
export const bookUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(255).trim().optional(),
  author: Joi.string().min(2).max(100).trim().pattern(/^[A-Z.\s]+$/i).optional(),
  price: Joi.number().min(1).max(10000).optional(),
  description: Joi.string().min(10).max(2000).trim().optional(),
  stock: Joi.number().integer().min(0).optional(),
  image: Joi.string()
    .trim()
    .pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$|^[\w,\s-]+\.(?:png|jpg|jpeg|gif|webp)$/)
    .optional()
});
