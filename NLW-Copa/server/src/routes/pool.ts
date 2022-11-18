import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import ShortUniqueId from 'short-unique-id'
import { z } from 'zod'
import { authenticate } from "../plugins/authenticate"

export async function poolRoutes(fastify: FastifyInstance){
    fastify.get('/pools/count', async () => {
        const count = await prisma.pool.count()
            
        // const pools = await prisma.pool.findMany({
        //     where: {
        //         code: {
        //             //pega dados que iniciam com D
        //             startsWith: 'D'
        //         }
        //     }
        // })

        return { count }
    })

    fastify.post('/pools', async (req, res) => {
        const createPoolBody = z.object({
            title: z.string(),
        })
        // zod integra muito bem com typescript
        const { title } = createPoolBody.parse(req.body)              
        const generate = new ShortUniqueId({ length: 6 })
        const code = String(generate()).toUpperCase()

        try {
            await req.jwtVerify()
            // se chegar aqui tem um usuário autenticado
            await prisma.pool.create({
                data: {
                    title,
                    code,
                    ownerId: req.user.sub, // id do usuário que está dentro do token

                    // prisma ja permite criar esse participante ja que ele tem uma relação 
                    // com a tabela de participantes no momento de criação do bolão
                    participants: {
                        create: {
                            userId: req.user.sub,
                        }
                    }
                }
            })

        } catch {
            await prisma.pool.create({
                data: {
                    title,
                    code,
                }
            })
        }        

        return res.status(201).send({ code })
    })

    // :id informação dinâmica 
    fastify.post('/pools/join',{ onRequest: [ authenticate ] }, async (req, reply) => {
        const joinPoolBody = z.object({
            code: z.string(),
        })

        const { code } = joinPoolBody.parse(req.body)

        const pool = await prisma.pool.findUnique({
            where: {
                code,
            },
            // faz o papel de JOIN do SQL   
            include: {
                participants: {
                    // vai buscar uma lista de participantes em que apenas o id seja 
                    // igual ao do usuário logado 
                    where: {
                        userId: req.user.sub,
                    }
                }
            }
        })

        if(!pool){
            return reply.status(400).send({
                message: 'Pool not found.'
            })
        }

        if(pool.participants.length > 0){
            return reply.status(400).send({
                message: 'You already joined this pool.'
            })
        }

        if(!pool.ownerId){
            // se o bolão não ter dono o primeiro a entrar nele será o dono
            // esse solução teve de ser utilizada pq na web não tem login com o google ainda
            await prisma.pool.update({
                where: {
                    id: pool.id,
                },
                data: {
                    ownerId: req.user.sub,
                }
            })
        }

        await prisma .participant.create({
            data: {
                poolId: pool.id,
                userId: req.user.sub,
            }
        })

        return reply.status(201).send()
    })

    fastify.get('/pools', { onRequest: [ authenticate ] }, async (req) => {
        const pools = await prisma.pool.findMany({
            where: {
                participants: {
                    some: {
                        userId: req.user.sub,
                    }
                }
            },
            include: {
                // traz total de participantes do bolão
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    },
                    take: 4,
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        })

        return { pools }
    })

    fastify.get('/pools/:id', { onRequest: [ authenticate ] }, async (req, reply) =>{
        const getPoolParams = z.object({
            id: z.string(),
        })

        const { id } = getPoolParams.parse(req.params)

        const pool = await prisma.pool.findUnique({
            where: {
                id
            },
            include: {
                // traz total de participantes do bolão
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    },
                    take: 4,
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        })

        return { pool }
    })

    fastify.get('/poolss/:poolId', { onRequest: [ authenticate ] }, async (req, reply) =>{
        const getPoolParams = z.object({
            poolId: z.string(),
        })

        const { poolId } = getPoolParams.parse(req.params)

        const pool = await prisma.pool.findFirst({
            include: {
                // traz total de participantes do bolão
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    },
                    take: 4,
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            where: {
                id: poolId,
                participants: {
                    some: {
                        userId: req.user.sub,
                    }
                }
            },
            
        });

        if(!pool){
            return reply.status(400).send({
                message: "Pool not found"
            })
        }

        return { pool }
    })
}