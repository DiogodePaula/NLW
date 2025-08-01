import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify: FastifyInstance) {
	fastify.get("/pools/:id/games", { onRequest: [authenticate] }, async (req) => {
		const getPoolParams = z.object({
			id: z.string(),
		});

		const { id } = getPoolParams.parse(req.params);

		const games = await prisma.game.findMany({
			orderBy: {
				date: "desc",
			},
			include: {
				guesses: {
					where: {
						participant: {
							userId: req.user.sub,
							poolId: id,
						},
					},
				},
			},
		});

		return {
			games: games.map((game: any) => {
				return {
					...game,
					guess: game.guesses.length > 0 ? game.guesses[0] : null,
					guesses: undefined,
				};
			}),
		};
	});
}
