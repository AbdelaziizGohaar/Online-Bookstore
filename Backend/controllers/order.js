// import jwt from 'jsonwebtoken';
import Orders from '../models/order.js';

const getOrder = async (order_id) => {
  // validation

  const order = await Orders.findOne({order_id: Number(order_id)});

  return order;
};

const addOrder = async (data) => {
  const order = await Orders.create(data);
  return order;
};

const getAll = async (data) => {
  const order = await Orders.find(data);
  return order;
};

export {
  addOrder,
  getAll,
  getOrder
};
