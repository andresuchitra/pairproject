const route = require('express').Router()


route.get('/', (req, res) => {
    res.sender('admin/index.ejs')
})

module.exports = route