import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../../context/RoomContext";

export const Room = () => {
	const { roomId } = useParams();
	const { ws } = useContext(RoomContext);

	useEffect(() => {
		ws.emit("joinRoom", { roomId });
	}, [roomId]);

	return <>Room ID {roomId}</>;
};
