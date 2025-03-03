import Review from "../models/Review.js";

// /review/product/id

const getReviews = async (bookId) => {
  const reviews = await Review.find({ book_id: bookId });
  return reviews;
};

const addReview = async (data) => {
  // console.log(newReview);
  const addedReview = await Review.create(data);
  return addedReview;
};

const updateReview = async (id, body) => {
  console.log(id, body);
  const { rating, review } = body;
  console.log(rating, review);
  const updatedReview = await Review.findOneAndUpdate(
    { review_id: id },
    { rating: rating, review: review }
  );
  return updatedReview;
};

const deleteReview = async (id) => {
  const deletedReview = await Review.findOneAndDelete({ review_id: id });
  return deletedReview;
};

export { addReview, getReviews, updateReview, deleteReview };
