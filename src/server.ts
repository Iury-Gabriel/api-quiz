import fastifyCors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import fastify from "fastify";

const app = fastify();

const prisma = new PrismaClient();

app.register(fastifyCors, {
    origin: '*'
})

interface Ranking {
    name: string
    score: number
}

app.get('/ping', (request, reply) => {
    return reply.send({pong: true})
})

app.post('/ranking', async (request, reply) => {
    const { name, score } = request.body as Ranking
    
    if (!name || !score) {
        return reply.status(400).send({ error: 'Name and score are required' });
    }

    const existingRanking = await prisma.ranking.findUnique({
        where: {
            name: name
        }
    });

    if (existingRanking) {
        const updatedRanking = await prisma.ranking.update({
            where: {
                id: existingRanking.id
            },
            data: {
                score: score
            }
        });

        return reply.status(200).send({ message: 'Score updated successfully', ranking: updatedRanking });
    } else {
        const newRanking = await prisma.ranking.create({
            data: {
                name,
                score
            }
        });

        return reply.status(201).send({ message: 'New ranking entry created', ranking: newRanking });
    }
});


app.get('/ranking', async (request, reply) => {
    const ranking = await prisma.ranking.findMany({
        orderBy: {
            score: 'desc'
        }
    })

    return reply.send({ ranking })
})

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('HTTP server running')
})