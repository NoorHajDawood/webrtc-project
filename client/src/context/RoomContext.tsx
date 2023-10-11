import { get } from "http";
import Peer from "peerjs";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { addPeerAction, removePeerAction } from "./PeerActions";
import { peerReducer } from "./PeerReducer";
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
	const [peers, dispatch] = useReducer(peerReducer, {});
	const [screenSharingId, setScreenSharingId] = useState<string>("");

	const enterRoom = ({ roomId }: { roomId: string }) => {
		navigate(`/room/${roomId}`);
	};

	const getPeers = ({ participants }: { participants: string[] }) => {
		// participants.forEach((participant) => {
		//     const call = peer.call(participant, stream);
		//     call.on("stream", (remoteStream) => {
		//         console.log("getPeers remoteStream ", remoteStream);
		//         dispatch(addPeerAction(participant, remoteStream));
		//     });
		// });
		console.log("getPeers participants ", participants);
	};

	const removePeer = ({ peerId }: { peerId: string }) => {
		dispatch(removePeerAction(peerId));
	};

	const switchStream = (stream: MediaStream) => {
		setStream(stream);
		setScreenSharingId(peer?.id || "");
	};

	const shareScreen = () => {
		if (screenSharingId) {
			navigator.mediaDevices
				.getUserMedia({ video: true, audio: true })
				.then(switchStream);
		} else {
			navigator.mediaDevices.getDisplayMedia({}).then(switchStream);
		}

		// navigator.mediaDevices
		// 	.getDisplayMedia({ video: true, audio: true })
		// 	.then((screenStream) => {
		// 		const screenTrack = screenStream.getTracks()[0];
		// 		const sender = stream?.getTracks().find((track) => {
		// 			return track.kind === "video";
		// 		});
		// 		sender?.replaceTrack(screenTrack);
		// 		screenTrack.onended = () => {
		// 			const cameraTrack = stream?.getTracks().find((track) => {
		// 				return track.kind === "video";
		// 			});
		// 			sender?.replaceTrack(cameraTrack);
		// 		};
		// 	});
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
			console.error(err);
		}

		ws.on("createdRoom", enterRoom);
		ws.on("joinedRoom", ({ roomId, participants }: IRoomDetails) => {
			console.log("joinedRoom uuid ", roomId);
			getPeers({ participants });
		});
		ws.on("peerLeft", removePeer);
	}, []);

	useEffect(() => {
		if (!peer) return;
		if (!stream) return;

		ws.on("peerJoined", ({ peerId }: { peerId: string }) => {
			console.log("peerJoined peerId ", peerId);
			const call = peer.call(peerId, stream);
			call.on("stream", (remoteStream) => {
				console.log("peerJoined remoteStream ", remoteStream);
				dispatch(addPeerAction(peerId, remoteStream));
			});
		});

		peer.on("call", (call) => {
			console.log("peer call ", call);
			call.answer(stream);
			call.on("stream", (remoteStream) => {
				console.log("call remoteStream ", remoteStream);
				dispatch(addPeerAction(call.peer, remoteStream));
			});
		});

		ws.emit("ready");
	}, [peer, stream]);

	useEffect(() => {
		console.log({ peers });
	}, [peers]);

	return (
		<RoomContext.Provider value={{ ws, peer, stream, peers, shareScreen }}>
			{children}
		</RoomContext.Provider>
	);
};
