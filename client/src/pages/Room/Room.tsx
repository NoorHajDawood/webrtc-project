import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShareScreenButton, VideoPlayer } from "../../components";
import { PeerState } from "../../context/PeerReducer";
import { RoomContext } from "../../context/RoomContext";

export const Room = () => {
	const { roomId } = useParams();
	const { ws, peer, stream, peers, shareScreen } = useContext(RoomContext);

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
			<div className="fixed bottom-0 p-5 w-full flex justify-center border-t-2">
				<ShareScreenButton onClick={shareScreen} />
			</div>
		</>
	);
};
