import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { convertPtBrToEnUsDate } from '../utils/convertPtBrToEnUsDate'

export async function mealsRoute(app: FastifyInstance) {
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const requestBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      day: z.string(),
      hour: z.string(),
      isOnTheDiet: z.boolean(),
    })

    const { title, description, day, hour, isOnTheDiet } =
      requestBodySchema.parse(request.body)

    const ptToUsDate = convertPtBrToEnUsDate(day)

    const cookieUserId = request.cookies.daily_diet_userId

    const _formattedDate = new Date(ptToUsDate).toISOString().split('T')[0]
    const formattedDate = new Date(_formattedDate + 'T' + hour)

    if (!cookieUserId) {
      return reply.status(401).send({
        error: 'Unauthorized',
      })
    }

    await knex('meals').insert({
      title,
      description,
      time: formattedDate,
      is_on_the_diet: isOnTheDiet,
      user_id: cookieUserId,
    })

    reply.status(201).send()
  })
}
