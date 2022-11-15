import '@fastify/jwt'

// .d.ts é um arquivo que vai conter somente definição de tipos de typescript

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            sub: string;
            name: string;
            avatarUrl: string;
        }
    }
}

// DOCUMENTAÇÃO fastify/fastify-jwt
// buscar por typescript