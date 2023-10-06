import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { RoomProvider } from "./context/RoomContext";
import "./index.css";
import { Home, Room } from "./pages";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	// <React.StrictMode>
	<BrowserRouter>
		<RoomProvider>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/room/:roomId" element={<Room />} />
			</Routes>
		</RoomProvider>
	</BrowserRouter>
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
