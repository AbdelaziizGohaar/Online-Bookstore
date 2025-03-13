import crypto from 'node:crypto';
import process from 'node:process';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomError from '../helpers/CustomError.js';
import Email from '../helpers/email.js';
import {Admin, Customer, User} from '../models/Allusres.js';
import {validate} from '../validators/usersValidator.js';

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

    const url = `${req.protocol}://${req.get('host')}/users/login`;
    await new Email(newUser, url).sendWelcome();
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

export const forgetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) throw new CustomError('There is no user with email address.', 404);

    const resetToken = user.createPasswordResetToken();
    await user.save();

    try {
      const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      throw new CustomError('Failed to send email. Please try again later.', 500);
    }
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    next(new CustomError(error.message || 'There was an error sending the email, Try again later!', error.status || 500));
  }
};

export const resetPassword = async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});

  if (!user) throw new CustomError('Token is invalid or expired!', 400);
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({message: 'Password changed successfully!'});
};
