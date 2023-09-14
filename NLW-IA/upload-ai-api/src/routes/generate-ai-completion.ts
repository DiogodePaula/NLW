import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { openAi } from "../lib/openai";

export async function generateAiCompletionRoute(app: FastifyInstance) {
	app.post("/ai/generate", async (req, reply) => {
		const paramsSchema = z.object({
			videoId: z.string().uuid(),
			template: z.string(),
			temperature: z.number().min(0).max(1).default(0.5),
		});

		const { videoId, template, temperature } = paramsSchema.parse(req.body);

		const video = await prisma.video.findUniqueOrThrow({
			where: {
				id: videoId,
			},
		});

		if (!video.transcription) {
			return reply.status(400).send({ error: "Video transcription was not generated yet" });
		}

		const promptMessage = template.replace("{transcription}", video.transcription);

		const response = await openAi.chat.completions.create({
			model: "gpt-3.5-turbo-16k", // aceita 16k de token, Tokenizer para calcular valores
			temperature,
			messages: [{ role: "user", content: promptMessage }],
		});

		return response;
	});
}
