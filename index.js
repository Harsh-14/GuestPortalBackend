//packages
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

//user
const hostname = "192.168.10.11";
const port = 3306;

//connection

const con = mysql.createConnection({
  host: "192.168.10.11",
  user: "saas",
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
