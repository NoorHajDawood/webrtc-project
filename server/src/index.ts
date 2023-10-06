import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const port = process.env.PORT || 3500;
const app = express();
app.use(cors);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
