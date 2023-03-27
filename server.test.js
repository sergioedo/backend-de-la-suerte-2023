const request = require('supertest')
const app = require('./server')

const createOrder = async (app, order, expectedStatus = 201) =>
    request(app)
        .post('/menu/order')
        .send(order)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(expectedStatus)

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

const deleteOrders = async (app) =>
    request(app)
        .del(`/menu/orders`)
        .expect('Content-Type', /json/)
        .expect(200)

const deleteDispatchedOrders = async (app) =>
    request(app)
        .del(`/menu/orders/dispatched`)
        .expect('Content-Type', /json/)
        .expect(200)

const getDishes = async (app) =>
    request(app)
        .get('/menu/dishes')
        .expect('Content-Type', /json/)
        .expect(200)

const dispatchOrder = async (app) =>
    request(app)
        .patch('/menu/orders/dispatch')
        .send()
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

const getDispatchedOrders = async (app) =>
    request(app)
        .get(`/menu/orders/dispatched`)
        .expect('Content-Type', /json/)
        .expect(200)

const modifyOrder = async (app, orderId, order) =>
    request(app)
        .put(`/menu/order/${orderId}`)
        .send(order)
        .expect('Content-Type', /json/)
        .expect(200)

const testOrder = {
    table: 13,
    dishes: [
        {
            name: '🥗🥝',
            quantity: 2
        },
        {
            name: '🍔',
            quantity: 1
        },
        {
            name: '🍤',
            quantity: 1
        }
    ]
}

beforeEach(async () => {
    // Clears the database before each test
    await deleteOrders(app())
    await deleteDispatchedOrders(app())
})

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
    const createResponse = await createOrder(app(), testOrder)
    expect(createResponse.body.id).toBeDefined()
    expect(createResponse.body.createdAt).toBeDefined()

    const { id, createdAt } = createResponse.body
    const response = await getOrder(app(), id)
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

test('Exceed maximum number of orders', async () => {
    const MAX_ORDERS = 2
    const appInstance = app(MAX_ORDERS)
    await createOrder(appInstance, testOrder)
    await createOrder(appInstance, testOrder)
    await createOrder(appInstance, testOrder, 500) //too many orders request
})

test('Process orders', async () => {
    const appInstance = app()
    await createOrder(appInstance, testOrder)
    await createOrder(appInstance, testOrder)
    await createOrder(appInstance, testOrder)

    const { body: orders } = await getOrders(appInstance)
    expect(orders.length).toBe(3)

    await deleteOrders(appInstance)

    const { body: ordersDelete } = await getOrders(appInstance)
    expect(ordersDelete.length).toBe(0)
})

test('Get dishes with name and special zombie information', async () => {
    const appInstance = app()
    const { body: dishes } = await getDishes(appInstance)
    dishes.map(dish => {
        expect(dish.name).toBeDefined()
        expect(dish.special).toBeDefined()
    })
})

test('Order with special zombie dish goes first on the list', async () => {
    const appInstance = app()
    const { body: dishes } = await getDishes(appInstance)

    await createOrder(appInstance, testOrder)
    await createOrder(appInstance, testOrder)
    const { body: zombieCreatedOrder } = await createOrder(appInstance, {
        table: 666,
        dishes: [{
            name: dishes.filter(dish => dish.special)[0].name,
            quantity: 3
        }]
    })

    const { body: orders } = await getOrders(appInstance)
    expect(orders.length).toBe(3)
    expect(orders[0].id).toBe(zombieCreatedOrder.id)
})

const getOrderId = (order => order.id)

test('Dispatch next order', async () => {
    const appInstance = app()
    const { body: order } = await createOrder(appInstance, testOrder)
    const orderId = order.id

    const { body: orders } = await getOrders(appInstance)
    expect(orders[0].id).toBe(orderId)

    const { body: dispatchedOrder } = await dispatchOrder(appInstance)
    const { dispatchedAt } = dispatchedOrder
    expect(dispatchedAt).toBeDefined()

    const { body: ordersAfterDispatch } = await getOrders(appInstance)
    expect(ordersAfterDispatch.map(getOrderId)).not.toContain(orderId)

    const { body: dispatchedOrders } = await getDispatchedOrders(appInstance)
    expect(dispatchedOrders.map(getOrderId)).toContain(orderId)
    const { dispatchedAt: dispatchedAtAfter } = dispatchedOrders.filter(order => order.id === orderId)[0]
    expect(dispatchedAt).toBe(dispatchedAtAfter)
})

test('Create an order with zombie troll action', async () => {
    const appInstance = app()
    const { body: order } = await createOrder(appInstance, testOrder)
    const { id: orderId, createdAt } = order

    const trollDate = new Date(createdAt + (24 * 60 * 60 * 1000)).getTime()
    const { body: modifiedOrder } = await modifyOrder(appInstance, orderId, { createdAt: trollDate })
    expect(trollDate).toBe(modifiedOrder.createdAt)

    const { body: orderAfterTroll } = await getOrder(appInstance, orderId)

    expect(orderAfterTroll.createdAt).toBe(modifiedOrder.createdAt)
})