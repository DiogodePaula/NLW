import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

type RoomParams = {
	id: string;
};

export function Room() {
	const params = useParams<RoomParams>();

	if (!params.id) {
		return <Navigate replace to="/" />;
	}

	const { data } = useQuery({
		queryKey: ["get-room", params.id],
		queryFn: async () => {
			const response = await fetch(`http://localhost:3333/rooms/${params.id}`);
			const data: RoomParams = await response.json();

			return data;
		},
	});

	return (
		<div>
			<h1>{data?.id}</h1>
		</div>
	);
}
