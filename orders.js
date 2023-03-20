const emojiBackend = require('./backend')

const orderDishesElementToJSON = orderDishElement => {
    return {
        name: orderDishElement.get('🍽'),
        quantity: Number(orderDishElement.get('🔢'))
    }
}

module.exports = (MAX_ORDERS = 5) => {
    const db = emojiBackend.createEmojiDB('👨‍🍳', true)
    const orderEntity = db.createEntity('📑', ['🆔', '🕓', '🪑'])
    const orderDishesEntity = db.createEntity('🗒', ['📑', '🍽', '🔢'])

    const getOrderByElement = (orderElement) => {
        const orderId = orderElement.get('🆔')
        const orderDishes = orderDishesEntity.getElementsByField('📑', orderId).map(orderDishesElementToJSON)
        return {
            id: orderId,
            table: Number(orderElement.get('🪑')),
            dishes: orderDishes,
            createdAt: orderElement.get('🕓')
        }
    }

    return {
        createOrder: (table, dishes) => {
            if (orderEntity.getElements().length >= MAX_ORDERS) {
                throw Error(`Maximum number of orders exceeded (max. ${MAX_ORDERS} orders)`)
            }
            const orderId = orderEntity.getElements().length + 1
            const orderElement = orderEntity.createElement()
                .set('🆔', orderId)
                .set('🪑', table)
                .set('🕓', Date.now())
            dishes.map(({ name, quantity }) => {
                return orderDishesEntity.createElement()
                    .set('📑', orderId)
                    .set('🍽', name)
                    .set('🔢', quantity)
            })
            return getOrderByElement(orderElement)
        },
        getOrder: (orderId) => {
            const order = orderEntity.getElementsByField('🆔', orderId)
            if (order.length === 0) {
                throw Error(`order ${orderId} not found`)
            }
            return getOrderByElement(order[0])
        },
        getOrders: () => {
            return orderEntity.getElements().map(getOrderByElement)
        }
    }
}