import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { convertPtBrToEnUsDate } from '../utils/convertPtBrToEnUsDate'
import { userIdCookieExists } from '../middlewares/user-id-cookie-exists'

export async function mealsRoute(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [userIdCookieExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
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

      await knex('meals').insert({
        title,
        description,
        time: formattedDate,
        is_on_the_diet: isOnTheDiet,
        user_id: cookieUserId,
      })

      reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    { preHandler: [userIdCookieExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const requestParamsSchema = z.object({
        id: z.string(),
      })

      const { id } = requestParamsSchema.parse(request.params)

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

      await knex('meals')
        .where('id', id)
        .andWhere('user_id', cookieUserId)
        .update({
          title,
          description,
          is_on_the_diet: isOnTheDiet,
          time: formattedDate,
        })

      reply.status(201).send()
    },
  )
}
