//packages
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv").config()

//user


//connection
const host = process.env.host;
const con = mysql.createConnection({
  host:'192.168.10.11',
  port:"3306",
  user:'saas1',
  password:'saas',
  connectTimeout:60,
  
  
});

con.connect((err) => {
  if (err) throw err;
  console.log("db connected.");
});


//middleware
const app = express();
app.use(bodyParser.json());


//routes
app.get("/", (req, res) => {
  res.send("GuestPortal Backend");
});


//liisten
app.listen(5000,'127.0.0.1', () => {
  console.log(`Server running at localhost port 5000 `);
});
