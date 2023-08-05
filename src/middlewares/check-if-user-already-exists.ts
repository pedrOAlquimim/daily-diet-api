import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function checkIfUserAlreadyExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    username: z.string(),
    email: z.string(),
  })

  const { email, username } = requestBodySchema.parse(request.body)

  const userAlreadyExists = await knex('users')
    .where('email', email)
    .orWhere('username', username)
    .first()

  if (userAlreadyExists) {
    return reply.status(400).send({
      message: 'Email or username already taken.',
    })
  }
}
