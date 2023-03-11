const express = require('express')

module.exports = () => {
    const app = express()
    app.post('/menu/order', (req, res) => {
        res.status(201).send({ id: 1, createdAt: Date.now() })
    })
    app.get('/menu/order/:orderId', (req, res) => {
        // const id = req.param('orderId')
        res.status(200).send({ createdAt: 1 })
    })
    return app
}