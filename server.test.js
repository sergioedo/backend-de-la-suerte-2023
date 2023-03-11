const request = require('supertest')
const app = require('./server')()

test('Create an order with POST to /menu/order', async () => {
    const response = await request(app)
        .post('/menu/order')
        .expect('Content-Type', /json/)
        .expect(201)
    expect(response.body.createdAt).toBeDefined()
})
