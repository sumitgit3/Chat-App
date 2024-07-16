import express from 'express'
import cors from "cors"
import {connect} from 'mongoose'
import dotenv from 'dotenv';
import authRouter from './routes/auth.js'
import messageRouter from './routes/message.js'
import { Server } from 'socket.io';

dotenv.config();
const app = express();
const port = process.env.PORT;
//connect to database
connect(process.env.MONGO_URI)
.then((res)=>{console.log("Connected to database")})
.catch((err)=>{console.log("Connection to database failed")});
//middleware->It reads the JSON payload from the request body, converts it into a JavaScript object, and attaches this object to the req.body property.
app.use(express.json());
app.use(cors());

//routes
app.use('/api/auth',authRouter);
app.use('/api/message',messageRouter);


//server listening
const server =app.listen(port,()=>{
    console.log("Server listening on port:"+port);
})

//attach socket to server
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });


global.onlineUsers = new Map();
io.on('connection',(socket)=>{
    //catch add-user event
    socket.on('add-user',(userId)=>{
        onlineUsers.set(userId,socket.id);
    });
    //catch send-msg event
    socket.on('send-msg',(data)=>{
        const receivingUserSocketId = onlineUsers.get(data.to);
        //if receiving user is online
        if (receivingUserSocketId) {
            socket.to(receivingUserSocketId).emit('message',data.message);
        } 
    });
    // Handle disconnection
  socket.on("disconnect", () => {
    // Find the user associated with this socket
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });

})



