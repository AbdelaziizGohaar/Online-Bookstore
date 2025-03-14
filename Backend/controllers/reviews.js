import CustomError from '../helpers/CustomError.js';
import {User} from '../models/Allusres.js';
import Book from '../models/Book.js';
import Order from '../models/order.js';
import Review from '../models/Review.js';

const getReviews = async (req) => {
  const bookId = req.query.bookid;
  console.log(bookId);
  try {
    const bookExists = await Book.findOne({book_id: bookId});
    if (!bookExists) throw new CustomError('Book ID does not exist', 404);

    const reviews = await Review.find({book_id: bookId}).populate();
    if (!reviews) throw new CustomError('Book does not has reviews');
    const userIds = reviews.map(review => review.user_id);
    const users = await User.find({ user_id: { $in: userIds } }).select('user_id name');

    // Merge user names into reviews
    const reviewsWithNames = reviews.map(review => {
      const user = users.find(u => u.user_id === review.user_id);
      return {
        ...review._doc,
        user_name: user ? user.name : 'Unknown User'
      };
    });
    console.log(reviewsWithNames);
    return reviewsWithNames;
  } catch (error) {
    throw new CustomError(error.message || 'Failed to get book review', error.status || 422);
  }
};

const addReview = async (req) => {
  try {
    const user_id = req.user.user_id;
    console.log("User id", user_id);
    console.log("Add Review",req.body);
    const {book_id, rating, review} = req.body;

    const userExists = await User.findOne({user_id});
    if (!userExists) throw new CustomError('User ID does not exist', 404);

    const bookExists = await Book.findOne({book_id});
    if (!bookExists) throw new CustomError('Book ID does not exist', 404);

    const orderExists = await Order.findOne({user_id, 'books.book_id': book_id});
    if (!orderExists) throw new CustomError('User must purchase the book before reviewing', 403);

    const addedReview = await Review.create({user_id, book_id, rating, review});
    return addedReview;
  } catch (error) {
    throw new CustomError(error.message || 'Failed to add review', error.status || 422);
  }
};

const updateReview = async (req) => {
  try {
    const user_id = req.user.user_id;
    const reviewId = req.params.id;
    const {rating, review} = req.body;
    const reviewExists = await Review.findOne({review_id: reviewId, user_id});
    if (!reviewExists) throw new CustomError('Review not found or not authorized to update', 403);
    const updatedReview = await Review.findOneAndUpdate(
      {review_id: reviewId},
      {rating, review},
      {new: true}
    );
    return updatedReview;
  } catch (error) {
    throw new CustomError(error.message || 'Failed to update review', error.status || 422);
  }
};

const deleteReview = async (req) => {
  try {
    const user_id = req.user.user_id;
    const reviewId = req.params.id;
    const reviewExists = await Review.findOne({review_id: reviewId, user_id});
    if (!reviewExists) throw new CustomError('Review not found or not authorized to delete', 403);
    const deletedReview = await Review.findOneAndDelete({review_id: reviewId});
    return deletedReview;
  } catch (error) {
    throw new CustomError(error.message || 'Failed to delete review', error.status || 422);
  }
};

export {addReview, deleteReview, getReviews, updateReview};
