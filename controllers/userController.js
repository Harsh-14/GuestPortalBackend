const jwt = require("jsonwebtoken");
const { con } = require("../config/connection");
const {
  checkHotel,
  checkPin,
  checkLanguage,
  selectHotel_stuff,
  check_currency,
  userData,
  hotel_map,
  manage_profile
} = require("../SQL/sqlQueries");
exports.login = async (req, res) => {
  const { loginId, pin } = req.body;

  try {
    if (!loginId || !pin) {
      return res.status(401).json({ error: "Please fill all the fileds." });
    } else {
      //assign variables
      var door_code = pin;
      var reservation_code = loginId;
      var hotel_code = 9074;

      // check property code
      con.query(checkHotel, [hotel_code], (err, result) => {
        if (err) throw err;
        console.log("done");

        // Check pin
        con.query(
          checkPin,
          [
            hotel_code,
            hotel_code,
            hotel_code,
            reservation_code,
            reservation_code,
            door_code,
            hotel_code,
          ],
          (err, result) => {
            if (err) throw err;
            console.log(result);
            console.log("done");

            var tranunkid = result[0].tranunkid; //tranukid
            data = result.length;

            //checkLanguage
            if (data == 1) {
              con.query(
                checkLanguage,
                [hotel_code, "admin", "ADMIN"],
                (err, result) => {
                  if (err) throw err;
                  console.log("done");

                  //selectHotel_stuff
                  con.query(selectHotel_stuff, [hotel_code], (err, result) => {
                    if (err) throw err;
                    console.log(result);
                  });

                  //check_currency
                  con.query(check_currency, [hotel_code], (err, result) => {
                    if (err) throw err;

                    //jwt token
                    const token = jwt.sign(
                      { userId: loginId },
                      process.env.JWT_TOKEN,
                      {
                        expiresIn: "12h",
                      }
                    );

                    res
                      .status(200)
                      .json({ token, message: "User Login SucessFully" });
                  });
                }
              );
            } else {
              res.status(401).json({ error: "You are not authorized user" });
            }
          }
        );
      });
    }
  } catch (e) {
    console.log(e);
  }
};

// middleware
exports.requireSignin = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const verifyUser = await jwt.verify(token, process.env.JWT_TOKEN);
    req.user = verifyUser;
    next();
  } catch (e) {
    res.status(400).json({ error: "please Signin" });
  }
};

//userDashboard
exports.userDashboard = async (req, res) => {
  // res.status(200).json({ message: "Login Sucessfully", data_acess: 1 });
  let tranunkid = `907400000000000011`;
  const hotel_code = 9074;
  const reservation_code = 9;

  con.query(
    userData,
    [
      hotel_code,
      hotel_code,
      hotel_code,
      hotel_code,
      hotel_code,
      hotel_code,
      hotel_code,
      hotel_code,
      tranunkid,
    ],
    (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: result });
    }
  );
};

exports.hotelMap = async (req, res) => {
  con.query(hotel_map, [hotel_code], (err, result) => {
    if (err) throw err;
    console.log(result);

    res.status(200).json({ message: result });
  });
};

exports.manageProfile = async (req, res) => {
  con.changeUser({database:'saas_ezee'},(err)=>{
    if(err){
      console.log('Error in changing database', err);
      return
    }
    else{
      con.query(manage_profile, (err, result) => {
        if (err) throw err;
        console.log(result);
    
        res.status(200).json({ message: result });
      });
    }
  })
  
};
