const route = require('express').Router()
const Models = require('../models')
const Product = Models.Product
const Tag = Models.Tag

route.get('/', (req, res) => {
    Product.findAll()
    .then(function(data){
        // res.send(data)
         
        let pageData = {}
        pageData.items = data
        res.render('pages/products/index', {pageData})
    })
})

route.get('/:id', (req, res) => {
    let id = Number(req.params.id)
    let data = {
        item: null,
        error: null
    }
    Product.findByPk(id)
    .then(function(result){
        // res.json(data)
        data.item = result
        res.render('pages/products/detail', {data})
    })
    .catch(err => {
        res.json(err)
        req.session.error = err.message
        res.redirect('/products');
    })
})

module.exports = route