const request = require('supertest')
const app = require('./server')

const createOrder = async (app) =>
    request(app)
        .post('/menu/order')
        .expect('Content-Type', /json/)
        .expect(201)

const getOrder = async (app, id) =>
    request(app)
        .get(`/menu/order/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)

test('Create an order with POST to /menu/order', async () => {
    const testTimestamp = new Date().valueOf()
    const response = await createOrder(app())

    expect(response.body.createdAt).toBeDefined()
    expect(testTimestamp).toBeLessThan(Number(response.body.createdAt))
})

test('Query order and check createdAt', async () => {
    const appInstance = app()
    //TODO: test with different instances (test persistence)
    const createResponse = await createOrder(appInstance)
    expect(createResponse.body.id).toBeDefined()
    expect(createResponse.body.createdAt).toBeDefined()

    const { id, createdAt } = createResponse.body
    const response = await getOrder(appInstance, id)
    expect(response.body.createdAt).toBe(createdAt)
})
