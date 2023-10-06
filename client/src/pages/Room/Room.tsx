import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer } from "../../components";
import { PeerState } from "../../context/PeerReducer";
import { RoomContext } from "../../context/RoomContext";

export const Room = () => {
	const { roomId } = useParams();
	const { ws, peer, stream, peers } = useContext(RoomContext);

	useEffect(() => {
		if (!peer) return;
		ws.emit("joinRoom", { roomId, peerId: peer.id });
	}, [roomId, peer, ws]);

	return (
		<>
			Room {roomId}
			<div className="grid grid-cols-4 gap-4">
				<VideoPlayer stream={stream} />

				{Object.values(peers as PeerState).map((peer) => (
					<VideoPlayer stream={peer.stream} />
				))}
			</div>
		</>
	);
};
