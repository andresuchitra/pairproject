const route = require('express').Router()
const Model = require('../models')
const user = require('./user')
const cart = require('./cart')
const checkLogin = require('../middlewares/checkAdmin')

// SESSION
const session = require('express-session')
route.use(session({secret: 'krunal', resave: false, saveUninitialized: true}));
// SESSION

route.use('/user' , user)
route.use('/cart' , cart)

route.get('/', (req, res) => {
    res.render('./pages/index')
})

module.exports = route