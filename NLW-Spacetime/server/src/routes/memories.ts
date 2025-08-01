import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
	// vai executar antes de todas as rotas para verificar se o usuário está logado
	app.addHook("preHandler", async (req) => {
		// jwtVerify() verifica se a requisição para está rota possui token de autenticação
		await req.jwtVerify();
	});

	app.get("/memories", async (req) => {
		const memories = await prisma.memory.findMany({
			where: {
				userId: req.user.sub, // vai trazer somente as memorias do usuário logado
			},
			orderBy: {
				createdAt: "asc",
			},
		});

		return memories.map((memory) => {
			return {
				id: memory.id,
				coverUrl: memory.coverUrl,
				except: memory.content.substring(0, 115).concat("..."),
				createdAt: memory.createdAt,
			};
		});
	});

	app.get("/memories/:id", async (req, reply) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		});
		const { id } = paramsSchema.parse(req.params);

		const memory = await prisma.memory.findUniqueOrThrow({
			where: {
				id,
			},
		});

		if (!memory.isPublic && memory.userId !== req.user.sub) {
			return reply.status(401).send();
		}

		return memory;
	});

	app.post("/memories", async (req) => {
		const bodySchema = z.object({
			content: z.string(),
			coverUrl: z.string(),
			isPublic: z.coerce.boolean().default(false),
		});

		const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

		const memory = await prisma.memory.create({
			data: {
				content,
				coverUrl,
				isPublic,
				userId: req.user.sub,
			},
		});

		return memory;
	});

	app.put("/memories", async (req, reply) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = paramsSchema.parse(req.params);

		const bodySchema = z.object({
			content: z.string(),
			coverUrl: z.string(),
			isPublic: z.coerce.boolean().default(false),
		});

		const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

		let memory = await prisma.memory.findUniqueOrThrow({
			where: {
				id,
			},
		});

		if (memory.userId !== req.user.sub) {
			return reply.status(401).send();
		}

		memory = await prisma.memory.update({
			where: { id },
			data: {
				content,
				coverUrl,
				isPublic,
			},
		});

		return memory;
	});

	app.delete("/memories", async (req, reply) => {
		const paramsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = paramsSchema.parse(req.params);

		const memory = await prisma.memory.findUniqueOrThrow({
			where: {
				id,
			},
		});

		if (memory.userId !== req.user.sub) {
			return reply.status(401).send();
		}

		await prisma.memory.delete({
			where: {
				id,
			},
		});
	});
}
