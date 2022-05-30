const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const port = 5000;


app.use(bodyParser.json());


app.get("/",(req,res)=> {

  res.send("GuestPortal Backend");
})



app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});