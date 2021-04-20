import express from "express"
import fs  from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 } from "cloudinary"
import uniqid from 'uniqid'

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
router.post("/:asin/comments", async (req, res, next) => {
  try {
    const books = await fs.readJSON(booksPath)
    const comments = await fs.readJSON(commentsPath)
    const selectedBook = books.filter(book => book.asin === req.params.asin)

    if (!selectedBook){
      const err = new Error ({ errMsg: "Book not found!"})
      err.httpStatusCode = 404
      next(err)
    }
    
    const newComment = { ...req.body, _id: uniqid(), date: new Date()}
    comments.push(newComment)
    await fs.writeJSON(commentsPath, comments)
    res.status(200).send({ msg : "Comment successfully updated!", data: newComment})
  } catch (error) {
    next(error)
  }
})

router.get("/:asin/comments", async (req, res, next) => {
  try {
    const comments = await fs.readJSON(commentsPath)
    const selectedComments = comments
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

router.delete("/:asin", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

export default router
