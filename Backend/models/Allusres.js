import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const userSchema = new mongoose.Schema({
  user_id: {type: Number, unique: true, required: true},
  name: {type: String, required: true, minlength: 3, trim: true},
  password: {type: String, required: true, minlength: 8},
  email: {type: String, required: true, unique: true},
  role: {type: String, enum: ['Customer', 'Admin'], required: true}
}, {timestamps: true, discriminatorKey: 'role'});

userSchema.plugin(AutoIncrement, {inc_field: 'user_id'});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

const adminSchema = new mongoose.Schema({
  addedBooks: [{type: Number, ref: 'Book'}]
});
const Admin = User.discriminator('Admin', adminSchema);

const customerSchema = new mongoose.Schema({
  cart: {
    arrayOfBooks: [
      {
        book_id: {type: Number, ref: 'Book'},
        booknum: {type: Number, default: 1}
      }
    ],
    totalItemNum: {type: Number, default: 0}
  }
});
const Customer = User.discriminator('Customer', customerSchema);

export {Admin, Customer, User};
