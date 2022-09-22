import express from "express";
import cors from 'cors';

import { PrismaClient } from "@prisma/client";
import { converte } from "./utils/convert-hours-string-to-minutes";
import { converteMinToHours } from "./utils/convert-minutes-to-string-hours";

const app = express();
app.use(express.json());
app.use(cors({
    // origin: 'https://dominio-que-pode-acessar-o-back-end'
}))

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

app.post('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;
    const body: any = req.body;
    // biblioteca para validação zod javascript
    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: converte(body.hourStart),
            houtEnd: converte(body.houtEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    })
    
    return res.status(201).json(ad);
})

app.get('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            houtEnd: true,            
        },
        where: {
            gameId,
        }, 
        orderBy: {
            createdAt: 'desc'
        }
    })
    
    return res.status(201).json(ads.map(ad => {
        return {
            // um literal de objeto, a sintaxe de propagação enumera as propriedades 
            // de um objeto e adiciona os pares chave-valor ao objeto que está sendo criado.
            ...ad, //spread operator
            weekDays: ad.weekDays.split(','),
            hourStart: converteMinToHours(ad.hourStart),
            houtEnd: converteMinToHours(ad.houtEnd)
        }
    }));
})

app.get('/ads/:id/discord', async (req, res) => {
    const adId = req.params.id;
    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId
        }
    })
    
    return res.json({
        discord: ad.discord
    })
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