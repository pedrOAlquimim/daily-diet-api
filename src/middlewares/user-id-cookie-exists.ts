import { FastifyReply, FastifyRequest } from 'fastify'

export async function userIdCookieExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const cookieUserId = request.cookies.daily_diet_userId

  if (!cookieUserId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
