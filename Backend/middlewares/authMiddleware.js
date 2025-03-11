import process from 'node:process';
import jwt from 'jsonwebtoken';
import CustomError from '../helpers/CustomError.js';

const authMiddleware = (req, res, next) => {
  try {
    // for check if token send to header or not
    // debug
    console.log('Request Headers:', req.headers);

    const token = req.header('Authorization');
    if (!token) throw new CustomError('Token not found', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // debug
    console.log('Decoded Token:', decoded);
    req.user = {
      user_id: Number(decoded.user_id),
      role: decoded.role
    };
    // debug
    console.log('User after Middleware:', req.user);

    // console.log('Request Headers:', req.headers);

    next();
  } catch (error) {
    next(error);
  }
};
export default authMiddleware;
