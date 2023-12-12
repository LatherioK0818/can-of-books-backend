'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Books = require('./models/books.js');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL)
const db = mongoose.connection;

db.on('error',console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected')
});
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/test', (request, response) => {

  response.send('test request received')

})
app.get('/books', async (req, res) => {
  try {
    const books = await Books.find();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @desc    Create book
// @route   POST /books/add
app.post('/addBooks', async (req, res) => {
  try {
    const q = req.query;
    let msg = {};
    // Check if a book with the same title already exists
    const existingBook = await Books.findOne({ title: q.title });
    if (existingBook) {
      // If the book already exists, return the existing book
      msg = { 'Book already exists': existingBook };
      res.json(msg);
    } else {
      // If the book doesn't exist, create it
      await Books.create(q);
      msg = {'Books added': q};
      res.json(msg);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await Books.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const msg = ['Book updated:', updatedBook];
    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Books.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(PORT, () => console.log(`listening on ${PORT}`));
