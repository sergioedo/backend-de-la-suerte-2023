const express = require('express')

module.exports = () => {
    const app = express()
    app.post('/menu/order', (req, res) => {
        res.status(201).send({ createdAt: 1 })
    })
    return app
}