const express = require('express')

let orderDate, orderId = 1

module.exports = () => {
    const app = express()
    app.post('/menu/order', (req, res) => {
        orderDate = Date.now()
        res.status(201).send({ id: orderId, createdAt: orderDate })
    })
    app.get('/menu/order/:orderId', (req, res) => {
        // const id = req.param('orderId')
        res.status(200).send({ createdAt: orderDate })
    })
    return app
}