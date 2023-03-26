const emojiBackend = require('./backend')

const orderDishesElementToJSON = orderDishElement => {
    return {
        name: orderDishElement.get('🍽'),
        quantity: Number(orderDishElement.get('🔢'))
    }
}

const dishElementToJSON = dishElement => ({ name: dishElement.get('🍽'), special: dishElement.get('🧟') === '✅' })

const menuDishes = [
    { '🍽': '🥗🍤🥑', '🧟': '❌' }, // Ensalada de langosta con aguacate y vinagreta de cítricos
    { '🍽': '🍜🧄🧀🍞', '🧟': '❌' }, // Sopa de cebolla gratinada con queso gruyere y tostadas de pan
    { '🍽': '🥘🍤🍲', '🧟': '❌' }, // Paella de mariscos con arroz caldoso y alioli de azafrán
    { '🍽': '🥞🍆🥫🧀', '🧟': '❌' }, // Lasaña de berenjena con salsa boloñesa y queso ricotta
    { '🍽': '💪🔥🥔🩸', '🧟': '✅' }, // Brazo humano a la brasa con puré de patatas sangrado
    { '🍽': '🥩🍳🍞', '🧟': '❌' }, // Steak tartare con huevo de codorniz y tostadas de pan casero
    { '🍽': '🐟🔥🥗🍠🍊', '🧟': '❌' }, // Salmón a la parrilla con ensalada de remolacha y vinagreta de naranja
    { '🍽': '🥩🍷👁', '🧟': '✅' }, // Filete mignon crudo con salsa de vino tinto y puré de ojos trufado
    { '🍽': '🥓🩸🧠🏏💅', '🧟': '✅' }, // Intestinos asados con plasma de sangre acompañados con puré de seso bateado con "Lucille" y crujiente de uñas rotas
    { '🍽': '🥧🍫🍨🍓', '🧟': '❌' }, // Soufflé de chocolate con helado de vainilla y salsa de frutos rojos
    { '🍽': '🥮🦵🩸👂', '🧟': '✅' } // Pastel con masa de pierna humana, relleno de orejas sangrientas
]

module.exports = (MAX_ORDERS = 5) => {
    let db = emojiBackend.readEmojiDB('👨‍🍳')
    if (db === null) { //Init DB schema, if not exists
        db = emojiBackend.createEmojiDB('👨‍🍳')
        db.createEntity('📑', ['🆔', '🕓', '🪑']) // orderEntity
        db.createEntity('📜', ['🆔', '🕓', '🛎', '🪑']) // disptachedOrderEntity
        db.createEntity('🗒', ['📑', '🍽', '🔢']) // orderDishesEntity
        const dishesEntity = db.createEntity('🍴', ['🍽', '🧟'])
        menuDishes.map(dish => dishesEntity.createElement().set('🍽', dish['🍽']).set('🧟', dish['🧟']))
    }
    const orderEntity = db.getEntityById('📑')
    const dispatchedOrderEntity = db.getEntityById('📜')
    const orderDishesEntity = db.getEntityById('🗒')
    const dishesEntity = db.getEntityById('🍴')

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

    const getDispatchedOrderByElement = (orderElement) => {
        return {
            ...getOrderByElement(orderElement),
            dispatchedAt: orderElement.get('🛎')
        }
    }

    return {
        createOrder: (table, dishes) => {
            if (orderEntity.getElements().length >= MAX_ORDERS) {
                throw Error(`Maximum number of orders exceeded (max. ${MAX_ORDERS} orders)`)
            }
            const orderId = orderEntity.getElements().length + 1
            const specialDishesNames = dishesEntity.getElements().map(dishElementToJSON).filter(dish => dish.special).map(dish => dish.name)
            const isSpecialOrder = dishes.filter(dish => specialDishesNames.includes(dish.name)).length > 0
            const orderElement = orderEntity.createElement(isSpecialOrder)
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
            const order = orderEntity.getElementsByField('🆔', Number(orderId))
            if (order.length === 0) {
                throw Error(`order ${orderId} not found`)
            }
            return getOrderByElement(order[0])
        },
        getOrders: () => {
            return orderEntity.getElements().map(getOrderByElement)
        },
        getDispatchedOrders: () => {
            return dispatchedOrderEntity.getElements().map(getDispatchedOrderByElement)
        },
        dispatchOrder: () => {
            const deletedElement = orderEntity.removeFirstElement()
            const dispatchedOrder = dispatchedOrderEntity.createElement()
                .set('🆔', deletedElement.get('🆔'))
                .set('🪑', deletedElement.get('🪑'))
                .set('🕓', deletedElement.get('🕓'))
                .set('🛎', Date.now())
            return getDispatchedOrderByElement(dispatchedOrder)
        },
        deleteOrders: () => {
            orderDishesEntity.removeElements()
            return orderEntity.removeElements()
        },
        deleteDispatchedOrders: () => {
            return dispatchedOrderEntity.removeElements()
        },
        getDishes: () => {
            return dishesEntity.getElements().map(dishElementToJSON)
        }
    }
}