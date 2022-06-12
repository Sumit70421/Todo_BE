const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql2');
const mysqlhandler = require('./lib/mysqlhandler');
app.use(cors());
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'todo'
});

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

const mysqllib = require("./lib/mysqlhandler");
const mysqlHandler = mysqllib.mysqlHandler;
app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());
var todo = require("./api/todo.js")(app,mysqlHandler,mysqlConnection)

