import process from 'node:process';
import {asyncWrapper} from '../helpers/asyncWrapper.js';
import CustomError from '../helpers/CustomError.js';
import stripe from '../helpers/stripe.js';
import {Customer} from '../models/Allusres.js';
import Book from '../models/Book.js';

export const createCheckoutSession = async (userId) => {
  // Fetch the user's cart
  const [errCustomer, customer] = await asyncWrapper(Customer.findOne({user_id: userId}));
  if (errCustomer) throw new CustomError(errCustomer.message, 500);
  if (!customer) throw new CustomError('Customer not found', 404);

  const cartItems = customer.cart.arrayOfBooks;

  // Validate cart items and prepare line items for Stripe
  const lineItems = await Promise.all(
    cartItems.map(async (item) => {
      const [errBook, book] = await asyncWrapper(Book.findOne({book_id: item.book_id}));
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
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/checkout/success`, // Redirect URL after successful payment
    cancel_url: `${process.env.FRONTEND_URL}/checkout/failed`, // Redirect URL after failed payment
    metadata: {
      userId: userId.toString() // Pass user ID for order creation
    }
  });

  return session;
};
