'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
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
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

app.get('/test', (request, response) => {

  response.send('test request received')

})
app.post('/books', async (req, res) => {
  try {
    // Task 2: Grab properties from the request object
    const { title, author, genre, description } = req.body;

    // Task 3: Create a Book object
    const newBook = new Books({ title, author, genre, description });

    // Log to console for verification
    console.log('New Book:', newBook);

    // Task 4: Add book object to the database
    await newBook.save();

    // Task 5: Respond with JSON representation of the newly-saved book
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error saving book to database:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


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
