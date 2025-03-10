// import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import CustomError from '../helpers/CustomError.js';
import {Customer} from '../models/Allusres.js';
import Book from '../models/Book.js';
import Orders from '../models/order.js';
import {orderValidationSchema, updateOrderValidationSchema} from '../validators/orderValidation.js';

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
const addOrder = async (data, user_id) => {
  data.user_id = user_id;

  // Debugging logs
  console.log('User ID from authMiddleware:', user_id);
  console.log('Data user_id:', data.user_id);

  const {error} = orderValidationSchema.validate(data);
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  // Start a Mongoose session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if user exists
    const userExists = await Customer.findOne({user_id: Number(data.user_id)}).session(session); // Ensure correct collection name
    if (!userExists) {
      console.log('User not found in DB:', data.user_id, typeof data.user_id);
      throw new CustomError('Not Found, Wrong User Id', 404);
    }

    // Check if books exist and validate stock
    for (const item of data.books) {
      const bookExists = await Book.findOne({book_id: item.book_id}).session(session);
      if (!bookExists) {
        throw new CustomError(`Book with ID ${item.book_id} not found`, 404);
      } else {
        // Check if stock is enough
        if (item.quantity > bookExists.stock) {
          throw new CustomError(`Not enough stock for book ID ${item.book_id}. Available: ${bookExists.stock}`, 400);
        } else {
          item.book_name = bookExists.title;
          item.price = bookExists.price;
          // Reduce stock
          bookExists.stock -= item.quantity;
          await bookExists.save({session}); // Save updated stock within the session
        }
      }
    }

    // Create the order
    const order = await Orders.create([data], {session});

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    throw new CustomError(error.message, 500);
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

  // Step 3: Validate each book_id if books array is provided
  if (updatedData.books) {
    for (const item of updatedData.books) {
      const bookExists = await Book.findOne({book_id: item.book_id});
      if (!bookExists) {
        throw new CustomError(`Book with ID ${item.book_id} not found`, 404);
      }
    }
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

// ==== get  order by user======
const getOrdersByUser = async (user_id) => {
  console.log('User ID in controller:', user_id); // Debugging log
  if (!user_id || Number.isNaN(user_id)) {
    throw new CustomError('Invalid User ID', 400);
  }

  const orders = await Orders.find({user_id: Number(user_id)});
  if (!orders || orders.length === 0) {
    throw new CustomError('No Orders found for this User', 404);
  }
  return orders;
};

// ==== patch  order status ======
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
