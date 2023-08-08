import request from 'supertest'
import { app } from '../app'
import { execSync } from 'node:child_process'
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'

describe('meals route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a new user', async () => {
    const response = await request(app.server).post('/users').send({
      email: 'Pedro@gmail.com',
      password: '123456',
      username: 'Pedro',
    })

    expect(response.status).toEqual(201)
  })
})
