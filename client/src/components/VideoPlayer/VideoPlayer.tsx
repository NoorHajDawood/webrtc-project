import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{ stream: MediaStream }> = ({ stream }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (!videoRef.current) return;

		videoRef.current.srcObject = stream;
	}, [stream]);

	return (
		<video
			style={{ width: "100%" }}
			ref={videoRef}
			autoPlay
			playsInline
			muted
		/>
	);
};
