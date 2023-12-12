const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: Boolean,
});

const Book = mongoose.model('Book', bookSchema);

// Export this schema so it can be used in other parts of the application
module.exports = Book;