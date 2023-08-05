import { z } from 'zod'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const requestBodySchema = z.object({
      username: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { email, password, username } = requestBodySchema.parse(request.body)

    const userAlreadyExists = await knex('users')
      .where('email', email)
      .orWhere('username', username)
      .first()

    if (userAlreadyExists) {
      return reply.status(400).send({
        message: 'Email or username already taken.',
      })
    }

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
  })
}
