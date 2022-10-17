import express from "express";
import "./database/connection";
import path from "path";
import "express-async-errors";
import cors from "cors";

import routes from "./routes";
import errorHandler from "./error/handler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(errorHandler);

app.listen(3333);

// ---------------------------------------------------------------------------------------------------------
// Rotas = conjunto
// Recurso = usuário
// Método HTTP = GET, POST, PUT, DELETE
// Parâmetros

// Tipos de parâmetros
// Query, são enviados com ponto de interrogação, para realizar algum tipo de busca dentro da aplicação
// http://localhost:3333/users?search=diego

// Route Params, para identificar um dado especifico que ja existe
// http://localhost:3333/users/1

// Body, serve para enviarmos dados que normalmente vem de formulários

// app.get("/", (req, res) => {
//   console.log(req.query);
//   console.log(req.params);
//   console.log(req.body);

//   return res.json({ message: "Hello World" });
// });

// ---------------------------------------------------------------------------------------------------------
