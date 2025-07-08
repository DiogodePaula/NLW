import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface RoomList {
	id: string;
	name: string;
}

export function CreateRoom() {
	const { data, isLoading } = useQuery({
		queryKey: ["get-rooms"],
		queryFn: async () => {
			const response = await fetch("http://localhost:3333/rooms");
			const data: RoomList[] = await response.json();

			return data;
		},
	});

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="flex w-full max-w-md flex-col gap-4">
				<h1 className="text-2xl font-bold">Create a new room</h1>

				{isLoading ? (
					<div className="flex items-center justify-center">
						<Loader2 className="h-10 w-10 animate-spin" />
					</div>
				) : (
					data?.map((room) => (
						<Link key={room.id} to={`/rooms/${room.id}`}>
							{room.name}
						</Link>
					))
				)}
			</div>
		</div>
	);
}
