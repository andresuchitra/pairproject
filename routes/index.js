const route = require('express').Router()
const user = require('./user')
const checkAdmin = require('../middlewares/checkAdmin')
const productRoute = require('../routes/products')
const adminRoute = require('../routes/admin')
const cartRoute = require('../routes/cart')

require('dotenv').config();
const request = require('request');
const qs = require('querystring');
const url = require('url');
const randomString = require('randomstring');
const csrfString = randomString.generate();
const redirect_uri = process.env.HOST + '/redirect';


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

//github callback url
route.all('/redirect', (req, res) => {
    console.log(req.query);
    const code = req.query.code;
    const returnedState = req.query.state;
  
    if (req.session.csrf_string === returnedState) {
      request.post(
        {
          url:
            'https://github.com/login/oauth/access_token?' +
            qs.stringify({
              client_id: process.env.CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              code: code,
              redirect_uri: redirect_uri,
              state: req.session.csrf_string
            })
        },
        (error, response, body) => {
          console.log('Github Token: ');
          console.log(qs.parse(body));
          req.session.access_token = qs.parse(body).access_token;
          res.redirect('/products');
        }
      );
    } else {
      res.redirect('/');
    }
  });

//routing to respective models
route.use('/products', productRoute)
route.use('/cart', cartRoute)
route.use('/user' , user)
route.use('/admin', checkAdmin, adminRoute)

module.exports = route



