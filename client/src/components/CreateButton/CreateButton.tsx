import * as React from "react";
import { RoomContext } from "../../context/RoomContext";

export const CreateButton: React.FC = () => {
	const { ws } = React.useContext(RoomContext);

	const joinRoom = () => {
		ws.emit("createRoom");
	};

	return (
		<button
			onClick={joinRoom}
			className="bg-blue-400 py-2 px-8 rounded-lg text-xl hover:bg-blue-600 text-white"
		>
			Create a room
		</button>
	);
};
