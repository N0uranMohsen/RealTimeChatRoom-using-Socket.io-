import { model, Schema } from "mongoose";

const schema = new Schema({
    name:String,
    password:String,
    socketId:String
},{timestamps:true})
export const User =model('User',schema)