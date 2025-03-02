import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const ReviewSchema = new mongoose.Schema(
  {
    review_id: {
      type: Number,
      unique: true
      // required: true
    },
    user_id: {
      type: mongoose.Schema.Types.Number,
      ref: 'User',
      required: true
    },
    book_id: {
      type: mongoose.Schema.Types.Number,
      ref: 'Book',
      required: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer.'
      }
    },
    review: {
      type: String,
      trim: true
    }
  },
  {timestamps: true}
);

ReviewSchema.plugin(AutoIncrement, {inc_field: 'review_id'});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
