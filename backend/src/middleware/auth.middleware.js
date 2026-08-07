import { getAuth } from "@clerk/express"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const { userId } = getAuth(req)

        if (!userId) {
            res.status(401).json({ msg:"Unauthorized" })
            return
        }

        const user = await User.findOne({clerkId:userId})

        if (!user) {
            res.status(404).json({ msg:"User profile not synced yet" })
            return
        }

        req.User = user

        next()
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ msg:"Internal server error" })
    }
}