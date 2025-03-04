import joi from 'joi';

const registerValidation = joi.object({
  name: joi.string().pattern(/^[a-z\s]+$/i).min(3).max(20).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*\d)[A-Z\d]{8,}$/i).required(),
  role: joi.string().valid('Admin', 'Customer').default('Customer')
});

const updateValidation = joi.object({
  name: joi.string().pattern(/^[a-z\s]+$/i).min(3).max(20),
  email: joi.string().email(),
  password: joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*\d)[A-Z\d]{8,}$/i),
  role: joi.forbidden()
});

const validate = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.body, {abortEarly: false});

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((err) => err.message)
    });
  }

  next();
};

export {registerValidation, updateValidation, validate};
