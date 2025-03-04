import {asyncWrapper} from '../helpers/asyncWrapper.js';
import CustomError from '../helpers/CustomError.js';
import {Customer} from '../models/Allusres.js';

export const addItem = async (data) => {
  const {userId, bookId, quantity} = data;

  const [errCustomer, customer] = await asyncWrapper(Customer.findOne({user_id: userId}));
  if (errCustomer) throw new CustomError(errCustomer.message, 500);
  if (!customer) throw new CustomError('Customer not found', 404);

  const existingItem = customer.cart.arrayOfBooks.find((item) => item.book_id === bookId);
  if (existingItem) {
    existingItem.booknum += quantity;
  } else {
    customer.cart.arrayOfBooks.push({book_id: bookId, booknum: quantity});
  }

  customer.cart.totalItemNum += quantity;

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
  const {userId, quantity} = data;

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

export const removeItem = async (itemId) => {
  const [errCustomer, customer] = await asyncWrapper(
    Customer.findOne({'cart.arrayOfBooks.book_id': itemId})
  );
  if (errCustomer) throw new CustomError(errCustomer.message, 500);
  if (!customer) throw new CustomError('Customer not found', 404);

  const itemIndex = customer.cart.arrayOfBooks.findIndex((item) => item.book_id === Number(itemId));
  if (itemIndex === -1) throw new CustomError('Item not found in cart', 404);

  customer.cart.totalItemNum -= customer.cart.arrayOfBooks[itemIndex].booknum;
  customer.cart.arrayOfBooks.splice(itemIndex, 1);

  const [errSave, updatedCustomer] = await asyncWrapper(customer.save());
  if (errSave) throw new CustomError(errSave.message, 500);

  return updatedCustomer.cart;
};
