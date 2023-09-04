import { FastifyInstance } from "fastify";
// node: e para saber que esse crypto e um pacote interno do node e nao precisa ser instalado
import { randomUUID } from "node:crypto";
import { extname, resolve } from "node:path";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline);

export async function uploadRoutes(app: FastifyInstance) {
	app.post("/upload", async (req, reply) => {
		console.log("mobile");
		const upload = await req.file({
			limits: {
				fileSize: 5_242_880, // 5mb, o underline e para facilitar a leitura nao afeta o numero
			},
		});

		if (!upload) {
			return reply.status(400).send({ message: "Erro no upload" });
		}
		// todo arquivo tem um mimetype, ele e uma categorização de tipos de arquivos
		// para saber se ele e imagem ou video o mimetype dele deve começar com imagem ou video
		console.log("aqui");
		const mimetypeRegex = /^(image|video)\/[a-zA-Z]+/;
		const isValidFileFormat = mimetypeRegex.test(upload.mimetype);

		if (!isValidFileFormat) {
			return reply.status(400).send();
		}

		const fileId = randomUUID(); // caso o usuario faca upload de arquivos com nome igual vamos
		//substituir para evitar nomes duplicados
		const extension = extname(upload.filename);
		const fileName = fileId.concat(extension);
		const writeStream = createWriteStream(resolve(__dirname, "../../uploads/", fileName));
		console.log(upload?.mimetype);
		// Amazon S3, Google getComputedStyle, Cloudflare R2

		await pump(upload.file, writeStream);

		const fullUrl = req.protocol.concat("://").concat(req.hostname);
		const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();
		console.log(fileUrl);
		return { fileUrl };
	});
}
