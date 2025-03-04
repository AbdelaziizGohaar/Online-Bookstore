import { Customer } from "../models/user.js";
import { asyncWrapper } from "../helpers.js";
import CustomError from "../errors/customError.js";

export const addItem = async (data) => {
  const [err, result] = await asyncWrapper(async () => {
    const { userId, bookId, quantity } = data;
    const customer = await Customer.findOne({ user_id: userId });
    if (!customer) throw new CustomError("Customer not found", 404);

    const existingItem = customer.cart.arrayOfBooks.find((item) => item.book_id === bookId);
    if (existingItem) {
      existingItem.booknum += quantity;
    } else {
      customer.cart.arrayOfBooks.push({ book_id: bookId, booknum: quantity });
    }
    customer.cart.totalItemNum += quantity;
    await customer.save();
    return customer.cart;
  });
  if (err) throw err;
  return result;
};

export const getCartItems = async (userId) => {
  const [err, result] = await asyncWrapper(async () => {
    const customer = await Customer.findOne({ user_id: userId }).populate("cart.arrayOfBooks.book_id");
    if (!customer) throw new CustomError("Customer not found", 404);
    return customer.cart;
  });
  if (err) throw err;
  return result;
};

export const updateItem = async (itemId, data) => {
  const [err, result] = await asyncWrapper(async () => {
    const { userId, quantity } = data;
    const customer = await Customer.findOne({ user_id: userId });
    if (!customer) throw new CustomError("Customer not found", 404);

    const item = customer.cart.arrayOfBooks.find((item) => item.book_id === itemId);
    if (!item) throw new CustomError("Item not found in cart", 404);

    customer.cart.totalItemNum += quantity - item.booknum;
    item.booknum = quantity;
    await customer.save();
    return customer.cart;
  });
  if (err) throw err;
  return result;
};

export const removeItem = async (itemId) => {
  const [err, result] = await asyncWrapper(async () => {
    const customer = await Customer.findOne({ "cart.arrayOfBooks.book_id": itemId });
    if (!customer) throw new CustomError("Customer not found", 404);

    const itemIndex = customer.cart.arrayOfBooks.findIndex((item) => item.book_id === itemId);
    if (itemIndex === -1) throw new CustomError("Item not found in cart", 404);

    customer.cart.totalItemNum -= customer.cart.arrayOfBooks[itemIndex].booknum;
    customer.cart.arrayOfBooks.splice(itemIndex, 1);
    await customer.save();
    return customer.cart;
  });
  if (err) throw err;
  return result;
};
