import CustomError from '../helpers/CustomError.js';
import Book from '../models/Book.js';
import {bookAddSchema, bookQuerySchema, bookUpdateSchema} from '../validators/bookValidator.js';

const addBook = async (data) => {
  const {error, value} = bookAddSchema.validate(data);
  if (error) {
    throw new CustomError(`Validation Error: ${error.details.map((e) => e.message).join(', ')}`, 400);
  }
  try {
    const addedBook = await Book.create(value);
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
const deleteBook = async (id) => {
  try {
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
  getFilteredBooks
};
