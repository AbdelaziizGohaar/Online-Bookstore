import Review from "../models/Review.js";

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
  const { rating, review } = body;
  const updatedReview = await Review.findOneAndUpdate(
    { review_id: id },
    { rating: rating, review: review },
    {new: true}
  );
  return updatedReview;
};

const deleteReview = async (id) => {
  const deletedReview = await Review.findOneAndDelete({ review_id: id });
  return deletedReview;
};

export { addReview, getReviews, updateReview, deleteReview };
