import supertest from 'supertest'
import pool from '../database'
import { app, server } from '../index'
import { v4 as uuidv4 } from 'uuid'

const api = supertest(app)

const task = {
  name: 'task one',
  detail: 'morning'
}

beforeEach(async () => {
  await api.delete('/api/')
  const response = await api.post('/api/').send(task).expect(201)
  task.id = response.body[0].id
})

describe('POST create a task', () => {
  test('with valid information', async () => {
    await api
      .post('/api/')
      .send(task)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('with invalid information', async () => {
    const response = await api
      .post('/api/')
      .send({ name: '' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe('Invalid Information')
  })

  test('without body', async () => {
    const response = await api
      .post('/api/')
      .send()
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe('Invalid Information')
  })
})

describe('GET a task', () => {
  test('by id and returned it as JSON', async () => {
    await api
      .get('/api/' + task.id)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('by id and check the field detail', async () => {
    const response = await api
      .get('/api/' + task.id)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const details = response.body.map((task) => task.detail)
    expect(details).toContain(task.detail)
  })

  test('by id with an invalid id', async () => {
    const response = await api
      .get('/api/' + uuidv4())
      .expect(404)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(0)
  })
})

describe('GET all tasks', () => {
  test('and check if it is an array', async () => {
    const response = await api
      .get('/api/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(Array.isArray(response.body)).toBe(true)
  })
  test('and check if its length is greater than zero', async () => {
    const response = await api
      .get('/api/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.length > 0).toBe(true)
  })

  test('and check the field detail', async () => {
    const response = await api
      .get('/api/' + task.id)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const details = response.body.map((task) => task.detail)
    expect(details).toContain(task.detail)
  })
})

describe('PUT update a task', () => {
  test('with valid information', async () => {
    await api
      .put('/api/')
      .send(task)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('with invalid information', async () => {
    const response = await api.put('/api/').send({ name: '' })
    expect(400)
    expect(response.body.message).toBe('Invalid Information')
  })

  test('without body', async () => {
    const response = await api.put('/api/').send().expect(400)
    expect(response.body.message).toBe('Invalid Information')
  })
})

describe('DELETE a task', () => {
  test('by id, with a valid id', async () => {
    await api
      .delete('/api/' + task.id)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('by id, with an invalid id', async () => {
    await api
      .delete('/api/' + uuidv4())
      .expect(404)
      .expect('Content-Type', /application\/json/)
  })
})

describe('DELETE all tasks', () => {
  test('and check if rowCount is a number', async () => {
    const response = await api
      .delete('/api/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(typeof response.body.rowCount).toBe('number')
  })
})

afterAll(() => {
  pool.end()
  server.close()
})
