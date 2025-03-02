import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema({
  user_id: {type: Number, unique: true, required: true},
  name: {type: String, required: true, minlength: 3, trim: true},
  password: {type: String, required: true, minlength: 8},
  email: {type: String, required: true, unique: true},
  role: {type: String, enum: ['user', 'admin'], required: true}
}, {timestamps: true, discriminatorKey: 'role'});

userSchema.plugin(AutoIncrement, {inc_field: 'user_id'});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
