const express=require('express')
const app=express();
const router=express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('../db/db.js')
const path = require('path')
var session = require('express-session')
const sgMail = require('@sendgrid/mail');
const { table } = require('console');
// const { redirect } = require('next/dist/server/api-utils/index.js');
const apiCallFromRequest = require('../api-call.js');
const { title } = require('process');
var crypto = require('crypto');


var loggedin = false
// const fetch = require('node-fetch')
// import fetch from "node-fetch";
// app.use(express.static(path.join(__dirname)))
// app.use(express.static(path.join('../css')))
router.use(session({
    secret: 'kbr',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

// router.set('trust proxy', 1) // trust first proxy

router.use(bodyParser.json())
router.use(cors())
router.use(bodyParser.urlencoded({extended:false}))


function removeG(user_input){
    user_input=user_input.split(" ")
    const helpingVerbs = ["am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "may", "might", "must", "can", "could", "shall", "should", "will", "would"];

    for(let u of user_input){
        if (helpingVerbs.includes(u)){
            user_input=user_input.splice(u,1)
        }

    }
    return user_input.join("").toString()
    
}


router.post('/result',(req,res)=>{
    // let usr_input = request.body.usr_input
    // // usr_input=removeG(usr_input)
    // // usr_input=removeG(usr_input)
    // // console.log(usr_input)
   
    // const searchQ=`SELECT * FROM maindataset WHERE Keyword="${usr_input}"`
    // db.query(searchQ,(err,result)=>{
    //     // if(err) throw err
    //     response.render('user-data', {title : "KBR",action : "list", sampleData : result})
    //     console.log(result)
    // })
    var not_resolved=0;
    var resolved=0;
    var disputed=0;
    let user_input=req.body.usr_input
    apiCallFromRequest.callApi(user_input,(response)=>{
        response.hits.hits.forEach(element => {
            if(element._source.company_public_response){
                resolved = resolved+1;
            }
            else{
                not_resolved = not_resolved + 1;
            }
            
        });
        response.hits.hits.not_resolved = not_resolved;
        response.hits.hits.resolved = resolved;
        res.render('user-data',{title:"API",action:'list',user : response.hits.hits})
    })
})
var result_temp
var final_str;
router.post('/result/login/:type',(request,response)=>{

    if(loggedin){

        let usr_input = request.body.usr_input
        let email = request.body.email
        let type = request.params.type
        // usr_input=removeG(usr_input)
        // usr_input=removeG(usr_input)
        // console.log(usr_input)
        if(type==0){
    
            const searchQ=`SELECT * FROM maindataset WHERE (Keyword LIKE "%${usr_input}%" OR Title LIKE "%${usr_input}%" OR Description LIKE "%${usr_input}%") `
            db.query(searchQ,(err,result)=>{
                // if(err) throw err
                response.render('user-data-login', {title : "KBR",action : "list", sampleData : result})
                result_temp = result
                console.log(result)
            })
        
        }
        else{
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            console.log("Hello")
            const str = JSON.stringify(result_temp); 
            console.log(str);
    
            for(let i=0;i<=str.length;i++){
                console.log(str[i])
            }
    

            
            
            console.log("result",typeof result_temp)
            let html1='<table><thead><tr><th>Title</th><th>year</th><th>Description</th><th>Court/Act</th><th>Keyword</th></tr></thead><tbody>'
            result_temp.forEach(element => {
                html1+="<tr>"
                for (const [key, value] of Object.entries(element)) {
                    console.log(`${key}: ${value}`);
                    html1+="<td>"
                    html1+=`${value}`
                    html1+="</td>"
                  }
                html1+="</tr>"
            });
            const msg = {
                to: email, // Change to your recipient
                from: 'aryanpandit19@gnu.ac.in', // Change to your verified sender
                subject: 'Keyword Based Retrieval Test',
                text: "hello",
                html: html1+"</tbody></table>",
                }
                sgMail
                .send(msg)
                .then(() => {
                    // console.log(result_temp)
                    response.render('user-data-login', {title : "KBR",action : "list", sampleData : result_temp})
                    // console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                    response.render('user-data-login', {title : "KBR",action : "list", sampleData : result_temp})
                })
        }
    }else{
        console.log(loggedin)
        response.render('index')
    }
   
    
})
router.post('/result/email',(request,response)=>{
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    console.log("Hello")
    let table=request.body.data_table;

    const msg = {
        to: 'aryanpandit1718@gmail.com', // Change to your recipient
        from: 'aryanpandit19@gnu.ac.in', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'yo',
        html: 'table',
        }
        sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })

    
})

router.post('/login',(request,response)=>{

    let username = request.body.username
    let password = request.body.password
    
    var hash = crypto.createHash('md5').update(password).digest('hex');
    console.log(hash)
    
    const queryUP=`SELECT * FROM logintable WHERE name="${username}" and password="${hash}"`
    db.query(queryUP,(err,result)=>{
        if(result.length > 0){
            loggedin = true
            request.session.username = username;
            
            response.redirect('/api/home')
        }
        else{
            response.render('index')
        }
    })
})


router.get('/home',(request,response)=>{
    if(loggedin){
        // console.log('if',loggedin)
        response.render('login-index')
    }
    else{
        // console.log('else',loggedin)
        response.render('index')
    }
})


router.get('/home-login',(req,res)=>{
    if(loggedin){
        console.log('if',loggedin)
        res.render('login-index')
    }
    else{
        console.log('else',loggedin)
        res.render('index')
    }
})

router.get('/logout',(req,res)=>{
    loggedin=false
    console.log(loggedin)
    res.redirect('/api/home')
})

router.get('/form',(req,res)=>{
    res.render('form')
})


router.post('/upload',(req,res)=>{
    let title = req.body.title
    let year = req.body.year
    let description = req.body.description
    let court = req.body.court
    let keyword = req.body.keyword

    const queryIR = `INSERT INTO maindataset VALUES ("${title}","${year}","${description}","${court}","${keyword}")`

    db.query(queryIR,(err,result)=>{
        if(err) throw err
        res.render('login-index')
    })
})

module.exports=router