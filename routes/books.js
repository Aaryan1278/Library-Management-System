const express = require("express");
const {books} = require("../data/books.json");
const {users} = require("../data/users.json");

const router = express.Router();


router.get('/',(req,res)=>{
    res.status(200).json({
        sucess:true,
        data: books
    })
})

router.get('/:id',(req,res)=>{
    const {id} = req.params;
    const book = books.find((each)=>each.id == id)
    if(!book){
        return res.status(404).json({
            success:false,
            message:`Book Not Found for id: ${id}`
        })
    }
    res.status(200).json({
        success:true,
        data: book
    })
})

router.post('/',(req,res)=>{
    const {id,title,author,publiser,price} = req.body;
    if(!id || !title || !author || !publiser || !price){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    const book = books.find((each)=>each.id === id)
    if(book){
        return res.status(409).json({
            success:false,
            message:`Book Already Exists with id: ${id}`
        })
    }
    books.push({
        id,
        title,
        author,
        publiser,
        price
    })
    res.status(201).json({
        success:true,
        message:"Book added successfully",
        data:{id,title,author,publiser,price}
    })
})

router.put('/:id',(req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    const book = books.find((each)=>each.id == id)
    if(!book){
        return res.status(404).json({
            success:false,
            message:`Book Not Found for id: ${id}`
        })
    }
    // Update the book details
    // Object.assign(book,data);

    const updatedBook = books.map((each)=>{
        if(each.id == id){
            return {...each,...data};
        }        return each;
    });

    book.name = name;
    book.author = author;
    book.publiser = publiser;
    book.price = price;

    res.status(200).json({
        success:true,
        message:"Book updated successfully",
        data:book
    })
})

router.delete('/:id',(req,res)=>{
    const {id} = req.params;
    const book = books.find((each)=>each.id == id)
    if(!book){
        return res.status(404).json({
            success:false,
            message:`Book Not Found for id: ${id}`
        })
    }
    const updatedBooks = books.filter((each)=>each.id != id)
    res.status(200).json({
        success:true,
        message:"Book deleted successfully",
        data:updatedBooks
    })
})

router.get('/issued/for-users',(req,res)=>{
    const issuedWithUser = users.filter((each)=>{
        if(each.issuedBook){
            return each;
        }

    })
    const issuedBooks = [];

    userWithBook.forEach((each)=>{
        const book = books.find((book)=>book.id === each.issuedBook)
        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book)


    })
    if(!issuedBooks === 0){
        return res.status(404).json({
            success:false,
            message:"No Books are issued yet"
        })
    }

    res.status(200).json({
        success:true,
        data:issuedWithUser
    })
})


module.exports = router;