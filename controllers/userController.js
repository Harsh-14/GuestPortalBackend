const jwt = require("jsonwebtoken");
const { con } = require("../config/connection");
var moment = require("moment");
const {
  checkHotel,
  checkPin,
  checkLanguage,
  selectHotel_stuff,
  check_currency,
  userData,
  hotel_map,
  manage_profile,
  getRequestunkid,
  selfCheckin,
  selfCheckin_transport,
} = require("../SQL/sqlQueries");
const e = require("express");

console.log(moment().format("yyyy-mm-dd:hh:mm:ss"));

const currentDateTime = moment().format("yyyy-mm-dd:hh:mm:ss");

var hotel_code = 9074;
var requestunkid;
var tranunkid;
var groupCode = " ";
exports.login = async (req, res) => {
  const { loginId, pin } = req.body;

  try {
    if (!loginId || !pin) {
      return res.status(401).json({ error: "Please fill all the fileds." });
    } else {
      //assign variables
      var door_code = pin;
      var reservation_code = loginId;

      // check property code
      con.query(checkHotel, [hotel_code], (err, result) => {
        if (err) throw err;
        console.log("done");
        console.log(result);

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
            try {
              tranunkid = result[0].tranunkid; //tranukid
              data = result.length;
            } catch (e) {
              tranunkid = undefined;
              data = 0;
            }
            //checkLanguage
            if (data == 1 && tranunkid != undefined) {
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
              return res
                .status(401)
                .json({ message: "You are not authorized user" });
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
  //userData
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

//hotel_map
exports.hotelMap = async (req, res) => {
  con.query(hotel_map, [hotel_code], (err, result) => {
    if (err) throw err;
    console.log(result);

    res.status(200).json({ message: result });
  });
};

exports.manageProfile = async (req, res) => {
  var hotel_code = 9074;
  con.changeUser({ database: "saas_ezee" }, (err) => {
    if (err) {
      console.log("Error in changing database", err);
      return;
    } else {
      console.log(req.body);

      con.query(
        manage_profile,
        [hotel_code, hotel_code, tranunkid, hotel_code],
        (err, result) => {
          if (err) throw err;
          console.log(result);

          res.status(200).json({ message: result });
        }
      );
    }
  });
};

exports.confirmCheckIn = async (req, res) => {
  try {
    con.query(getRequestunkid, [hotel_code], (err, result) => {
      if (err) throw err;
      console.log(
        result,
        typeof result,
        result[0].tranunkid,
        result[0],
        Object.values(result[0])[0]
      );
      requestunkid = Object.values(result[0])[0];
      tranunkid = Object.values(result[0])[1];

      try {
        console.log(req.body);

        let { spReq, time1 } = req.body;

        var description = "";
        var requestdateTime = "";

        if (!spReq || !time1) {
          description = "this is my respnsibility";
          requestdateTime = currentDateTime;
        } else {
          description = spReq;
          requestdateTime = time1;
        }

        console.log(
          req.socket.localAddress,
          "__________GET_USER_IP________________"
        );
        const parentid = -1;
        const status = 0;
        const responsedatetime = currentDateTime;
        const isChecked = 0;
        const visitorip = req.socket.localAddress;
        const itinerarycnt = 0;

        console.log(typeof requestunkid, BigInt(requestunkid));
        console.log(typeof requestunkid, requestunkid);

        con.query(
          selfCheckin,
          [
            requestunkid,
            hotel_code,
            tranunkid,
            groupCode,
            "CHECKIN",
            description,
            parentid,
            status,
            requestdateTime,
            responsedatetime,
            visitorip,
            isChecked,
            itinerarycnt,
          ],
          (err, result) => {
            if (err) throw err;
            console.log("Insert Done", result);

            if (requestunkid != "") {
              console.log("success");

              console.log(Object.keys(req.body).length)
              if (Object.keys(req.body).length >= 9) {
                let = { description, transportNameNumber, pickupBy } = req.body;

                description = `${description}, ${transportNameNumber}, ${pickupBy}`;

                console.log(description);
                requestunkid = BigInt(requestunkid) + 2n;
                requestunkid = String(requestunkid);

                con.query(
                  selfCheckin_transport,
                  [
                    requestunkid,
                    hotel_code,
                    tranunkid,
                    groupCode,
                    "TRANSPORT",
                    description,
                    parentid,
                    status,
                    requestdateTime,
                  ],
                  (err, result) => {
                    if (err) throw err;
                    console.log(result);
                  }
                );

                res
                  .status(201)
                  .json({ message: "Your Request Send SucessFully" });
              }
            }
          }
        );
      } catch (e) {
        console.log(e);
        res.status(400).json({
          message: "Something wrong please contect your hotel reception",
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};
