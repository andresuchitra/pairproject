const route = require('express').Router()
const Model = require('../models')

route.get('/', (req, res) => {
    Model.User.findAll({
        include: [Model.Transaction]
    })
    .then(function(data){
        res.send(data)
    })
})

module.exports = route