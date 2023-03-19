const request = require('supertest')
const app = require('./server')

const createOrder = async (app, order) =>
    request(app)
        .post('/menu/order')
        .send(order)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)

const getOrder = async (app, id) =>
    request(app)
        .get(`/menu/order/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)

const getOrders = async (app) =>
    request(app)
        .get(`/menu/orders`)
        .expect('Content-Type', /json/)
        .expect(200)

const testOrder = {
    table: 13,
    dishes: [
        {
            name: 'bocata de calamares',
            quantity: 2
        },
        {
            name: 'hamburguesa con queso',
            quantity: 1
        },
        {
            name: 'pescado al horno',
            quantity: 1
        }
    ]
}

test('Create an order with POST to /menu/order', async () => {
    const testTimestamp = new Date().valueOf()
    const response = await createOrder(app(), testOrder)

    expect(response.body.table).toBe(testOrder.table)
    expect(response.body.dishes.length).toBe(testOrder.dishes.length)
    testOrder.dishes.map(dish => expect(response.body.dishes.filter(d => d.name === dish.name).length).toBe(1))
    expect(response.body.createdAt).toBeDefined()
    expect(testTimestamp).toBeLessThan(Number(response.body.createdAt))
})

test('Query order and check fields', async () => {
    const appInstance = app()
    //TODO: test with different instances (test persistence)
    const createResponse = await createOrder(appInstance, testOrder)
    expect(createResponse.body.id).toBeDefined()
    expect(createResponse.body.createdAt).toBeDefined()

    const { id, createdAt } = createResponse.body
    const response = await getOrder(appInstance, id)
    expect(response.body.table).toBe(testOrder.table)
    expect(response.body.dishes.length).toBe(testOrder.dishes.length)
    expect(response.body.createdAt).toBe(createdAt)
})

test('Query order list with /menu/orders', async () => {
    const appInstance = app()
    const response1 = await createOrder(appInstance, testOrder)
    const response2 = await createOrder(appInstance, testOrder)
    const response3 = await createOrder(appInstance, testOrder)

    const expectedOrdersIdList = []
    expectedOrdersIdList.push(response1.body.id)
    expectedOrdersIdList.push(response2.body.id)
    expectedOrdersIdList.push(response3.body.id)

    const { body: orders } = await getOrders(appInstance)
    const ordersIdList = orders.map(order => order.id)
    expect(JSON.stringify(expectedOrdersIdList)).toBe(JSON.stringify(ordersIdList))
})
