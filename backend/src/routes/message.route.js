import express from "express";
import { getUsersForSidebar, getUsersForChat, getMessages, sendMessages } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

router.get("/users", getUsersForSidebar)
router.get("/conversations", getUsersForChat)
router.get("/:id", getMessages)
router.post("/send/:id", upload.single("media") ,sendMessages)

export default router