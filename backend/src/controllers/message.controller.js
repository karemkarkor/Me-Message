import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-clerkId")
        res.status(200).json({count:filteredUsers.length, filteredUsers})
    } catch (error) {
        console.error("get sidebar users error", error);
        res.status(500).json({ msg:"Internal server error"})
    }
}

export const getUsersForChat = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const conversations = await Message.aggregate([
            { $match: { $or: [{ senderId:loggedInUserId },{ receiverId:loggedInUserId }] } },
            {
                $group: {
                    _id: {$cond: [{$eq: ["$senderId", loggedInUserId]}, "$receiverId", "$senderId"]},
                    lastMessageAt: { $max: "$createdAt"}
                }
            },
            { $sort:        {lastMessageAt: -1}},
            { $lookup:      {from: "users", localField: "_id", foreignField: "_id", as: "user"}},
            { $replaceRoot: {newRoot: {$first: "user"}}},
            { $project:     {clerkId: 0}},
        ])
        res.status(200).json({count:conversations.length, conversations})
    } catch (error) {
        console.error("get sidebar chats error", error);
        res.status(500).json({ msg:"Internal server error"})
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params
        const myId = req.user._id

        const chatMessages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ]
        }).sort({createdAt:1})
        
        res.status(200).json(chatMessages)
    } catch (error) {
        console.error("get getMessages error", error);
        res.status(500).json({ msg:"Internal server error"})
    }
}

export const sendMessages = async (req, res) => {
    try {
        const { text } = req.body;
        const { id:receiverId } = req.params
        const senderId = req.user._id

        let imageUrl;
        let videoUrl;

        if (req.file) {
            if(!hasImageKitConfig()) return res.status(500).json({msg:"media upload is not configured"})
            
            const url = await uploadChatMedia(req.file)

            if (req.file.mimetype.startsWith("video/")) videoUrl = url
            else imageUrl = url

        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            video:videoUrl,
            image:imageUrl,
        })

        await newMessage.save()

        // todo: realtime socketio



        res.status(201).json(newMessage)

    } catch (error) {
        console.error("get sendMessages error", error);
        res.status(500).json({ msg:"Internal server error"})
    }
}