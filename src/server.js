import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"

import booksRoutes from "./books/index.js"

const app = express()

const port = process.env.PORT || 3001 // no need to configure it manually on Heroku

//app.use(cors()) // no options means allow everybody

// app.use(cors({ origin: process.env.FE_URL })) // "http://localhost:3000" is the only origin allowed

const whitelist = [process.env.FE_URL_DEV, process.env.FE_URL_PROD] // You NEED to configure it manually on Heroku

const corsOptions = {
  origin: function (origin, next) {
    if (whitelist.indexOf(origin) !== -1) {
      console.log("ORIGIN ", origin)
      // origin found in whitelist
      next(null, true)
    } else {
      // origin not found in the whitelist
      next(new Error("Not allowed by CORS"))
    }
  },
}

app.use(express.json())
app.use(express.urlencoded())
app.use(cors(corsOptions))

// CROSS ORIGIN RESOURCE SHARING

// ORIGIN

// 2 different domains are 2 different orgins
// FE http://domain-a.com
// BE http://domain-b.com

// same domains with different ports are different origins
// FE http://localhost:3000
// BE http://localhost:3001

// same domains with different protocols are different origins
// FE http://domain-a.com
// BE https://domain-a.com

// routers

app.use("/books", booksRoutes)

console.log(listEndpoints(app))

app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    // no need to configure it manually on Heroku
    console.log("Server running on cloud on port: ", port)
  } else {
    console.log("Server running locally on port: ", port)
  }
})
