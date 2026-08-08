import {clerkMiddleware} from "@clerk/express"
import express from "express"
import cors from "cors"
import path from "path"
import fs from "fs"
import "dotenv/config"

// Local imports
import clerkWebhook from "./webhooks/clerk.webhook.js"
import messageRoutes from "./routes/message.route.js"
import authRoutes from "./routes/auth.route.js"
import connectDB from "./lib/connectDB.js"
import job from "./lib/cron.js"
import { protectRoute } from "./middleware/auth.middleware.js"

const app = express()


const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL
const publicDir = path.join(process.cwd(), "public")

// Clerk webhook
app.use("/api/webhooks/clerk",express.raw({ type: "application/json"}), clerkWebhook)

// MiddleWare
app.use(express.json())
app.use(cors({origin:FRONTEND_URL, credentials:true}))
app.use(clerkMiddleware())


// Routes

app.get("/health", (req,res)=> res.status(200).json({ok:true}))
app.use("/api/auth", authRoutes)
app.use("/api/messages",protectRoute, messageRoutes)



// Production Ready
if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir))

    app.get("/{*any}", (req, res, next) => {
        res.sendFile(path.join(publicDir, "index.html", (err) => next(err)))
    })
}


app.listen(PORT, ()=> {
    connectDB();
    console.log("Server running on PORT:", PORT)

    if(process.env.NODE_ENV === "production") job.start();
})
