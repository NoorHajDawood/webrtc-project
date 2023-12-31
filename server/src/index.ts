import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { roomHandler } from './room';

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
    roomHandler(socket);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
