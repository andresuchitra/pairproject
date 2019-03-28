const route = require('express').Router()
const user = require('./user')
const checkAdmin = require('../middlewares/checkAdmin')
const productRoute = require('../routes/products')
const adminRoute = require('../routes/admin')
const cartRoute = require('../routes/cart')

// SESSION
const session = require('express-session')
route.use(session({secret: 'krunal', resave: false, saveUninitialized: true}));
// SESSION

route.get('/', (req, res) => {
    res.render('./pages/index')
})

route.get('/', (req, res) => {
    res.render('pages/index.ejs')
})

//routing to respective models
route.use('/products', productRoute)
route.use('/cart', cartRoute)
route.use('/user' , user)
route.use('/admin', checkAdmin, adminRoute)

module.exports = route



