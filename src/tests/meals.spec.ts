import supertest from 'supertest'
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

  it('shoud be able to list all meals of a user', async () => {
    const user = await supertest(app.server)
      .post('/users')
      .send({
        email: 'Pedro@gmail.com',
        password: '123456',
        username: 'Pedro',
      })
      .expect(201)

    const cookie = user.get('Set-Cookie')

    await supertest(app.server)
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

    const response = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookie)

    expect(response.body).toEqual(
      expect.objectContaining({
        meals: [
          expect.objectContaining({
            title: 'Bolo',
            description: 'Arroz',
            is_on_the_diet: 0,
          }),
        ],
      }),
    )
  })

  it('should be able to list a specific meal of a user', async () => {
    const user = await supertest(app.server)
      .post('/users')
      .send({
        email: 'Pedro@gmail.com',
        password: '123456',
        username: 'Pedro',
      })
      .expect(201)

    const cookie = user.get('Set-Cookie')

    await supertest(app.server)
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

    const meals = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookie)

    const mealId = meals.body.meals[0].id

    const response = await supertest(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookie)

    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'Bolo',
        description: 'Arroz',
        is_on_the_diet: 0,
      }),
    )
  })

  it('should be able to list the metrics of a user', async () => {
    const user = await supertest(app.server)
      .post('/users')
      .send({
        email: 'Pedro@gmail.com',
        password: '123456',
        username: 'Pedro',
      })
      .expect(201)

    const cookie = user.get('Set-Cookie')

    await supertest(app.server)
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

    await supertest(app.server)
      .post('/meals')
      .send({
        title: 'Frango',
        description: 'Arroz',
        day: '06/08/2023',
        hour: '13:00',
        isOnTheDiet: true,
      })
      .set('Cookie', cookie)
      .expect(201)

    const response = await supertest(app.server)
      .get('/meals/summary')
      .set('Cookie', cookie)

    expect(response.body).toEqual({
      meals: 2,
      onTheDiet: 1,
      isNotOnTheDiet: 1,
    })
  })

  it('should be able to create a new meal', async () => {
    const user = await supertest(app.server)
      .post('/users')
      .send({
        email: 'Pedro@gmail.com',
        password: '123456',
        username: 'Pedro',
      })
      .expect(201)

    const cookie = user.get('Set-Cookie')

    const response = await supertest(app.server)
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

    expect(response.status).toBe(201)
  })

  it('should be able to update a meal', async () => {
    const user = await supertest(app.server)
      .post('/users')
      .send({
        email: 'Pedro@gmail.com',
        password: '123456',
        username: 'Pedro',
      })
      .expect(201)

    const cookie = user.get('Set-Cookie')

    await supertest(app.server)
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

    const meals = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookie)

    const mealId = meals.body.meals[0].id

    const response = await supertest(app.server)
      .put(`/meals/${mealId}`)
      .send({
        title: 'Frango',
        description: 'Arroz',
        day: '06/08/2023',
        hour: '13:00',
        isOnTheDiet: true,
      })
      .set('Cookie', cookie)

    expect(response.status).toBe(201)
  })

  it('should be able to delete a meal', async () => {
    const user = await supertest(app.server)
      .post('/users')
      .send({
        email: 'Pedro@gmail.com',
        password: '123456',
        username: 'Pedro',
      })
      .expect(201)

    const cookie = user.get('Set-Cookie')

    await supertest(app.server)
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

    const meals = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookie)

    const mealId = meals.body.meals[0].id

    const response = await supertest(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookie)

    expect(response.status).toBe(200)
  })
})
