import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../../components";
import { RoomContext } from "../../context/RoomContext";

export const Room = () => {
	const { roomId } = useParams();
	const { ws, peer, stream } = useContext(RoomContext);

	useEffect(() => {
		if (!peer) return;
		ws.emit("joinRoom", { roomId, peerId: peer.id });
	}, [roomId, peer, ws]);

	return (
		<div>
			<VideoPlayer stream={stream} />
		</div>
	);
};
