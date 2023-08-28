import "dotenv/config";
import fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";

import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";

const app = fastify();

app.register(cors, {
	origin: true, // todas URLs de front-end poderão acessar nosso back-end
	// origin: ["http://localhost:3000", "https://APLICAÇÃO-PRODUÇÃO.com/memories"], uso em produção listar urls que poderão ter acesso
});
app.register(jwt, { secret: "spacetime" });
app.register(authRoutes);
app.register(memoriesRoutes); // registra um arquivo de rotas separado

app.listen({
	port: 3333,
	host: "0.0.0.0", // para funcionar no mobile
}).then(() => {
	// Emoji windows + .
	console.log("running 😁 http://localhost:3333");
});
