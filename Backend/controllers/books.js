import Book from '../models/Book.js';

const addBook = async (data) => {
  const addedBook = await Book.create(data);
  return addedBook;
};

const getFilteredBooks = async (filters) => {
  const books = await Book.find(filters)
    .select('-_id title author price description stock image')
    .exec();

  return books;
};
const deleteBook = async (id) => {
  await Book.deleteOne({book_id: id});
};

const editBook = async (id, data) => {
  const updatedBook = await Book.findOneAndUpdate(
    {book_id: id},
    data,
    {new: true, runValidators: true}
  ); if (!updatedBook) {
    throw new Error('Employee not found');
  }
  return updatedBook;
};

export {
  addBook,
  deleteBook,
  editBook,
  getFilteredBooks
};
