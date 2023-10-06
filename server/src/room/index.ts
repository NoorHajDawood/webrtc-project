import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

export const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        const roomId = uuidv4();
        socket.emit('createdRoom', { roomId });
    }
    const joinRoom = (roomId: string) => {
        socket.join(roomId);
        socket.emit('joinedRoom', { roomId });
    }

    socket.on('createRoom', createRoom);
    socket.on('joinRoom', joinRoom);
}