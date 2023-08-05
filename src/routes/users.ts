import { z } from 'zod'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { checkIfUserAlreadyExists } from '../middlewares/check-if-user-already-exists'

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkIfUserAlreadyExists] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const requestBodySchema = z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
      })

      const { email, password, username } = requestBodySchema.parse(
        request.body,
      )

      await knex('users').insert({
        email,
        password,
        username,
      })

      const user = await knex('users')
        .where('email', email)
        .orWhere('username', username)
        .first()

      if (!user?.id) {
        return null
      }

      reply
        .cookie('daily_diet_userId', user.id, {
          path: '/',
        })
        .status(201)
        .send()
    },
  )
}
