import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

const isRecordingSupported = !!navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function" && typeof window.MediaRecorder === "function";

type RoomParams = {
	roomId: string;
};

export function RecordRoomAudio() {
	const [isRecording, setIsRecording] = useState(false);
	const params = useParams<RoomParams>();
	const recorder = useRef<MediaRecorder | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	async function stopRecording() {
		setIsRecording(false);

		if (recorder.current && recorder.current.state !== "inactive") {
			recorder.current.stop();
		}

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	}

	async function uploadAudio(audio: Blob) {
		// application/multipart/form-data
		const formData = new FormData();
		formData.append("file", audio, "audio.webm");

		const response = await fetch(`http://localhost:3333/rooms/${params.roomId}/audio`, {
			method: "POST",
			body: formData,
		});

		const result = await response.json();
		console.log(result);
	}

	async function createRecorder(audio: MediaStream) {
		recorder.current = new MediaRecorder(audio, {
			mimeType: "audio/webm",
			audioBitsPerSecond: 64_000,
		});

		recorder.current.ondataavailable = (event) => {
			if (event.data.size > 0) {
				uploadAudio(event.data);
			}
		};

		recorder.current.onstart = () => {
			console.log("gravando...");
		};

		recorder.current.onstop = () => {
			console.log("parou de gravar");
		};

		recorder.current.start();
	}

	async function startRecording() {
		if (!isRecordingSupported) {
			alert("Gravação de áudio não suportada");
			return;
		}

		setIsRecording(true);

		// pegar video ou audio do usuário
		const audio = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				sampleRate: 44_100,
			},
		});

		await createRecorder(audio);

		intervalRef.current = setInterval(() => {
			recorder.current?.stop();
			// aqui no navegador eu nao consigo parar o audio e pegar um pedaço dele
			// tenho que que dar o stop e começar de novo
			createRecorder(audio);
		}, 5000);
	}

	if (!params.roomId) {
		return <Navigate replace to="/" />;
	}

	return (
		<div className="flex h-screen items-center justify-center flex-col gap-3">
			{isRecording ? <Button onClick={stopRecording}>Parar de gravar</Button> : <Button onClick={startRecording}>Gravar áudio</Button>}
			{isRecording && <p>gravando...</p>}
		</div>
	);
}
