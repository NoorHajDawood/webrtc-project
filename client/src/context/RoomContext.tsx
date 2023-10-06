import Peer from "peerjs";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:3500";

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(serverUrl);

interface IRoomProviderProps {
	children: React.ReactNode;
}

interface IRoomDetails {
	roomId: string;
	participants: string[];
}

export const RoomProvider: React.FC<IRoomProviderProps> = ({ children }) => {
	const navigate = useNavigate();
	const [peer, setPeer] = useState<Peer | null>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);

	const enterRoom = ({ roomId }: { roomId: string }) => {
		navigate(`/room/${roomId}`);
	};

	useEffect(() => {
		setPeer(new Peer(uuidv4()));

		try {
			navigator.mediaDevices
				.getUserMedia({ video: true, audio: true })
				.then((stream) => {
					setStream(stream);
				});
		} catch (err) {
			console.log("Error: " + err);
		}

		ws.on("createdRoom", enterRoom);
		ws.on("joinedRoom", ({ roomId, participants }: IRoomDetails) => {
			console.log("joinedRoom uuid ", roomId);
			console.log("joinedRoom participants ", participants);
		});
		ws.on("peerJoined", ({ peerId }: { peerId: string }) => {
			console.log("peerJoined peerId ", peerId);
		});
		ws.on("peerLeft", ({ peerId }: { peerId: string }) => {
			console.log("peerLeft peerId ", peerId);
		});
	}, []);

	return (
		<RoomContext.Provider value={{ ws, peer, stream }}>
			{children}
		</RoomContext.Provider>
	);
};
