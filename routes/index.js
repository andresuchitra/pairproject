const route = require('express').Router()
const Model = require('../models')

route.get('/', (req, res) => {
    Model.TransactionProducts.findAll()
    .then(function(data){
        res.send(data)
    })
})

module.exports = route