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
app.get('/books', async (request, response) =>{
  let books = await Books.find();
  console.log(books);
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
