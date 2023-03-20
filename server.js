const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const ordersModule = require('./orders')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Zombies Restaurant API 🍽🧟',
            version: '1.0.0',
        },
    },
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(options)

module.exports = (MAX_ORDERS = 5) => {
    const app = express()
    const orders = ordersModule(MAX_ORDERS)

    /**
    * @openapi
    * definitions:
    *   OrderRequest:
    *     type: object
    *     properties: 
    *       table:
    *         type: number
    *         description: número de la mesa que ha pedido la comanda
    *         example: 666
    *       dishes:
    *         type: array
    *         description: lista de platos de la comanda y cantidad de cada uno
    *         items:
    *           type: object
    *           properties:
    *             name:
    *               type: string
    *               description: Plato pedido
    *             quantity:
    *               type: number
    *               description: Cantidad del plato pedido
    *         example:
    *           - name: 'Ensalada de ojos frescos'
    *             quantity: 3
    *           - name: 'Carpaccio de piel muerta'
    *             quantity: 1
    *           - name: 'Hamburguesa de gato zombie'
    *             quantity: 2
    *   Order:
    *     allOf:
    *       - $ref: '#/definitions/OrderRequest'
    *       - type: object
    *         properties: 
    *           id:
    *             type: string
    *             description: identificador de la comanda
    *             example: "13"
    *           createdAt:
    *             type: string
    *             description: fecha de creación de la comanda en formato UNIX timestamp
    *             example: "1679265217763"
    */

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
    *             $ref: '#/definitions/OrderRequest'
    *     produces: 
    *       - application/json
    *     responses:
    *       201:
    *         description: Devuelve la información de la comanda
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/definitions/Order'
    *       500:
    *         description: Ha habido algún error al crear la comanda
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties: 
    *                 error:
    *                   type: string
    *                   description: descripción del error
    *                   example: 'Maximum number of orders exceeded'
    */
    app.post('/menu/order', jsonParser, (req, res) => {
        const { table, dishes = [] } = req.body
        if (!Number.isInteger(table)) {
            res.status(400).send({ error: 'table field is mandatory and must be numeric' })
        } else {
            try {
                const order = orders.createOrder(table, dishes)
                res.status(201).send(order)
            } catch (error) {
                res.status(500).send({ error })
            }
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
    *         content: 
    *           application/json:
    *             schema:
    *               $ref: '#/definitions/Order'
    *       404:
    *         description: La comanda no existe
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties: 
    *                 error:
    *                   type: string
    *                   description: descripción del error
    *                   example: 'Order <12345> not found'
    *                   
    */
    app.get('/menu/order/:orderId', (req, res) => {
        const { orderId } = req.params
        try {
            const order = orders.getOrder(orderId)
            res.status(200).send(order)
        } catch (error) {
            res.status(404).send({ error })
        }
    })

    /**
    * @openapi
    * /menu/orders:
    *   get:
    *     summary: Recupera la información de todas las comandas ordenadas
    *     tags: [orders]
    *     produces: 
    *       - application/json
    *     responses:
    *       200:
    *         description: Devuelve una lista con la información de todas las comandas ordenadas
    *         content: 
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                   $ref: '#/definitions/Order'        
    */
    app.get('/menu/orders', (req, res) => {
        res.status(200).send(orders.getOrders())
    })

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    return app
}