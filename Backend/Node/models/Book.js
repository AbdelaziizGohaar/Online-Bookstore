import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const BookSchema = new mongoose.Schema({
  book_id: {
    type: Number, // auto increment
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 255
  },

  author: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
    match: /^[A-Z\s]+$/i
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    max: 10000
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be an integer.'
    }
  },
  image: {
    type: String,
    required: true,
    trim: true,
    match: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$|^[\w,\s-]+\.(?:png|jpg|jpeg|gif|webp)$/
  }

}, {timestamps: true});
BookSchema.plugin(AutoIncrement, {inc_field: 'book_id'});

BookSchema.index({title: 'text', author: 'text', description: 'text'});

const Book = mongoose.model('Order', BookSchema);
export default Book;
