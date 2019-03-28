const route = require('express').Router()
const Product = require('../models').Product

route.get('/', (req, res) => {
    // res.redirect('/user/'+req.session.userId)
    res.json('ADMIN')
})

route.get('/products', (req, res) => {

    Product.findAll()
    .then(items => {
        res.json(items)
    })
    .catch(err => {
        res.redirect('/products')
    })
})



module.exports = route