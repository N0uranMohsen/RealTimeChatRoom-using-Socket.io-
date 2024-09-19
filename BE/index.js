import express from "express";
import { Server } from "socket.io";
import { dbConn } from "./DB/dbConn.js";
import jwt from 'jsonwebtoken'
import { Message } from "./DB/models/message.js";
import { User } from "./DB/models/user.js";
const app = express();
const port = 3000;
dbConn();
const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
const io = new Server(server, {
  cors: "*",
});
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on('updateSocketId',async(data)=>{
    const {token}= data
   
    const payload = jwt.verify(token, "secretKey");
    await User.findByIdAndUpdate(payload._id,{socketId:socket.id})
  })
  socket.on("getMessages", async (data) => {
    const { token, to } = data;
    const payload = jwt.verify(token, "secretKey");
    const messages = await Message.find({
      $or: [
        { to, from: payload._id },
        { to: payload._id, from: to },
      ],
    });

    socket.emit("retrieveMessages", { messages });
  });
  socket.on("addMessage", async(data) => {
    const { token, to, message } = data;
    const payload = jwt.verify(token, "secretKey");
    const toUser = await User.findById(to)
    const msg = await Message.create({to,from:payload._id,message})
    io.to([socket.id,toUser._id]).emit('newMessage',{message:msg})
  });
 

});
const token =jwt.sign({_id:'66db835d9a51e95b3862d696'},'secretKey')
console.log(token);

