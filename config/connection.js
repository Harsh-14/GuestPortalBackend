const express = require("express");
const mysql = require("mysql");
const con = mysql.createConnection({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    // connectTimeout: 60,
  });

exports.con = con