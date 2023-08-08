import request from 'supertest'
import { app } from '../app'
import { execSync } from 'node:child_process'
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'

describe('users route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const user = await request(app.server)
      .post('/users')
      .send({
        email: 'Pedro@gmail.com',
        password: '123456',
        username: 'Pedro',
      })
      .expect(201)

    const cookie = user.get('Set-Cookie')

    const response = await request(app.server)
      .post('/meals')
      .send({
        title: 'Bolo',
        description: 'Arroz',
        day: '06/08/2023',
        hour: '13:00',
        isOnTheDiet: false,
      })
      .set('Cookie', cookie)
      .expect(201)

    expect(response.status).toEqual(201)
  })
})
