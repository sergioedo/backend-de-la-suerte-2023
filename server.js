const express = require('express')
const emojiBackend = require('./backend')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

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
    const orderEntity = db.createEntity('🍽', ['🆔', '🕓', '🪑'])

    /**
    * @openapi
    * /menu/order:
    *   post:
    *     summary: Pide una comanda al restaurante
    *     tags: [orders]
    *     requestBody:
    *       description: Información sobre la comanda a crear
    *       content: 
    *         application/json:
    *           schema:
    *             type: object
    *             properties: 
    *               table:
    *                 type: number
    *                 description: número de la mesa que ha pedido la comanda
    *     produces: 
    *       - application/json
    *     responses:
    *       201:
    *         description: Devuelve la información de la comanda
    *         schema:
    *           type: object
    *           properties: 
    *             id:
    *               type: string
    *               description: identificador de la comanda
    *             table:
    *               type: number
    *               description: número de la mesa que ha pedido la comanda
    *             createdAt:
    *               type: string
    *               description: fecha de creación de la comanda en formato UNIX timestamp
    */
    app.post('/menu/order', jsonParser, (req, res) => {
        const { table } = req.body
        if (!Number.isInteger(table)) {
            res.status(400).send({ error: 'table field is mandatory and must be numeric' })
        } else {
            const order = orderEntity.createElement()
                .set('🆔', orderEntity.getElements().length + 1)
                .set('🪑', table)
                .set('🕓', Date.now())
            res.status(201).send({ id: order.get('🆔'), table: Number(order.get('🪑')), createdAt: order.get('🕓') })
        }
    })

    /**
    * @openapi
    * /menu/order/{orderId}:
    *   get:
    *     summary: Recupera la información de una comanda
    *     tags: [orders]
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
    *         schema:
    *           type: object
    *           properties:
    *             table:
    *               type: number
    *               description: número de la mesa que ha pedido la comanda
    *             createdAt:
    *               type: string
    *               description: fecha de creación de la comanda en formato UNIX timestamp
    *       404:
    *         description: La comanda no existe
    *         schema:
    *           type: object
    *           properties: 
    *             error:
    *               type: string
    *               description: descripción del error
    */
    app.get('/menu/order/:orderId', (req, res) => {
        const { orderId } = req.params
        const order = orderEntity.getElementsByField('🆔', orderId)
        if (order.length > 0) {
            res.status(200).send({ table: Number(order[0].get('🪑')), createdAt: order[0].get('🕓') })
        } else {
            res.status(404).send({ error: `order ${orderId} not found` })
        }
    })

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    return app
}