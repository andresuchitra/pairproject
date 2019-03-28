const route = require('express').Router()
const Product = require('../models').Product
const Transaction = require('../models').Transaction
const User = require('../models').User

route.get('/', (req, res) => {
    let items = []
    if(req.session && req.session.cartItems) {
        
        items = req.session.cartItems
    }
    Product.findAll()
    .then(items => {
        // res.json(items)
        res.render('pages/cart/index', {items})
    })
})

route.post('/add/:id', (req, res) => {
    let productId = Number(req.params.id)
    console.log(req.body);
    console.log(req.params);
    console.log(req.session);

    if(req.session && req.session.userId) {
        let quantity = Number(req.body.quantity)
        let data = {
            productId: productId,
            quantity: quantity
        }
        res.session.cartItems.push(data)
        res.render('pages/cart/add', {data})
    }
    else {
        // req.session.error = 'Please login first or register'
        res.redirect('/products/'+productId)
    }
    
})

route.post('/', (req, res) => {
    //read from session
    let cartItems = req.session.cart

    if(cartItems) {
        let productId, quantity;
        let userId = req.session.userId

        User.findByPk(userId)
        .then(user => {
            return user.addTransaction()
        })
        .then(transaction => {
            cartItems.forEach(element => {
                Product.findByPk(element.productId)
                .then(price => {
                    let amount = price * element.quantity
                    transaction.addProducts({amount: amount, quantity: element.quantity})
                })
            });
        })
    }
    else if(!req.session.userId) {
        req.session.error = 'Unknown user id. Please register/login to access the cart'
        res.redirect('/products')
    }
})



module.exports = route