import express from "express"
import fs  from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 } from "cloudinary"
import uniqid from 'uniqid'
import { log } from "console"

const dataFolder = join(dirname(fileURLToPath(import.meta.url)), "../data")
const booksPath = join(dataFolder, "books.json")
const commentsPath = join(dataFolder, "comments.json")

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: v2,
  params: {
    folder: "strive",
  },
})

const uploader = multer({ storage: cloudinaryStorage })

const router = express.Router()

router.get("/", async (req, res, next) => {
  try {
    const books = await fs.readJSON(booksPath)
    res.send(books)
  } catch (error) {
    next(error)
  }
})

router.get("/:asin", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

router.post("/", uploader.single("cover"), async (req, res, next) => {
  try {
    res.send({ cloudinaryURL: req.file.path })
  } catch (error) {
    next(error)
  }
})

//POST /books/:bookId/comments => adds a comment for book {bookId}
// router.post("/:asin/comments", async (req, res, next) => {
//   try {
//     const books = await fs.readJSON(booksPath)
//     const comments = await fs.readJSON(commentsPath)
//     const selectedBook = books.filter(book => book.asin === req.params.asin)

//     if (!selectedBook){
//       const err = new Error ({ errMsg: "Book not found!"})
//       err.httpStatusCode = 404
//       next(err)
//     }
    
//     const newComment = { ...req.body , _id: uniqid(), date: new Date()}
//     comments.push(newComment)
//     await fs.writeJSON(commentsPath, comments)
//     res.status(200).send({ msg : "Comment successfully updated!", data: newComment})
//   } catch (error) {
//     next(error)
//   }
// })

router.post("/:asin/comments", async (req, res, next) => {
  try {
    const books = await fs.readJSON(booksPath);
    let selectedBook = books.find(book => book.asin === req.params.asin)
    if (!selectedBook) {
      const err = new Error({ errMsg : "ASIN not found!"})
      err.httpStatusCode = 404
      next(err)
    } 
  
    const newComment = {
      ...req.body,
      commentId: uniqid(),
      createdAt: new Date(),
    };
    console.log(req.body)
    selectedBook.comments = [...selectedBook.comments, newComment]
    console.log(selectedBook)
    let newBooksArray = books.filter(book => book.asin !== req.params.asin)
    newBooksArray.push(selectedBook)
    await fs.writeJSON(booksPath, newBooksArray)
    res.send(newBooksArray)
  } catch (err) {
    const error = new Error(err.message);
    error.httpStatusCode = 500;
    next(error);
  }
});

router.get("/:asin/comments", async (req, res, next) => {
  try {
    const books = await fs.readJSON(booksPath)
    const selectedBook = books.find(book => book.asin === req.params.asin)
    if (selectedBook.hasOwnProperty("comments")) {
      const bookComments = selectedBook.comments
      res.status(200).send(bookComments)
    } else {
      res.send({ msg : "No comment available!"})
    }
  } catch (error) {
    next(error)
  }
})

router.put("/:asin", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

router.delete("/:asin/comments/:commentId", async (req, res, next) => {
  try {
    const books = await fs.readJSON(booksPath)
    let selectedBook = books.find(book => book.asin === req.params.asin)
    if (!selectedBook.hasOwnProperty("comments")) {
      const err = new Error({ errMsg : "There's no comment to delete from this book!"})
      err.httpStatusCode = 400
      next(err)
    }
    
    const bookComments = selectedBook.comments.filter(comm => comm._id !== req.params.commmentId)

    let newBooksArray = books.filter(book => book.asin !== req.params.asin)
    selectedBook.comments = [...bookComments]
    newBooksArray.push(selectedBook)
    // const removeComment = bookComments.filter(comment => comment._id !== req.params.commentId)
    await fs.writeJSON(booksPath, newBooksArray)
    res.send(selectedBook)
  } catch (error) {
    next(error)
  }
})

export default router
