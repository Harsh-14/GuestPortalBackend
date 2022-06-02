//packages
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv").config();
const cors = require("cors")
const localPort = 5000;
//user

//connection

const con = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  // connectTimeout: 60,
});

// con.connect((err) => {
//   if (err) throw err;
//   console.log("db connected.");
// });

//middleware
const app = express();
// app.use(cors())
app.use(bodyParser.json());

//routes
app.get("/", (req, res) => {
  res.send("GuestPortal Backend");
});


app.post("/login", async (req, res) => {
  // console.log("@12")
  const { loginId, pin } = req.body;

  if (!loginId || !pin) {
    return res.status(403).json({ error: "Please fill all the fileds." });
  } else {
    console.log(loginId, pin);

    // con.query(sql,(req,res) => {

    //   if(err)z
    //   {
    //     console.log("Result",error)
    //   }

    // })
    
    return  res.status(200).json({message:"done"})
  }
});

//liisten
app.listen(localPort, "127.0.0.1", () => {
  console.log(`Server running at http://localhost:${localPort}/`);
});
