import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema ({
    username:{
        type: String,
        required:true,
        unique: true,
    },
    email:{
        type: String,
        required:true,
        unique: true,
    },
    password:{
        type: String,
        required:true,
    },
    profilePicture: {
        type:String,
        default:'https://www.google.com/url?sa=i&url=https%3A%2F%2Fuxwing.com%2Fprofile-boy-icon%2F&psig=AOvVaw0kbkDU35zQRVFhHQ3H2vJ8&ust=1733910787031000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIiPzJb3nIoDFQAAAAAdAAAAABAI',
    },
},{timestamps: true});

const User = mongoose.model('User', userSchema);
export default  User