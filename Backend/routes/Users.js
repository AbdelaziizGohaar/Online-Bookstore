import express from 'express';
import {deleteUser, getUserProfile, loginUser, registerUser, updateUser} from '../controllers/Users.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import {registerValidation, updateValidation, validate} from '../validators/usersValidator.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import {User , Customer , Admin} from '../models/Allusres.js';

const router = express.Router();
// login new user
router.post('/', validate(registerValidation), registerUser);
// login user
router.post('/login', loginUser);
// get info abount current user
router.get('/', authMiddleware, getUserProfile);
// update info abount current user
router.put('/', authMiddleware, validate(updateValidation), updateUser);
// delete info abount current user
router.delete('/', authMiddleware, deleteUser);

export default router;
