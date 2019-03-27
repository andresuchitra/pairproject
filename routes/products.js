const route = require('express').Router()
const Models = require('../models')
const Product = Models.Product
const Tag = Models.Tag

route.get('/', (req, res) => {
    Product.findAll()
    .then(function(data){
        res.send(data)
    })
})

module.exports = route