const express = require('express')
const emojiBackend = require('./backend')

module.exports = () => {
    const app = express()
    const db = emojiBackend.createEmojiDB('👨‍🍳')
    const orderEntity = db.createEntity('🍽', ['🆔', '🕓'])

    app.post('/menu/order', (req, res) => {
        const order = orderEntity.createElement()
            .set('🆔', orderEntity.getElements().length + 1)
            .set('🕓', Date.now())
        res.status(201).send({ id: order.get('🆔'), createdAt: order.get('🕓') })
    })

    app.get('/menu/order/:orderId', (req, res) => {
        const orderId = req.param('orderId')
        const order = orderEntity.getElementsByField('🆔', orderId)
        if (order.length > 0) {
            res.status(200).send({ createdAt: order[0].get('🕓') })
        } else {
            res.status(404).send({ error: `order ${orderId} not found` })
        }
    })
    return app
}