const express = require('express')
const app=express();
const bodyParser = require('body-parser')

const cors = require('cors')

const path = require('path')

const con = require('./db/db.js')
const router = require('./route/Route.js')

// var session = require('express-session')

// app.set('trust proxy', 1)



app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(cors())

app.use('/api',router)

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname)))
app.use(express.static(path.join('../css')))

console.log(__dirname)
// app.use(function(req, res, next) {
//     res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//     next();
//   });
app.get('/',(request,response)=>{

    response.render('index')


})


// app.get('/logout',(req,res)=>{
//     res.render('index')
// })

app.get('/home',(req,res)=>{
    res.render('index')
})

// app.get('/home-login',(req,res)=>{
//     // res.render('login-index')
// })


// app.post('/result',(request,response)=>{
//     let usr_input = request.body.usr_input
//     console.log(usr_input)
// })



app.listen(8089,(err)=>{
    if(err) throw err
    console.log('connected to 8089')
})