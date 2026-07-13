import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    clerkId:{
        type:String,
        required: true,
        unique: true,
    },

    email:{
        type:String,
        required: [true,"You must provide an email"],
        unique: true,
    },
    fullName:{
        type:String,
        required: [true,"You must provide the full name"],
    },
    profilePic:{
        type:String,
        default: ""
    },
}, {timestamps:true},
);

const User = mongoose.model("User",userSchema);

export default User;