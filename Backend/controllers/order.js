// import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Orders from '../models/order.js';

// ==== find by order by id======
const getOrder = async (order_id) => {
  // validation
  const order = await Orders.findOne({order_id: Number(order_id)});

  return order;
};

// ==== create order ======
const addOrder = async (data) => {
  const order = await Orders.create(data);
  return order;
};

// ==== get all  order ======
const getAll = async (data) => {
  const order = await Orders.find(data);
  return order;
};

// ==== Update Specific  order ======
const updateOrder = async (order_id, updatedData) => {
  const order = await Orders.findOne({order_id: Number(order_id)});

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

  await order.save();

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

  return orders;
};

const deleteOrder = async (order_id) => {
  const order = await Orders.findOneAndDelete({order_id: Number(order_id)});
  if (!order) {
    throw new Error('Order not found');
  }
  return {message: 'Order deleted successfully'};
};

const getOrdersByUser = async (user_id) => {
  const orders = await Orders.find({user_id: Number(user_id)});
  return orders;
};

export {
  addOrder,
  deleteOrder,
  getAll,
  getFilterdOrders,
  getOrder,
  getOrdersByUser,
  updateOrder
};
