import Fastify from 'fastify'
import cors from '@fastify/cors' 
import jwt from '@fastify/jwt'

import { poolRoutes } from './routes/pool'
import { authRoutes } from './routes/auth'
import { gameRoutes } from './routes/game'
import { guessRoutes } from './routes/guess'
import { userRoutes } from './routes/user'

async function bootstrap() {
    const fastify = Fastify({
        logger: true, 
    })

    await fastify.register(cors, {
        origin: true,
    })

    // EM PRODUÇÃO ISSO PRECISA SER UMA VARIÁVEL DE AMBIENTE
    await fastify.register(jwt, {
        secret: 'nlw-copa'
    })

    await fastify.register(authRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(poolRoutes)
    await fastify.register(userRoutes)

    await fastify.listen({ port: 3333, host: '0.0.0.0' });
}

bootstrap();

// host: '0.0.0.0' deve ser adicionado em ambiente de desenvolvimento devido ao 
// espelhamento interno quer o android faz 