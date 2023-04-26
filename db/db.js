const mysql = require('mysql')


const con = mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"root",
    database:"ibmproject"
})

con.connect((err)=>{
    if(err) throw err
    console.log('databased connected successfully')
})

module.exports=con