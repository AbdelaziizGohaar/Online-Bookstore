import process from 'node:process';
import mongoose from 'mongoose';
import {asyncWrapper} from '../helpers/asyncWrapper.js';
import CustomError from '../helpers/CustomError.js';
import stripe from '../helpers/stripe.js';
import {Customer} from '../models/Allusres.js';
import Book from '../models/Book.js';

export const createCheckoutSession = async (userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch the user's cart
    const [errCustomer, customer] = await asyncWrapper(Customer.findOne({user_id: userId}).session(session));
    if (errCustomer) throw new CustomError(errCustomer.message, 500);
    if (!customer) throw new CustomError('Customer not found', 404);

    const cartItems = customer.cart.arrayOfBooks;

    // Validate stock for all items in the cart
    for (const item of cartItems) {
      const [errBook, book] = await asyncWrapper(Book.findOne({book_id: item.book_id}).session(session));
      if (errBook) throw new CustomError(errBook.message, 500);
      if (!book) throw new CustomError(`Book with ID ${item.book_id} not found`, 404);

      // Check if stock is sufficient
      if (item.booknum > book.stock) {
        throw new CustomError(`Not enough stock for book ID ${item.book_id}. Available: ${book.stock}`, 400);
      }
    }

    // Prepare line items for Stripe
    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const [errBook, book] = await asyncWrapper(Book.findOne({book_id: item.book_id}).session(session));
        if (errBook) throw new CustomError(errBook.message, 500);
        if (!book) throw new CustomError(`Book with ID ${item.book_id} not found`, 404);

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.title
            },
            unit_amount: Math.round(book.price * 100) // Convert to cents
          },
          quantity: item.booknum
        };
      })
    );

    // Create a Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: {
        cartItems: JSON.stringify(cartItems)
      }
    });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return stripeSession;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new CustomError(error.message, 500);
  }
};
