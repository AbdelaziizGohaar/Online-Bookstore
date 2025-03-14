import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose); // Initialize it Autoincrement of Mongos

const PaymentSchema = new mongoose.Schema({
  payment_id: {
    type: String // Provided by the payment gateway
  },
  paymentMethod: {
    type: String,
    required: false, // e.g., "Credit Card", "PayPal", "Stripe"
    enum: ['credit_card', 'paypal', 'stripe']
  },
  amount_paid: {
    type: Number,
    required: false,
    validate: {
      validator(value) {
        return value <= this.parent().totalPrice; // Ensure amount_paid <= totalPrice
      },
      message: 'Amount paid cannot exceed the total price.'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  currency: {
    type: String,
    enum: ['usd', 'eur', 'gbp'], // Add supported currencies
    default: 'usd'
  },
  paymentDate: {
    type: Date,
    default: null // Will be set when payment is completed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const OrderSchema = new mongoose.Schema({
  Paymentdetails: PaymentSchema,
  order_id: {
    type: Number, // auto increment
    unique: true
  },
  user_id: {
    type: Number,
    ref: 'User',
    required: true
  },
  books: [
    {
      book_id: {
        type: Number,
        ref: 'Book',
        required: true
      },
      book_name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: false,
        min: 1
      },
      booknum: {
        type: Number,
        required: false,
        min: 1
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'canceled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ============= Apply Auto-Increment Plugin===============================================
OrderSchema.plugin(AutoIncrement, {inc_field: 'order_id'});

/// ===================== Calculate the total amount ========================================================================
OrderSchema.pre('save', async function (next) {
  const Book = mongoose.model('Book'); // Import Book model
  let total = 0;

  for (const item of this.books) {
    const book = await Book.findOne({book_id: item.book_id});

    if (book) {
      total += book.price * item.quantity;
    }
  }
  this.totalPrice = total;
  next();
});

// Validate stock for each book in the order

const Order = mongoose.model('Order', OrderSchema);
export default Order;

// payment: {
//     payment_id: {
//       type: String, // Stripe Payment Intent ID
//     },
//     payment_method: {
//       type: String, // e.g., card, bank transfer
//     },
//     amount_paid: {
//       type: Number, // Total amount paid
//     },
//     currency: {
//       type: String, // e.g., usd
//     },
//   }
