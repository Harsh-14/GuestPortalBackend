//packages
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv").config();
const usersRoutes = require("./routes/users"); 
const localPort = 5000;
const {con} = require('./config/connection');
const app = express();

//connection


con.connect((err) => {
  if (err) throw err;
  console.log("db connected.");
});
//middleware
app.use(bodyParser.json());
//routes

app.use('/guestportal',usersRoutes);


//liisten
app.listen(localPort, "127.0.0.1", () => {
  console.log(`Server running at http://localhost:${localPort}/`);
});
