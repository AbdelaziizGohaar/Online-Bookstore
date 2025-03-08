import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import CustomError from '../helpers/CustomError.js';

import {User} from '../models/Allusres.js';
import Book from '../models/Book.js';
import {bookAddSchema, bookQuerySchema, bookUpdateSchema} from '../validators/bookValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const addBook = async (data, user) => {
  const {error, value} = bookAddSchema.validate(data);
  if (error) {
    throw new CustomError(`Validation Error: ${error.details.map((e) => e.message).join(', ')}`, 400);
  }
  try {
    const addedBook = await Book.create(value);
    await User.findOneAndUpdate(
      {user_id: user.user_id},
      {$push: {addedBooks: addedBook.book_id}},
      {new: true}
    ).exec();
    return addedBook;
  } catch (error) {
    console.error('Error adding book:', error.message);
    throw new CustomError(error.message, 500);
  }
};

const getFilteredBooks = async (filters) => {
  const {error, value} = bookQuerySchema.validate(filters);
  if (error) {
    throw new CustomError(`Validation Error: ${error.details.map((e) => e.message).join(', ')}`, 400);
  }
  try {
    const books = await Book.find(value)
      .select('-_id book_id title author price description stock image')
      .exec();
    return books;
  } catch (error) {
    console.error('Error fetching books:', error.message);

    throw new CustomError(error.message, 500);
  }
};

const getBook = async (id) => {
  try {
    const book = await Book.findOne({book_id: id});
    if (!book) throw new CustomError('Book does not exist', 404);
    return book;
  } catch (error) {
    throw new CustomError(error.message || 'Failed to get book', error.status || 422);
  }
};

const deleteBook = async (id, user) => {
  try {
    const book = await Book.findOne({book_id: id});
    const imagePath = path.join(__dirname, '..', book.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    User.findOneAndUpdate({user_id: user.user_id}, {$pull: {addedBooks: id}}).exec();
    const result = await Book.deleteOne({book_id: id});

    if (result.deletedCount === 0) {
      throw new CustomError('Book not found', 404);
    }

    return {message: 'Book deleted successfully'};
  } catch (error) {
    console.error('Error deleting book:', error.message);
    throw new CustomError(error.message, 500);
  }
};

const editBook = async (id, data) => {
  const {error, value} = bookUpdateSchema.validate(data);
  if (error) {
    throw new CustomError(`Validation Error: ${error.details.map((e) => e.message).join(', ')}`, 400);
  }
  try {
    const updatedBook = await Book.findOneAndUpdate(
      {book_id: id},
      value,
      {new: true, runValidators: true}
    );

    if (!updatedBook) {
      throw new CustomError('Book not found', 404);
    }

    return updatedBook;
  } catch (error) {
    console.error('Error updating book:', error.message);
    throw new CustomError(error.message, 500);
  }
};

export {
  addBook,
  deleteBook,
  editBook,
  getBook,
  getFilteredBooks
};
