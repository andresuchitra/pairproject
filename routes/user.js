const route = require('express').Router()
const Model = require('../models')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination: './static/_img/',
    fileName: function (req, file, cb) {
        cb(null, file.fieldName + '-' + Date.now() + path.extname(file.originalname))
    }
    // destination: function (req, file, cb) {
    //     cb(null, '/public/uploads')
    //     filename: function(){

    //     }
    // }
    // filename: function (req, file, cb) {
    //     cb(null, file.fieldname + '-' + Date.now())
    // }
})

var upload = multer({ storage: storage })

// SESSION
const session = require('express-session')
route.use(session({ secret: 'krunal', resave: false, saveUninitialized: true }));
// SESSION

route.post('/upload', upload.single('myImage'), (req, res) => {
        Model.User.update({
            imagePath: req.file.path
        },{
            where: {
                id: req.session.userId
            }
        })
        .then(()=> {
            res.redirect('/user')
        })
})

route.get('/register', (req, res) => {
    Model.Tag.findAll()
        .then(function (data) {
            let tags = []
            for (let i = 0; i < data.length; i++) {
                tags.push(data[i].name)
            }
            return tags
        })
        .then(function (tags) {
            res.render('./pages/users/register', { tags, error: req.query.error || null })
        })

})

route.post('/register', (req, res) => {
    Model.User.findOne({
        where: { username: req.body.username }
    })
        .then(function (data) {
            if (data) {
                throw new Error( "Username already used!")
            } else {
                return Model.User.findOne({
                    where: { email: req.body.email }
                })
            }
        })
        .then(function (data) {
            if (data) {
                throw new Error( "Email already used!")
            } else {
                return Model.User.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    address: req.body.address,
                    phone: req.body.phone,
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                    interests: req.body.interests.join(','),
                    type: 'buyer'
                })
            }
        })
        .then(function (data) {
            req.session.isBuyer = true
            req.session.anounce = "Congrats you've been registered! Now let's log in :)"
            res.redirect('login')
        })
        .catch(function (err) {
            res.redirect(`./register?error=${err.message}`)
        })
})

route.get('/login', (req, res) => {
    let error = req.session.error
    let anounce = req.session.anounce
    req.session.anounce = null
    req.session.error = null
    res.render('./pages/users/login', { error, anounce })
})

route.post('/login', (req, res) => {
    Model.User.findAll({
        where: {
            username: req.body.username
        }
    })
        .then(function (data) {
            if (bcrypt.compareSync(req.body.password, data[0].password)) {
                return data
            } else {
                req.session.error = "Incorrect username / password :("
                res.redirect('./login')
            }
        })
        .then(function (data) {
            if (data.length !== 0) {
                if (data[0].type == 'buyer') {
                    req.session.isBuyer = true
                    req.session.anounce = 'Hi! Welcome to our store!'
                    req.session.userId = data[0].id
                } else if (data[0].type == 'admin') {
                    req.session.isAdmin = true
                    req.session.anounce = "Hi! Let's get to work!"
                    req.session.userId = data[0].id
                }
                res.redirect('/products')
            }
        })
        .catch(function (err) {
            req.session.error = "Incorrect username / password :("
            res.redirect('./login')
        })
})

route.get('/', (req, res) => {
    if (req.session.userId) {
        Model.User.findByPk(req.session.userId)
            .then(data => {
                let id = req.session.userId
                let dataValue = data.dataValues
                
                res.render('./pages/users/index', { id, dataValue })
            })
    } else {
        req.session.error = "You must log in!"
        res.redirect('/user/login')
    }
})

route.get('/:userId/edit', (req, res) => {
    Model.User.findByPk(req.params.userId)
        .then(function (data) {
            let userData = data
            res.render('./pages/users/edit', { userData })
        })
})

route.post('/:userId/edit', (req, res) => {
    Model.User.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email
    },
        {
            where: {
                id: req.params.userId
            }
        })
        .then(data => {
            res.redirect(`/user`)
        })
})

route.get('/logout', (req, res) => {
    if (req.session.isBuyer) {
        delete req.session.isBuyer
    }
    if (req.session.isAdmin) {
        delete req.session.isAdmin
    }
    delete req.session.userId
    res.redirect('./login')
})

module.exports = route