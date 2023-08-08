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
const path = require("path")

app.use(express.static(path.resolve(__dirname, './dist')));

app.get("/", (req, res) => res.send("chat app"));
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







const io = socketIO(server, {
    cors: {
        origins: '*:*', // Replace with your React app's URL
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {

    socket.on('joinRoom', (roomName) => {
        socket.join(roomName); // Join the specific room
        console.count('User joined room:', roomName);
    });

    socket.on('leaveRoom', (roomName) => {
        socket.leave(roomName); // Leave the specific room
        console.log('User left room:', roomName);
    });

    socket.on('message', (data) => {
        const { roomName, payload } = data; // Extract roomName and message from data
        console.log('Received message:', payload);

        io.to(roomName).emit('messageRecived', payload);
    });

    socket.on('disconnect', () => {
        console.count('A client disconnected');
    });
});

// const port = 3005;
// server.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });