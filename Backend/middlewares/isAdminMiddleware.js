import CustomError from '../helpers/CustomError.js';

const isAdminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new CustomError('Only admins can access this route', 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default isAdminMiddleware;
