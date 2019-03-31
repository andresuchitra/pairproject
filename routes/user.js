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
})

var upload = multer({ storage: storage })

// SESSION
require('dotenv').config();
const request = require('request');
const qs = require('querystring');
const url = require('url');
const randomString = require('randomstring');
const csrfString = randomString.generate();
const redirect_uri = process.env.HOST + '/redirect';
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
                    type: 'buyer',
                    imagePath: 'static/_img/oppo_f11.png'
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
                let github = req.session.github
                res.render('./pages/users/index', { id, dataValue, github})
            })
    } 
    //if reques coming from Github access toket (received), we allow to stay in
    else if(req.session.access_token) {
        request.get({
              url: '"https://api.github.com/user"',
              headers: {
                Authorization: 'token ' + req.session.access_token,
                'User-Agent': 'Login-App'
              }
            }, (error, response, body) => {
                req.session.github ="Logged in via Github! Your data on GitHub: " +body
                // res.json(req.session.github)
                res.redirect('.')
            });
    }
    else {
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

//social media login, github
route.get('/login/github', (req, res) => {
    req.session.csrf_string = randomString.generate();
  const githubAuth = 'https://github.com/login/oauth/authorize?' +  
  qs.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: redirect_uri,
      state: req.session.csrf_string,
      scope: ['user:email', 'read:user', 'repo:status', 'public_repo']
    });

    console.log('========'+githubAuth);
  // redirect user to github user consent page
  res.redirect(githubAuth);
})


module.exports = route