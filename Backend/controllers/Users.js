import process from 'node:process';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomError from '../helpers/CustomError.js';
import {Admin, Customer, User} from '../models/Allusres.js';

export const registerUser = async (req, res, next) => {
  try {
    const {name, email, password, role} = req.body;
    const validRoles = ['Admin', 'Customer'];
    const existuser = await User.findOne({email});
    if (!validRoles.includes(role)) {
      throw new CustomError(`Invalid role: ${role}. Allowed roles are: Admin, Customer`, 400);
    }
    if (existuser) throw new CustomError(`Email ${email} already exists`, 400);

    let newUser;
    if (role === 'Admin') {
      newUser = new Admin({name, email, password, role});
    } else {
      newUser = new Customer({name, email, password, role});
    }
    await newUser.save();
    res.status(201).json({message: 'Account created successfully', user: newUser});
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) throw new CustomError('Invalid email or password', 400);

    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) throw new CustomError('Invalid email or password', 400);

    const token = jwt.sign({user_id: user.user_id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.json({message: 'login successfuly', token});
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    //  const userID = req.user.userID;
    // const user = await User.findById(req.user.user_id).select('-password');
    const user = await User.findOne({user_id: req.user.user_id}).select('-password');

    if (!user) throw new CustomError('User not found', 404);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // const userID = req.user.userID;
    const updates = req.body;

    if (updates.password) delete updates.password;

    // const updateUser = await User.findByIdAndUpdate(req.user.user_id, updates, {new: true});
    const updateUser = await User.findOneAndUpdate({user_id: req.user.user_id}, updates, {new: true});

    if (!updateUser) throw new CustomError('User not found', 404);
    res.json({message: 'User updated successfully', user: updateUser});
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    // const userID = req.user.userID;
    // const deletedUser = await User.findByIdAndDelete(req.user.user_id);
    const deletedUser = await User.findOneAndDelete({user_id: req.user.user_id});

    if (!deletedUser) throw new CustomError('User not found', 404);
    res.json({message: 'Account deleted successfully'});
  } catch (error) {
    next(error);
  }
};
