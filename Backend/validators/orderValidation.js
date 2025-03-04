import Joi from 'joi';

const orderValidationSchema = Joi.object({
  user_id: Joi.number().required(),
  books: Joi.array()
    .items(
      Joi.object({
        book_id: Joi.number().required(),
        book_name: Joi.string().required(),
        quantity: Joi.number().min(1).required()
      })
    )
    .min(1)
    .required(),
  totalPrice: Joi.number().min(1).required(),
  status: Joi.string().valid('pending', 'shipped', 'delivered', 'canceled')
});

const updateOrderValidationSchema = Joi.object({
  user_id: Joi.number().optional(),
  books: Joi.array()
    .items(
      Joi.object({
        book_id: Joi.number().required(),
        book_name: Joi.string().required(),
        quantity: Joi.number().min(1).required()
      })
    )
    .min(1)
    .optional(), // Optional because user might update only the status
  totalPrice: Joi.number().min(1).optional(),
  status: Joi.string().valid('pending', 'shipped', 'delivered', 'canceled').optional()
});

export {orderValidationSchema, updateOrderValidationSchema};
