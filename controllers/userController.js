const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {

    const { loginId, pin } = req.body;
  
    if (!loginId || !pin) {
      return res.status(403).json({ error: "Please fill all the fileds." });
    } else {
 
  //sql
      con.query(sql, (req, res) => {
        if (err) {
          console.log("Result", error);
        }
      });



      
  
      return res.status(200).json({ message: "done" });
    }
  }