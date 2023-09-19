require("dotenv").config();
require('express-async-errors');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors')
const express = require("express")
const app = express()
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const multer = require('multer');
path = require("path");
app.use(cors());


// const path = require("path")
// app.use(express.static(path.resolve(__dirname, './client/build')));

const connectDB = require("./db/connect")
const authenticateUser = require("./middleware/authentication")
//routers :
//* 
const jobsRouter = require("./routes/jobs")
const authRouter = require("./routes/auth")
//** 

// error handler :
//*
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
//** 

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors())
app.use(helmet());
app.use(xss());
app.use(express.static('upload'))


//routes
//** 
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

const messagesRouter = require('./routes/messages')
app.use("/api/v1/messages", authenticateUser, messagesRouter);

const usersRouter = require("./routes/users")
app.use("/api/v1/users", authenticateUser, usersRouter);
//** 

//middleware 
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const Port = process.env.PORT || 3001

const start = async () => {
    await connectDB(process.env.MONGO_URI)
    server.listen(Port, () => {
        console.log(`Server is running on http://localhost:${Port}`);
    });
}
start();



// backend.js


let usersOnline = [];

const io = socketIO(server, {
    cors: {
        origin: '', // Replace with your React app's URL
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {

    // track connection and users online ;
    socket.on("online", (userId) => {
        console.log("isOnline", userId)
        const isFound = usersOnline.filter((user) => (user.userId === userId) && (user.socketId) === (socket.id))
        if (isFound.length === 0) {
            usersOnline.push({ socketId: socket.id, userId: userId });
            io.emit("usersOnline", usersOnline);
            console.log(usersOnline);
        }
    })



    // room chat
    socket.on('joinRoom', (roomName) => {
        socket.join(roomName); // Join the specific room
        console.count('User joined room:', roomName);
    });

    socket.on('leaveRoom', (roomName) => {
        socket.leave(roomName); // Leave the specific room
        console.log('User left room:', roomName);
    });

    socket.on('addMessage', (data) => {
        console.log(data)
        const { roomName, payload } = data; // Extract roomName and message from data
        console.log('Received message:', payload, "roomName", roomName);
        io.to(roomName).emit('messageReceived', payload);
    });
    //////
    /// disconnected 
    socket.on('disconnect', async () => {
        usersOnline = usersOnline.filter(user => user.socketId != socket.id);
        io.emit("usersOnline", usersOnline);
        console.count('A client disconnected');
        console.log(usersOnline);
    });

});











// const port = 3005;
// server.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });