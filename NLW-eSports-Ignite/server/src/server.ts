import express from "express";
import {PrismaClient} from "@prisma/client"

const app = express();
const prisma = new PrismaClient(
    {log:['query']}
) // conexão com o banco

app.get('/games', async (req, res) => {
    const games =  await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    })
    
    return res.json(games);
})

app.get('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;

    const ads = await prisma.ad.findMany({
        where: {
            gameId,
        }
    })
    
    return res.status(201).json(ads);
})

app.get('/ads/:id/discord', (req, res) => {
    // const adsId = req.params.id;
    
    return res.json([])
})

app.listen(3333) 

/* 
Tipos de parâmetros

Query 
parâmetro que vem depois do ?, usados quando se precisa persistir estado 
ou seja o estado atual que aquela pagina se encontra naquele momento, filtros, ordenação
EX: localhost://ads?page=2&sort=title

Route
parâmetro de identificação de um recurso um id algo que identifique algo na nossa API
EX: localhost://ads/5

Body 
é usado para enviar varias informações em uma única requisição, geralmente um envio de formulário
*/