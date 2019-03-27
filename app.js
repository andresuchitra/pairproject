const app = require('express')()
const PORT = 3000
const bodyParser = require('body-parser')
const route = require('./routes')

app.set('view engine', 'ejs')
app.set(bodyParser.urlencoded({extended: false}))
app.set(bodyParser.json())

//route all requests to routes folder
app.use('/',route)

app.listen(PORT, function (req, res) {
    console.log('SERVER RUNNING ON PORT '+ PORT);
})