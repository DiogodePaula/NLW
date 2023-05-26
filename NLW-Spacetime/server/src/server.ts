import fastify from "fastify";
import cors from "@fastify/cors";

import { memoriesRoutes } from "./routes/memories";

const app = fastify();

app.register(cors, {
	origin: true, // todas URLs de front-end poderão acessar nosso back-end
	// origin: ["http://localhost:3000", "https://APLICAÇÃO-PRODUÇÃO.com/memories"], uso em produção listar urls que poderão ter acesso
});
app.register(memoriesRoutes);

app.listen({
	port: 3333,
}).then(() => {
	// Emoji windows + .
	console.log("running 😁 http://localhost:3333");
});
