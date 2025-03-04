import {asyncWrapper} from '../helpers/asyncWrapper.js';
import CustomError from '../helpers/CustomError.js';
import {Customer} from '../models/Allusres.js';
import Book from '../models/Book.js';
import {cartItemSchema, updateItemSchema} from '../validators/cartValidator.js';

export const addItem = async (data) => {
  const {error, value} = cartItemSchema.validate(data);
  if (error) {
    throw new CustomError(`Validation Error: ${error.details.map((e) => e.message).join(', ')}`, 400);
  }

  const {userId, bookId} = value;

  const [errCustomer, customer] = await asyncWrapper(Customer.findOne({user_id: userId}));
  if (errCustomer) throw new CustomError(errCustomer.message, 500);
  if (!customer) throw new CustomError('Customer not found', 404);

  const [errBook, book] = await asyncWrapper(Book.findOne({book_id: bookId}));
  if (errBook) throw new CustomError(errBook.message, 500);
  if (!book) throw new CustomError('Book not found', 404);

  const existingItem = customer.cart.arrayOfBooks.find((item) => item.book_id === bookId);
  if (existingItem) {
    existingItem.booknum++;
  } else {
    customer.cart.arrayOfBooks.push({book_id: bookId});
  }

  customer.cart.totalItemNum++;

  const [errSave, updatedCustomer] = await asyncWrapper(customer.save());
  if (errSave) throw new CustomError(errSave.message, 500);

  return updatedCustomer.cart;
};

export const getCartItems = async (userId) => {
  const [err, customer] = await asyncWrapper(
    Customer.findOne({user_id: userId}).populate({
      path: 'cart.arrayOfBooks.book_id',
      model: 'Book',
      localField: 'cart.arrayOfBooks.book_id',
      foreignField: 'book_id',
      justOne: false
    })
  );

  if (err) throw new CustomError(err.message, 500);
  if (!customer) throw new CustomError('Customer not found', 404);

  return customer.cart;
};

export const updateItem = async (itemId, data) => {
  const {error, value} = updateItemSchema.validate(data);
  if (error) {
    throw new CustomError(`Validation Error: ${error.details.map((e) => e.message).join(', ')}`, 400);
  }

  const {userId, quantity} = value;

  const [errCustomer, customer] = await asyncWrapper(Customer.findOne({user_id: userId}));
  if (errCustomer) throw new CustomError(errCustomer.message, 500);
  if (!customer) throw new CustomError('Customer not found', 404);

  const item = customer.cart.arrayOfBooks.find((item) => item.book_id === Number(itemId));
  if (!item) throw new CustomError('Item not found in cart', 404);

  customer.cart.totalItemNum += quantity - item.booknum;
  item.booknum = quantity;

  const [errSave, updatedCustomer] = await asyncWrapper(customer.save());
  if (errSave) throw new CustomError(errSave.message, 500);

  return updatedCustomer.cart;
};

export const removeItem = async (data) => {
  const {error, value} = cartItemSchema.validate(data);
  if (error) {
    throw new CustomError(`Validation Error: ${error.details.map((e) => e.message).join(', ')}`, 400);
  }

  const {userId, bookId} = value;

  const [errCustomer, customer] = await asyncWrapper(Customer.findOne({user_id: userId}));
  if (errCustomer) throw new CustomError(errCustomer.message, 500);
  if (!customer) throw new CustomError('Customer not found', 404);

  const itemIndex = customer.cart.arrayOfBooks.findIndex((item) => item.book_id === Number(bookId));
  if (itemIndex === -1) throw new CustomError('Item not found in cart', 404);

  customer.cart.totalItemNum -= customer.cart.arrayOfBooks[itemIndex].booknum;
  customer.cart.arrayOfBooks.splice(itemIndex, 1);

  const [errSave, updatedCustomer] = await asyncWrapper(customer.save());
  if (errSave) throw new CustomError(errSave.message, 500);

  return updatedCustomer.cart;
};
