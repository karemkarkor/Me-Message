import express from "express"
import "dotenv/config"
import {clerkMiddleware} from "@clerk/express"
import cors from "cors"

// Local imports
import connectDB from "./lib/connectDB.js"

const app = express()

const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL

// MiddleWare
app.use(express.json())
app.use(cors({origin:FRONTEND_URL, credentials:true}))
app.use(clerkMiddleware())


// Routes
app.get("/heath", (req,res)=> res.status(200).json({ok:true}))



app.listen(PORT, ()=> {
    connectDB();
    console.log("Server running on PORT:", PORT)
})
