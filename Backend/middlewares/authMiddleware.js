import process from 'node:process';
import jwt from 'jsonwebtoken';
import CustomError from '../helpers/CustomError.js';

const authMiddleware = (req, res, next) => {
  try {
    // console.log('Request Headers:', req.headers);

    const token = req.header('Authorization');
    if (!token) throw new CustomError('Token not found', 401);

    const verfiy = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verfiy;
    next();
  } catch (error) {
    next(error);
  }
};
export default authMiddleware;
