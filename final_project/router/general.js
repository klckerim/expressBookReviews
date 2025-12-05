const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!isValid(username)) {
        return res.status(404).json({ message: "Unable to register user." });
    }

    if (username && password) {
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });

        if (userswithsamename.length == 0) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

//Task 10
async function getBooksAsync() {
    const response = await axios.get("http://localhost:5000/");
    return response.data;
}
getBooksAsync()
    .then(data => console.log(data))
    .catch(err => console.error("Error:", err));


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

//Task 11
async function getBooksDetailsAsync() {
    const response = await axios.get("http://localhost:5000/isbn/4");
    return response.data;
}
getBooksDetailsAsync()
    .then(data => console.log(data))
    .catch(err => console.error("Error:", err));

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    return res.send(JSON.stringify(books[req.params.isbn], null, 4));
});

//Task 12
function getBooksByAuthorPromise(author) {
    axios.get(`http://localhost:5000/author/${author}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(err => {
            console.error("Error fetching by author:", err);
        });
}
getBooksByAuthorPromise("Chinua Achebe");

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    let results = [];
    for (let key of bookKeys) {
        let book = books[key];
        if (book.author === author) {
            results.push({
                id: key,
                ...book
            })
        }
    }
    return res.send(results);
});

//Task 13
function getBooksByTitlePromise(title) {
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(err => {
            console.error("Error fetching by title:", err);
        });
}
getBooksByTitlePromise("The Divine Comedy");

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    let results = [];
    for (let key of bookKeys) {
        let book = books[key];
        if (book.title === title) {
            results.push({
                id: key,
                ...book
            })
        }
    }
    return res.send(results);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let book = books[req.params.isbn];


    return res.status(300).json({ review: book["reviews"] });
});

module.exports.general = public_users;
