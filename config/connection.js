const express = require("express");
const mysql = require("mysql");
var db_config = {
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: ["DATE", "DATETIME"],
};

var con;

function handleDisconnect() {
  con = mysql.createConnection(db_config);

  (function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  con.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();
exports.con = con;
