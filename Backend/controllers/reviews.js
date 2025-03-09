import CustomError from '../helpers/CustomError.js';
import {User} from '../models/Allusres.js';
import Book from '../models/Book.js';
import Order from '../models/order.js';
import Review from '../models/Review.js';

const getReviews = async (bookId) => {
  try {
    const bookExists = await Book.findOne({book_id: bookId});
    if (!bookExists) throw new CustomError('Book ID does not exist', 404);

    const reviews = await Review.find({book_id: bookId});
    if (!reviews) throw new CustomError('Book does not has reviews');
    return reviews;
  } catch (error) {
    throw new CustomError(error.message || 'Failed to get book review', error.status || 422);
  }
};

const addReview = async (data) => {
  try {
    const {user_id, book_id} = data;
    const userExists = await User.findOne({user_id});
    if (!userExists) throw new CustomError('User ID does not exist', 404);

    const bookExists = await Book.findOne({book_id});
    if (!bookExists) throw new CustomError('Book ID does not exist', 404);

    const orderExists = await Order.findOne({user_id, 'books.book_id': book_id});
    if (!orderExists) throw new CustomError('User must purchase the book before reviewing', 403);

    const addedReview = await Review.create(data);
    return addedReview;
  } catch (error) {
    throw new CustomError(error.message || 'Failed to add review', error.status || 422);
  }
};

const updateReview = async (id, body) => {
  try {
    const reviewExists = await Review.findOne({review_id: id});
    if (!reviewExists) throw new CustomError('Review ID does not exist', 404);
    const {rating, review} = body;
    const updatedReview = await Review.findOneAndUpdate(
      {review_id: id},
      {rating, review},
      {new: true}
    );
    return updatedReview;
  } catch (error) {
    throw new CustomError(error.message || 'Failed to update review', error.status || 422);
  }
};

const deleteReview = async (id) => {
  try {
    const reviewExists = await Review.findOne({review_id: id});
    if (!reviewExists) throw new CustomError('Review ID does not exist', 404);
    const deletedReview = await Review.findOneAndDelete({review_id: id});
    return deletedReview;
  } catch (error) {
    throw new CustomError(error.message || 'Failed to delete review', error.status || 422);
  }
};

export {addReview, deleteReview, getReviews, updateReview};
