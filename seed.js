const mongoose = require('mongoose');
require('dotenv').config();
//Bring in our Book Schema
const Book = require('./models/books.js');
// Open a connection to the Database
mongoose.connect( process.env.MONGODB_URL);

async function seed(){

    const fishBook = new Book({
        title: 'One Fish, Two Fish',
        description: "Childrens Book",
        status:  true,
    });

    const lawsBook = new Book ({
        title: "48 Laws of Power",
        description: " Motivational  Book",
        status: true,
    });
    const fantasyBook = new Book ({
        title: "American Gods",
        description: " Norse Mythology",
        status: true,
    });
    try {
        await fishBook.save();
        console.log("Saved");
        await lawsBook.save();
        console.log("Saved");
        await fantasyBook.save();
        console.log("Saved");
    } catch(e) { 
        console.error(e.message);
    }
    mongoose.disconnect();
}

seed();
  

