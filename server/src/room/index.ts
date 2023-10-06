import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

const rooms: Record<string, string[]> = {};

interface IRoomParams {
    roomId: string;
    peerId: string;
}

export const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        const roomId = uuidv4();
        rooms[roomId] = [];
        socket.emit('createdRoom', { roomId });
    }
    const joinRoom = ({ roomId, peerId }: IRoomParams) => {
        if (!rooms[roomId]) {
            return socket.emit('roomNotFound');
        }
        socket.join(roomId);
        rooms[roomId].push(peerId);
        socket.emit('joinedRoom', {
            roomId,
            participants: rooms[roomId].filter((id) => id !== peerId),
        });
        socket.on('ready', () => {
            socket.broadcast.to(roomId).emit('peerJoined', { peerId });
        })

        socket.on('disconnect', () => {
            leaveRoom({ roomId, peerId });
        });
    }
    const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
        socket.leave(roomId);
        socket.broadcast.to(roomId).emit('peerLeft', { peerId });
        rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
    }

    socket.on('createRoom', createRoom);
    socket.on('joinRoom', joinRoom);
}