const express= require("express");
const dotenv = require("dotenv");
const db = require("./db/database");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const messageRoute =require("./routes/messageRoutes");
const { notFound, errorhandler } = require("./middleware/error");


dotenv.config();
const app = express();
const cors= require('cors');
app.use(cors());

db();

app.get("/",(req,res)=>{
    res.send("hello");
})
//to accept json file
app.use(express.json());


// app.use('/',userRoute);
app.use('/api/user',userRoute);
app.use('/api/chat',chatRoute);
app.use('/api/message',messageRoute);

//---> error handler code<----//
app.use(notFound);
app.use(errorhandler);


const server=app.listen(5000,console.log("server on 5000"));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
    socket.join(userData&&userData._id);
    socket.emit("connected");
  });
    socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User Joined Room: " + room);
  });

socket.on("typing", (room) => socket.in(room).emit("typing"));
socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

 socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
//clean socket otherwise it will consume lot of bandwidth:
    socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });

  });