const route = require('express').Router()

route.get('/', (req, res) => {
    res.render('pages')
})

route.get('/products', (req, res) => {
    res.json('LIST OF PRODUCTS FOR SALE')
})

route.get('/products/:id', (req, res) => {
    res.json('DETAILS OF PRODUCTS FOR SALE')
})

module.exports = route