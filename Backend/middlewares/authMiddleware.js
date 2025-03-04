import process from 'node:process';
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    // console.log('Request Headers:', req.headers);

    const token = req.header('Authorization');
    if (!token) return res.status(401).json({message: 'token not found'});

    const verfiy = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verfiy;
    next();
  } catch (error) {
    res.status(500).json({message: 'something wrong with token', error});
  }
};
export default authMiddleware;
