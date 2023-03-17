const express = require('express')
const emojiBackend = require('./backend')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Zombies Restaurant 🍽🧟',
            version: '1.0.0',
        },
    },
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(options)

module.exports = () => {
    const app = express()
    const db = emojiBackend.createEmojiDB('👨‍🍳', true)
    const orderEntity = db.createEntity('🍽', ['🆔', '🕓'])

    /**
    * @openapi
    * /menu/order:
    *   post:
    *     summary: Pide una comanda al restaurante
    *     produces: 
    *       - application/json
    *     responses:
    *       201:
    *         description: Devuelve la información de la comanda
    */
    app.post('/menu/order', (req, res) => {
        const order = orderEntity.createElement()
            .set('🆔', orderEntity.getElements().length + 1)
            .set('🕓', Date.now())
        res.status(201).send({ id: order.get('🆔'), createdAt: order.get('🕓') })
    })

    /**
    * @openapi
    * /menu/order/{orderId}:
    *   get:
    *     summary: Recupera la información de una comanda
    *     produces: 
    *       - application/json
    *     parameters:
    *       - in: path
    *         name: orderId
    *         type: string
    *         required: true
    *         description: Identificador de la comanda
    *     responses:
    *       200:
    *         description: Devuelve la información de la comanda
    */
    app.get('/menu/order/:orderId', (req, res) => {
        const orderId = req.param('orderId')
        const order = orderEntity.getElementsByField('🆔', orderId)
        if (order.length > 0) {
            res.status(200).send({ createdAt: order[0].get('🕓') })
        } else {
            res.status(404).send({ error: `order ${orderId} not found` })
        }
    })

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    return app
}