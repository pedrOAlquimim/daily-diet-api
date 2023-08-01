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

    await knex('users').insert({
      email,
      password,
      username,
    })

    reply.status(201).send()
  })
}
