import fastify, { FastifyRequest } from "fastify";

export async function authenticate(req: FastifyRequest){
    await req.jwtVerify(); // verifica se existe um jwt no cabeçalho da requisição e se é um token valido
}