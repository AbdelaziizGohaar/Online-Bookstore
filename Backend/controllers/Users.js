import process from 'node:process';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Admin, Customer, User} from '../models/Allusres.js';

export const registerUser = async (req, res) => {
  try {
    const {name, email, password, role} = req.body;
    const existuser = await User.findOne({email});
    if (existuser) return res.status(400).json({message: `this email: ${email} already exist`});

    let newUser;
    if (role === 'Admin') {
      newUser = new Admin({name, email, password, role});
    } else {
      newUser = new Customer({name, email, password, role});
    }
    await newUser.save();
    res.status(201).json({message: 'account created', user: newUser});
  } catch (error) {
    res.status(500).json({message: 'account not created', error});
  }
};

export const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message: 'this account is wrong'});

    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) return res.status(400).json({message: 'password is wrong'});

    const token = jwt.sign({userID: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'});
    res.json({message: 'login successfuly', token});
  } catch (error) {
    res.status(500).json({message: 'something wrong with login', error});
  }
};

export const getUserProfile = async (req, res) => {
  try {
    //  const userID = req.user.userID;
    const user = await User.findById(req.user.userID).select('-password');
    if (!user) return res.status(404).json({message: 'user not found'});

    res.json(user);
  } catch (error) {
    res.status(500).json({message: 'something wrong with get info', error});
  }
};

export const updateUser = async (req, res) => {
  try {
    // const userID = req.user.userID;
    const updates = req.body;

    if (updates.password) delete updates.password;

    const updateUser = await User.findByIdAndUpdate(req.user.userID, updates, {new: true});

    res.json({message: 'info updated successfuly', user: updateUser});
  } catch (error) {
    res.status(500).json({message: 'something wrong with info update', error});
  }
};

export const deleteUser = async (req, res) => {
  try {
    // const userID = req.user.userID;
    const deletedUser = await User.findByIdAndDelete(req.user.userID);
    if (!deletedUser) return res.status(404).json({message: 'User not found'});
    res.json({message: 'Account deleted successfully'});
  } catch (error) {
    res.status(500).json({message: 'something wrong with deleting', error});
  }
};
