const express = require('express')
const cors = require('cors')
const cookie=require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const cookieParser = require('cookie-parser')
// dotenv.config({
//     path:'./env'  //alternative of do same as require('dotenv').config({path:'./env'})
// })  
// import connectDB from './config/db.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.use("/api",router)
const port = 8080 || process.env.PORT

connectDB()
app.listen(port,()=>{
    console.log("Server is running")
})
