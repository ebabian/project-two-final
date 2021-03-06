// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const session = require('express-session');
let bodyParser = require('body-parser')


//Configuration
const app = express();
const db = mongoose.connection
require('dotenv').config()
const PORT = process.env.PORT || 3333
const MONGODB_URI = process.env.MONGODB_URI

//Middleware
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
)

// Database

mongoose.connect(
    MONGODB_URI,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false,
        useCreateIndex: true,
    },
    () => {
        console.log('connected to mongoose');
    }
);

db.on('error', err => console.log(err.message + ' is mongod not running?'))
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI))
db.on('disconnected', () => console.log('mongo disconnected'))

const itemController = require('./controllers/routes.js')
app.use('/items', itemController)

const userController = require('./controllers/users.js')
app.use('/users', userController)

const sessionsController = require('./controllers/sessions.js')
app.use('/sessions', sessionsController)

// Routes
app.get('/', (req, res) => {
  res.render('items/welcome.ejs')
})

app.listen(PORT, () => {
    console.log('listening');
})
