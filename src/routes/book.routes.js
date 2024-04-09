const express = require('express');
const router = express.Router();
const Book = require('../models/book.model')


//middleware
const getBook = async(req,res,next)=>{
    let book;
    const {id} =req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message: 'Invalid ID'
        });
    }

    try {
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message: 'Book not found'});
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
    res.book = book;
    next();
}

//Get all books

router.get('/', async (req,res)=>{
    try {
        const books = await Book.find();
        console.log(books);

        if(books.length == 0){
            return res.status(204).json([]);
        }

        res.json(books);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})

//Get book by ID

router.get(`/:id`,getBook, async(req,res)=>{
        res.json(res.book);
        console.log(book);
        if(!book){
            return res.status(404).message('This book does not exist.')
        }

})

//Create book

router.post('/', async (req,res)=>{
    const{
        title,
        author,
        gender,
        publication_date,
    } = req?.body;
    if(!title || !author || !gender || !publication_date){
        return res.status(400).json({message: 'Todos los campos son obligatorios'});
    }

    const book = new Book(
        {
            title,
            author,
            gender,
            publication_date
        }
    )
    try {
        const newBook = await book.save();
        console.log(newBook);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

// Modify book

router.put('/:id', getBook, async(req,res)=>{
    try {
        const book = res.book;

        book.title = req.body.title || book.title;
        book.author = req.body.author ||book.author;
        book.gender = req.body.gender ||book.gender;
        book.publication_date = req.body.publication_date || book.publication_date;

        const bookModify = await book.save();
        res.json(bookModify);
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
})

// Modify by patch book

router.patch("/:id",getBook, async(req,res)=>{


    if(!req.body.title && !req.body.author && !req.body.gender && !req.body.publication_date){
        return res.status(400).message({message: 'At least one feld must be required'});
    }
    try {
    const book = res.book;

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.gender = req.body.gender || book.gender;
    book.publication_date = req.body.title || book.publication_date;

    const bookModify = await book.save();
    res.json(bookModify);
    } catch (error) {
        console.log(error);
    }
})

router.delete('/:id',getBook, async(req,res)=>{
    try {
        const bookToDelte = res.book;

        await bookToDelte.deleteOne({
            _id: bookToDelte._id
        });
        res.json({
            message: `Book ${bookToDelte.title} was deleted.`
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})


module.exports=
    router