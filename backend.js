const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
const cors = require('cors')
var connection

function kapcsolat() {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bevasarlolista'
  })
}

app.use(express.json())
app.use(cors())


app.get('/listak', (req, res) => {
  kapcsolat()

  connection.query('SELECT * from listak', (err, rows, fields) => {
    if (err) throw err


    res.send(rows)
  })
  connection.end()
})
//felhasználók adatainak letöltése //Login.js
app.get('/felhasznalok', (req, res) => {
  kapcsolat()

  connection.query('SELECT * from felhasznalo', (err, rows, fields) => {
    if (err) throw err


    res.send(rows)
  })
  connection.end()
})
//regisztrációs adatok feltöltése //Regisztracio.js
app.post('/regisztracio', (req, res) => {
  kapcsolat()

  connection.query('INSERT INTO `felhasznalo` VALUES (NULL, "' + req.body.bevitel1 + '", "' + req.body.bevitel2 + '",CURDATE())', function (err, rows, fields) {
    if (err)
      console.log(err)
    else {
      console.log(rows)
      res.send(rows)
    }
  })
  connection.end()

})
//lista mentése adatbázisba, felhasználónévvel //Lista_input.js
app.post('/tartalomfel', (req, res) => {
  kapcsolat()

  connection.query('INSERT INTO `listak` VALUES (NULL, "' + req.body.bevitel1 + '",CURDATE(), "' + req.body.bevitel2 + '","' + req.body.bevitel3 + '");', function (err, rows, fields) {
    if (err)
      console.log(err)
    else {
      console.log(rows)
      res.send(rows)
    }
  })
  connection.end()

})

//felhasznalo adatainak lekérése,szűrve //Elso.js
app.post('/felhasznalolistai', (req, res) => {
  kapcsolat()

  connection.query('SELECT * FROM listak WHERE letrehozofelhasznalo like"' + req.body.bevitel1 + '"', function (err, rows, fields) {
    if (err)
      console.log(err)
    else {
      console.log(rows)
      res.send(rows)
    }
  })
  connection.end()

})


//hárómhónapnál régebbi listák törlése
app.delete('/regilistatorles', (req, res) => {
  kapcsolat()

  connection.query('DELETE FROM `listak` WHERE listak_datum < (SELECT CURDATE() - INTERVAL 3 MONTH FROM `listak` LIMIT 1);', (err, rows, fields) => {
    if (err)
      console.log(err)
    else {
      console.log(rows)
      res.send(rows)
    }
  })
  connection.end()

})

//listák árainak feltöltése
app.post('/arfel', (req, res) => {
  kapcsolat()

  connection.query('UPDATE `listak` SET `listak_ar`= "' + req.body.bevitel4 + '" WHERE listak_tartalom = "' + req.body.bevitel3 + '"', function (err, rows, fields) {
    if (err)
      console.log(err)
    else {
      console.log(rows)
      res.send(rows)
    }
  })
  connection.end()

})
//Felhasznalo listainak osszeszamlalasa

app.post('/felhasznaloossz', (req, res) => {
  kapcsolat()

  connection.query('SELECT count(listak_nev) as osszes  FROM `listak` WHERE `letrehozofelhasznalo` = "'+req.body.bevitel1+'";', function (err, rows, fields) {
    if (err)
      console.log(err)
    else {
      console.log(rows[0])
      res.send(rows)
      
    }
  })
  connection.end()

})


//3hónapnál frissebb listák mutatása

app.get('/aktualis', (req, res) => {
  kapcsolat()

  connection.query('SELECT * FROM `listak` WHERE listak_datum > CURRENT_DATE();', (err, rows, fields) => {
    if (err) throw err


    res.send(rows)
  })
  connection.end()
})
//regisztráciodatum
app.post('/regisztraciodatum', (req, res) => {
  kapcsolat()

  connection.query('SELECT YEAR(`felhasznalo_regisztrdatum`)as"datum",MONTH(felhasznalo_regisztrdatum) as "honap"  FROM `felhasznalo` WHERE `felhasznalo_nev`="'+req.body.bevitel1+'"', function (err, rows, fields) {
    if (err)
      console.log(err)
    else {
      console.log(rows[0])
      res.send(rows)
    }
  })
  connection.end()

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
