const route = require('express').Router()

route.get('/', (req, res) => {
    res.json('HOMEPAGE')
})

module.exports = route