const route = require('express').Router()
const Model = require('../models')

// SESSION
const session = require('express-session')
route.use(session({secret: 'krunal', resave: false, saveUninitialized: true}));
// SESSION

route.get('/', (req, res) => {
    res.render('./pages/index')
})

module.exports = route