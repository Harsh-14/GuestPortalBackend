//packages
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

//user
const hostname = "127.0.0.1";
const port = 5000;

//connection

const con = mysql.createConnection({
  host: "",
  user: "",
  password: "",
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
  console.log(`Server running at http://${hostname}:${port}/`);
});
