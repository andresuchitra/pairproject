const route = require('express').Router()
const Model = require('../models')
const Product = require('../models').Product
const Transaction = require('../models').Transaction
const User = require('../models').User

// SESSION
const session = require('express-session')
route.use(session({
    secret: 'krunal',
    resave: false,
    saveUninitialized: true
}));
// SESSION

route.get('/', (req, res) => {
    let items = [], totalTransactionAmount = 0

    if (req.session.userId) {
        if (req.session.cartItems) {
            let productIds = req.session.cartItems.map(x => x.productId)
            let map = new Map()
            req.session.cartItems.forEach(x => {
                map.set(x.productId, x.quantity)
            })
            
            console.log('current items ===> '+ map)

            Product.findAll({
                where: {
                    id: productIds
                }
            })
            .then((products)=> {
                products.forEach(x => {
                    x.dataValues.cartQuantity = map.get(x.id)
                    x.dataValues.totalAmount = Product.getPriceFormat(x.dataValues.cartQuantity * x.price)
                    totalTransactionAmount += x.dataValues.cartQuantity * x.price
                    items.push(x)
                })
                //this parameter will be used in transaction/checkout page
                items.totalTransactionAmount = totalTransactionAmount
                items.totalAmountCurrencyFormat = Product.getPriceFormat(totalTransactionAmount)
                //to pass to next page
                req.session.cartProducts = items
                req.session.cartProducts.totalAmountCurrencyFormat = items.totalAmountCurrencyFormat
                req.session.totalTransactionAmount = totalTransactionAmount

                res.render('pages/cart/index', {items})
            })
            .catch(err => {
                req.session.error = err.messsage
                res.redirect('/products');
                
            })
        }
        else {
            res.redirect('/products')
        }

    } else {
        req.session.error = "You must log in or register!"
        res.redirect('/user/login')
    }
})

route.post('/add/:id', (req, res) => {
    let productId = Number(req.params.id)
    console.log(req.body);
    console.log(req.params);
    console.log(req.session);

    if(!req.session.cartItems) {
        req.session.cartItems = []
    }

    if (req.session && req.session.userId) {
        let quantity = Number(req.body.quantity)
        let data = {
            productId: productId,
            quantity: quantity
        }
        req.session.cartItems.push(data)
    }
    res.redirect('/products/' + productId)

})

route.post('/', (req, res) => {
    //read from session
    let cartProducts = req.session.cartProducts

    if (cartProducts) {
        let userId = req.session.userId

        User.findByPk(userId)
        .then(user => {
            return Transaction.create({
                UserId: userId
            })
        })
        .then(transaction => {
            console.log(cartProducts);
            var promises = cartProducts.map(function(item){
                let amount = item.price * item.cartQuantity
                return transaction.addProduct(item.id, {through: {amount: amount, quantity: item.cartQuantity}})
            });

            return Promise.all(promises)
        })
        .then(function(results){
            res.redirect('/cart/success')
         })
         .catch(err => {
             console.log(err);
         })

    } else if (!req.session.userId) {
        req.session.error = 'Unknown user id. Please register/login to access the cart'
        res.redirect('/products')
    }
})

route.get('/success', (req, res) => {
    res.render('pages/cart/success')
})

module.exports = route