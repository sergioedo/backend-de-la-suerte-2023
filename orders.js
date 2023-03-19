const emojiBackend = require('./backend')

module.exports = () => {
    const db = emojiBackend.createEmojiDB('👨‍🍳', true)
    const orderEntity = db.createEntity('📑', ['🆔', '🕓', '🪑'])
    const orderDishesEntity = db.createEntity('🗒', ['📑', '🍽', '🔢'])

    return {
        createOrder: (table, dishes) => {
            const orderId = orderEntity.getElements().length + 1
            const orderElement = orderEntity.createElement()
                .set('🆔', orderId)
                .set('🪑', table)
                .set('🕓', Date.now())
            const orderDishes = dishes.map(({ name, quantity }) => {
                return orderDishesEntity.createElement()
                    .set('📑', orderId)
                    .set('🍽', name)
                    .set('🔢', quantity)
            }).map(orderElement => {
                return {
                    name: orderElement.get('🍽'),
                    quantity: Number(orderElement.get('🔢'))
                }
            })
            return {
                id: orderElement.get('🆔'),
                table: Number(orderElement.get('🪑')),
                dishes: orderDishes,
                createdAt: orderElement.get('🕓')
            }
        },
        getOrder: (orderId) => {
            const order = orderEntity.getElementsByField('🆔', orderId)
            const orderDishes = orderDishesEntity.getElementsByField('📑', orderId).map(orderElement => {
                return {
                    name: orderElement.get('🍽'),
                    quantity: Number(orderElement.get('🔢'))
                }
            })
            if (order.length === 0) {
                throw Error(`order ${orderId} not found`)
            }
            return {
                id: order[0].get('🆔'),
                table: Number(order[0].get('🪑')),
                dishes: orderDishes,
                createdAt: order[0].get('🕓')
            }
        },
        getOrders: () => {
            const responseOrders = []
            orderEntity.getElements().map(order => {
                const orderId = order.get('🆔')
                const orderDishes = orderDishesEntity.getElementsByField('📑', orderId).map(orderElement => {
                    return {
                        name: orderElement.get('🍽'),
                        quantity: Number(orderElement.get('🔢'))
                    }
                })
                responseOrders.push({
                    id: orderId,
                    table: Number(order.get('🪑')),
                    dishes: orderDishes,
                    createdAt: order.get('🕓')
                })
            })
            return responseOrders
        }
    }
}