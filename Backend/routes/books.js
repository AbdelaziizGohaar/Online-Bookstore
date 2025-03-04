import express from 'express';
import * as BooksController from '../controllers/books.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const [err, addedBook] = await asyncWrapper(BooksController.addBook(req.body));

  if (err) {
    console.log('error');

    return res.status(422).json({error: err.message});
  }

  res.json(addedBook);
});

router.get('/', async (req, res) => {
  try {
    const {title, author, minPrice, maxPrice} = req.query;
    const filters = {};

    if (title) filters.title = new RegExp(title, 'i'); // Case-insensitive search
    if (author) filters.author = new RegExp(author, 'i');
    if (minPrice) filters.price = {...filters.price, $gte: Number(minPrice)};
    if (maxPrice) filters.price = {...filters.price, $lte: Number(maxPrice)};

    const books = await BooksController.getFilteredBooks(filters);
    res.json(books);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.delete('/:id', async (req, res) => {
  const [err, result] = await asyncWrapper(BooksController.deleteBook(req.params.id));

  if (err) return res.status(422).json({error: err.message});

  res.json({message: 'Book deleted successfully', result});
});

router.patch('/:id', async (req, res) => {
  const [err, book] = await asyncWrapper(BooksController.editBook(req.params.id, req.body));

  if (err) return res.status(422).json({error: err.message});

  res.json(book);
});

export default router;
