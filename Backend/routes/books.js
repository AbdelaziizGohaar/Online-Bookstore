import express from 'express';
import * as BooksController from '../controllers/books.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';
import 'express-async-errors';

const router = express.Router();

router.post('/', async (req, res) => {
  const [err, addedBook] = await asyncWrapper(BooksController.addBook(req.body));

  if (err)
    return res.status(err.status).json({error: err.message});

  res.json(addedBook);
});

router.get('/', async (req, res) => {
  const [err, books] = await asyncWrapper(BooksController.getFilteredBooks(req.query));
  if (err)
    return res.status(err.status).json({error: err.message});

  res.json(books);
});

router.delete('/:id', async (req, res) => {
  const [err, result] = await asyncWrapper(BooksController.deleteBook(req.params.id));

  if (err)
    return res.status(err.status).json({error: err.message});

  res.json(result);
});

router.patch('/:id', async (req, res) => {
  const [err, book] = await asyncWrapper(BooksController.editBook(req.params.id, req.body));

  if (err)
    return res.status(err.status).json({error: err.message});

  res.json(book);
});

export default router;
