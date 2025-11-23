const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter=require('./routers/authRouter');
const studentProfile=require("./routers/studentProfile");
const connectionRouter=require('./routers/connectionRouter');
const projectSponsorProfile=require('./routers/projectSponsorProfile');
const path = require("path");
const http=require("http");
const socketIo=require("socket.io");
const mongoose=require("mongoose");
const chatRoutes=require("./routers/chatRoutes");



const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

require('dotenv').config();
require('./cron/cleanConnectionRequest');

require('./db/connect');

const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended:false })); 

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(cors({ origin:process.env.PROD_URL,credentials:true }));
app.use(cors({ origin:process.env.DEV_URL,credentials:true }));
app.use(cookieParser());

app.get('/', (req,res) => {res.status(200).send('OM NAMAH SHIVAYA')});

// example to use routers
 app.use('/v1/api/auth', authRouter);
 app.use('/v1/api/chat', chatRoutes); // Pass the io instance to chatRoutes
 app.use('/v1/api/student',studentProfile);
 app.use('/v1/api/connection',connectionRouter);
 app.use('/v1/api/sponsor',projectSponsorProfile);
 app.use('/v1/api/projects',projectSponsorProfile);

 let onlineUsers = {};

 io.on("connection", (socket) => {
   console.log("New client connected");
 
   socket.on("addUser", (userId) => {
     onlineUsers[userId] = socket.id;
   });
 
   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
     const receiverSocket = onlineUsers[receiverId];
     if (receiverSocket) {
       io.to(receiverSocket).emit("getMessage", { senderId, text });
     }
   });
 
   socket.on("disconnect", () => {
     console.log("Client disconnected");
   });
 });
 

server.listen(port,() => console.log(`server is running at port:${port}`));

