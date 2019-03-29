const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')
const route = require('./routes')
const multer = require('multer')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.use(express.static(__dirname+'/static'))
//route all requests to routes folder

app.use('/',route)

//handle page not found
app.use(function(req,res){
    res.status(404).render('pages/404.ejs', {title: '404 Not Found'});
});

app.listen(PORT, function (req, res) {
    console.log('SERVER RUNNING ON PORT '+ PORT);
})