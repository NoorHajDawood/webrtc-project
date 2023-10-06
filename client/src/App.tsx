import React, { useEffect } from "react";
import socketIO from "socket.io-client";
import "./App.css";
import logo from "./logo.svg";

const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:3500";

function App() {
	useEffect(() => {
		const socket = socketIO(serverUrl);
		socket.on("connect", () => {
			console.log("connected");
		});
		socket.on("disconnect", () => {
			console.log("disconnected");
		});
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
