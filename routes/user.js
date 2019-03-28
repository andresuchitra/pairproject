const route = require('express').Router()
const Model = require('../models')
const bcrypt = require('bcryptjs')
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



route.get('/register', (req, res) => {
    res.render('./pages/users/register')
})

route.post('/register', (req, res) => {
    Model.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        type: 'buyer'
    })
        .then(function (data) {
            req.session.isBuyer = true
            req.session.anounce = "Congrats you've been registered! Now let's log in :)"
            res.redirect('login')
        })
        .catch(function (err) {
            res.send(err)
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
              url: 'https://api.github.com/user/public_emails',
              headers: {
                Authorization: 'token ' + req.session.access_token,
                'User-Agent': 'Login-App'
              }
            }, (error, response, body) => {
              res.send(
                req.session.github ="Logged in via Github! Here's all your emails on GitHub: " +body
              );
            }
        );
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
            res.render('./pages/users/edit' , {userData})
        })
})

route.post('/:userId/edit', (req, res) => {
    Model.User.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
    },
    {
        where: {
            id: req.params.userId
        }
    })
    .then(data => {
        res.redirect(`user/${req.params.userId}/edit`)
    })
    // res.send(req.params.userId)
})

//social media login, github
route.get('/login/github', (req, res) => {
    req.session.csrf_string = randomString.generate();
  const githubAuth = 'https://github.com/login/oauth/authorize?' +
    qs.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: redirect_uri,
      state: req.session.csrf_string,
      scope: ['user:email', 'read:user', 'repo:status', 'public_repo', 'notifications']
    });
  // redirect user to github user consent page
  res.redirect(githubAuth);
})


module.exports = route