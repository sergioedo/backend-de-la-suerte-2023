const request = require('supertest')
const app = require('./server')

test('Create an order with POST to /menu/order', async () => {
    const response = await request(app())
        .post('/menu/order')
        .expect('Content-Type', /json/)
        .expect(201)
    expect(response.body.createdAt).toBeDefined()
})

test('Query order and check createdAt', async () => {
    const appInstance = app()
    const createResponse = await request(appInstance)
        .post('/menu/order')
        .expect('Content-Type', /json/)
        .expect(201)
    expect(createResponse.body.id).toBeDefined()
    expect(createResponse.body.createdAt).toBeDefined()
    const { id, createdAt } = createResponse.body

    const response = await request(appInstance)
        .get(`/menu/order/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
    expect(response.body.createdAt).toBe(createdAt)
})
