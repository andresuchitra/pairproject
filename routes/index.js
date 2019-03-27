const route = require('express').Router()
const Model = require('../models')
const productRoute = require('../routes/products')
const adminRoute = require('../routes/admin')
//silakan tambahkan route yg lain

route.get('/', (req, res) => {
    res.render('pages/index.ejs')
})

//routing to respective models
route.use('/products', productRoute)
route.use('/admin', adminRoute)




module.exports = route