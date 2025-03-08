import express from 'express';
import * as BooksController from '../controllers/books.js';
import {asyncWrapper} from '../helpers/asyncWrapper.js';
import CustomError from '../helpers/CustomError.js';
import upload from '../middlewares/upload.js';
import 'express-async-errors';

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      throw new CustomError('Image file is required', 400);
    }

    req.body.image = `/uploads/${req.file.filename}`;

    const [err, addedBook] = await asyncWrapper(BooksController.addBook(req.body));

    if (err) {
      return res.status(err.status).json({error: err.message});
    }

    res.status(201).json(addedBook);
  } catch (error) {
    res.status(error.status).json({error: error.message});
  }
});

router.get('/', async (req, res) => {
  const [err, books] = await asyncWrapper(BooksController.getFilteredBooks(req.query));
  if (err)
    return res.status(err.status).json({error: err.message});

  res.json(books);
});

router.get('/:id', async (req, res) => {
  const [err, book] = await asyncWrapper(BooksController.getBook(req.params.id));
  if (err)
    return res.status(err.status).json({error: err.message});

  res.json(book);
});

router.delete('/:id', async (req, res) => {
  const [err, result] = await asyncWrapper(BooksController.deleteBook(req.params.id));

  if (err)
    return res.status(err.status).json({error: err.message});

  res.json(result);
});

router.patch('/:id', upload.single('image'), async (req, res) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  const [err, book] = await asyncWrapper(BooksController.editBook(req.params.id, req.body));

  if (err)
    return res.status(err.status).json({error: err.message});

  res.json(book);
});

export default router;
