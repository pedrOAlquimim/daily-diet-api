import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { convertPtBrToEnUsDate } from '../utils/convertPtBrToEnUsDate'
import { userIdCookieExists } from '../middlewares/user-id-cookie-exists'

export async function mealsRoute(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [userIdCookieExists] },
    async (request: FastifyRequest) => {
      const cookieUserId = request.cookies.daily_diet_userId

      const meals = await knex('meals')
        .select('*')
        .where('user_id', cookieUserId)

      return { meals }
    },
  )

  app.get(
    '/:id',
    { preHandler: [userIdCookieExists] },
    async (request: FastifyRequest) => {
      const requestParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = requestParamsSchema.parse(request.params)

      const cookieUserId = request.cookies.daily_diet_userId

      const meal = await knex('meals')
        .select('*')
        .where('user_id', cookieUserId)
        .andWhere('id', id)
        .first()

      return meal
    },
  )

  app.get(
    '/summary',
    { preHandler: [userIdCookieExists] },
    async (request: FastifyRequest) => {
      const cookieUserId = request.cookies.daily_diet_userId

      const meals = await knex('meals')
        .select('*')
        .where('user_id', cookieUserId)

      return meals.length
    },
  )

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
        id: z.string().uuid(),
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

  app.delete(
    '/:id',
    { preHandler: [userIdCookieExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const requestParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = requestParamsSchema.parse(request.params)

      const cookieUserId = request.cookies.daily_diet_userId

      const user = await knex('users').select('*').where('id', cookieUserId)

      if (!user) {
        return reply.status(401).send({
          error: 'Unauthorized',
        })
      }

      await knex('meals')
        .delete('*')
        .where('id', id)
        .andWhere('user_id', cookieUserId)

      reply.status(200).send()
    },
  )
}
