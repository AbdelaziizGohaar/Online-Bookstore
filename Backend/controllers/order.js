// import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import CustomError from '../helpers/CustomError.js';
import Orders from '../models/order.js';
import {orderValidationSchema, updateOrderValidationSchema} from '../validations/orderValidation.js';

// ==== find by order by id======
const getOrder = async (order_id) => {
  // validation
  try {
    const order = await Orders.findOne({order_id: Number(order_id)});
    if (!order) {
      throw new CustomError('Order not found', 404);
    }

    return order;
  } catch (error) {
    throw new CustomError(error, 500);
  }
};

// ==== create order ======
const addOrder = async (data) => {
  const {error, value} = orderValidationSchema.validate(data);
  console.log(value);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  try {
    const order = await Orders.create(data);
    return order;
  } catch (error) {
    throw new CustomError(error, 500);
  }
};

// ==== get all  order ======
const getAll = async (data) => {
  const order = await Orders.find(data);
  return order;
};

// ==== Update Specific  order ======
const updateOrder = async (order_id, updatedData) => {
  // Validate updated data
  const {error} = updateOrderValidationSchema.validate(updatedData);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  const order = await Orders.findOne({order_id: Number(order_id)});

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (!updatedData || Object.keys(updatedData).length === 0) {
    throw new CustomError('No data provided for update', 400);
  }

  if (updatedData.status) {
    order.status = updatedData.status;
  }
  if (updatedData.books) {
    order.books = updatedData.books;
  }

  if (updatedData.books) {
    const Book = mongoose.model('Book');

    let total = 0;

    for (const item of updatedData.books) {
      const book = await Book.findOne({book_id: item.book_id});

      if (book) {
        total += book.price * item.quantity;
      }
    }
    order.totalPrice = total;
  }

  try {
    await order.save();
  } catch (error) {
    throw new CustomError(error, 500);
  }
  return order;
};

// ==== get  order by Filters======
const getFilterdOrders = async (filters) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status; // Filter by order status
  }
  if (filters.user_id) {
    query.user_id = Number(filters.user_id);
  }

  // Pagination (default: page 1, limit 10)
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Orders.find(query).skip(skip).limit(limit);

  if (!orders || orders.length === 0) {
    throw new CustomError('No orders found matching the filters', 404);
  }
  return orders;
};

const deleteOrder = async (order_id) => {
  const order = await Orders.findOneAndDelete({order_id: Number(order_id)});
  if (!order) {
    throw new CustomError('Order not found , Cant delete', 404);
  }
  return {message: 'Order deleted successfully'};
};

const getOrdersByUser = async (user_id) => {
  const orders = await Orders.find({user_id: Number(user_id)});
  if (!orders || orders.length === 0) {
    throw new CustomError('No Orders found for this User', 404);
  }
  return orders;
};

const updateOrderStatus = async (order_id, newStatus) => {
  const validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];
  if (!validStatuses.includes(newStatus)) {
    throw new CustomError('Invalid status value', 422);
  }
  // Find and update the order status
  const order = await Orders.findOneAndUpdate(
    {order_id: Number(order_id)}, // Find order by order_id
    {status: newStatus}, // Update the status
    {new: true} // Return the updated document
  );

  return order;
};

export {
  addOrder,
  deleteOrder,
  getAll,
  getFilterdOrders,
  getOrder,
  getOrdersByUser,
  updateOrder,
  updateOrderStatus
};
