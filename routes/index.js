const route = require('express').Router()
const Model = require('../models')
const productRoute = require('../routes/products')
const adminRoute = require('../routes/admin')
const cartRoute = require('../routes/cart')
// const checkAdmin = require('../middleware/checkAdmin')

route.get('/', (req, res) => {
    res.render('pages/index.ejs')
})

//routing to respective models
route.use('/products', productRoute)
route.use('/admin', adminRoute)
route.use('/cart', cartRoute)

// route.use('/admin', checkAdmin, adminRoute)




module.exports = route