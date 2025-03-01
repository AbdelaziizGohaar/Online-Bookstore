import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import mongooseSequence from "mongoose-sequence"; 

const AutoIncrement = mongooseSequence(mongoose); // Initialize it Autoincrement of Mongos 

const OrderSchema = new mongoose.Schema({
  order_id:{
  type : Number,    // auto increment  
  unique: true ,
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
        required: true,
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

//============= Apply Auto-Increment Plugin===============================================
OrderSchema.plugin(AutoIncrement, { inc_field: "order_id" });


///===================== Calculate the total amount ======================================================================== 
OrderSchema.pre('save', async function (next) {
  const Book = mongoose.model('Book'); // Import Book model
  let total = 0;

  for (const item of this.books) {
    const book = await Book.findById(item.book_id);
    if (book) {
      total += book.price * item.quantity;
    }
  }
  this.totalPrice = total;
  next();
});

  // Validate stock for each book in the order

const Order = mongoose.model("Order", OrderSchema);
export default Order;
