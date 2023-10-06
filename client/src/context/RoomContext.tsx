import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:3500";

export const RoomContext = createContext<null | any>(null);

const ws = socketIOClient(serverUrl);

interface RoomProviderProps {
	children: React.ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
	const navigate = useNavigate();

	const enterRoom = ({ roomId }: { roomId: string }) => {
		navigate(`/room/${roomId}`);
	};

	useEffect(() => {
		ws.on("createdRoom", enterRoom);
		ws.on("joinedRoom", ({ roomId }: { roomId: string }) => {
			console.log("joinedRoom uuid ", roomId);
		});
	}, []);

	return (
		<RoomContext.Provider value={{ ws }}>{children}</RoomContext.Provider>
	);
};
