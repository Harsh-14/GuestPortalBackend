//packages
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv").config()

//user
const port = 3306;

//connection
const host = process.env.host;
const con = mysql.createConnection({
  host,
  user:process.env.user,
  password:process.env.password
});

con.connect((err) => {
  if (err) throw err;
  console.log("db connected.");
});

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("GuestPortal Backend");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
