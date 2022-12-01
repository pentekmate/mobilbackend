const express = require('express')
var cors = require('cors')
const mysql=require('mysql')
const app = express()
const port = 3000

app.use(cors())



app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/tartalomfel', (req, res) => {

    var mysql = require('mysql')
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'bevasarlolista'
    })
    
    connection.connect()
    
    connection.query('INSERT INTO `listak` VALUES (NULL, "'+req.body.bevitel1+'",CURDATE(), "'+req.body.bevitel2+'");', function (err, rows, fields) {
      if (err) 
        console.log( err)
      else{
      console.log(rows)
      res.send(rows)}
      
    })
    
    connection.end()

    
  })
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })