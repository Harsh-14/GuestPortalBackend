const jwt = require("jsonwebtoken");
const { con } = require("../config/connection");

var exec = require("child_process").exec;

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

  update_ManageProfile,
  selfCheckin,
  selfCheckin_transport,
  insert_ManageProfile,
  get_guesttranukid,
} = require("../SQL/sqlQueries");

console.log(moment().format("yyyy-mm-dd:hh:mm:ss"));

const currentDateTime = moment().format("yyyy-mm-dd:hh:mm:ss");

var requestunkid;
var tranunkid;
var guesttranunkid;
var hotel_code;

var groupCode = " ";
//middleware
exports.login2 = async (req, res, next) => {
  var unklink = req.params.unkid;

  console.log(unklink);

  try {
    exec(
      `php functions/isPropertyexist.php ${unklink} `,
      function (error, stdout, stderr) {
        hotel_code = stdout;
        next();
      }
    );
  } catch (error) {
    console.log(error);
  }
};
exports.login = async (req, res) => {
  const { loginId, pin } = req.body;
  console.log(loginId, pin, hotel_code);
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
  console.log("HotelMap Get request")
  con.query(hotel_map, [hotel_code], (err, result) => {
    if (err) throw err;
    console.log(result);

    res.status(200).json({ data: result });
  });
};

exports.manageProfile = async (req, res) => {
  // var hotel_code = 9074;
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

          res.status(200).json({ data: result });
        }
      );
    }
  });
};



exports.insert_newGuest_manageProfile = async (req, res) => {
  con.changeUser({ database: "saas_ezee" }, (err) => {
    if (err) {
      console.log("Error in changing database", err);
    } else {
      console.log(req.body);
      console.log(hotel_code);

      con.query(get_guesttranukid, [hotel_code], (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);

        guesttranunkid = Object.values(result[0])[0];
        console.log(guesttranunkid);
        console.log(guesttranunkid, "===========guesttranukid");
        console.log(tranunkid);

        con.query(insert_ManageProfile, [
          guesttranunkid,
          hotel_code,
          tranunkid,
          guesttranunkid,
         
          guesttranunkid,
          hotel_code,
          req.body.honorifics,
          req.body.name,
          req.body.gender,
          req.body.phone,
          req.body.email,
          req.body.address,
          req.body.country ? null : "INDIA",
          req.body.city,
          req.body.state,
          req.body.zip,
          req.body.guestIdentityNumber

        ]);
      });



        res.status(200).json({message:{messageTitle:"New Guest added",messageBody:`New Guest ${req.body.name} ADDED sucessfully`}})







    }
  });
};

exports.updateManageProfile = async (req, res) => {
  con.changeUser({ database: "saas_ezee" }, (err) => {
    if (err) {
      console.log("Error in changing database", err);
      return;
    } else {
      console.log(req.body);

      const {
        guestImage,
        identityImage,
        guesttranunkid,
        honorifics,
        name,
        gender,
        address,
        city,
        state,
        zip,
        country,
        phone,
        email,
        guestIdentity,
        guestIdentityNumber,
        expiryDate,
        issuingCountry,
        identity_city,
      } = req.body;

      con.query(
        update_ManageProfile,
        [
          hotel_code,
          hotel_code,
          honorifics,
          name,
          gender,
          phone,
          email,
          address,
          country,
          city,
          state,
          zip,
          guestIdentityNumber,
          expiryDate,
          identity_city,
          issuingCountry,
          guestIdentity,
          guesttranunkid,
          tranunkid,
          hotel_code,
        ],
        (err, result) => {
          if (err) throw err;
          console.log(result);
          console.log("sucess");
        }
      );
res.status(200).json({message:{messageTitle:"Update Guest Details",messageBody:"User Data update sucessfully"}})
      
    }
  });
};

exports.confirmCheckIn = async (req, res) => {
  try {
    con.query(getRequestunkid, [hotel_code], (err, result) => {
      if (err) throw err;

      requestunkid = Object.values(result[0])[0];
      tranunkid = tranunkid;

      try {
        console.log(req.body);

        let { spReq, time1 } = req.body;

        time1 = moment(time1).format("YYYY-MM-DD h:mm:ss a");
        console.log(time1);

        var description = "";
        var requestdateTime = "";

        if (!spReq || !time1) {
          description = "this is my responsibility";
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
        console.log(tranunkid)
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

              console.log(Object.keys(req.body).length);
              if (Object.keys(req.body).length > 9) {
                console.log(req.body);
                let = {
                  description,
                  transportNameNumber,
                  pickupBy,
                  time2,
                  date2,
                } = req.body;

                description = `PICKUPREQUEST & ${description}, ${transportNameNumber}, ${pickupBy}`;

                console.log(description);
                requestunkid = BigInt(requestunkid) + 2n;
                requestunkid = String(requestunkid);

                date2 = moment(date2).format("YYYY-MM-DD");
                time2 = moment(time2).format("h:mm:ss a");

                requestdateTime = `${date2} ${time2}`;
                console.log("____________________", requestdateTime);

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

               
              }

              res.status(200).json({message:{messageTitle:"Selfcheckin request",messageBody:"Your request send  sucessfully"}});
            }
          }
        );
      } catch (e) {
        console.log(e);
        res.status(400).json(
          {message:{messageTitle:"ERROR",messageBody:"SOMETHING WRONG,contect to your  Hotel receptionist"}}
        );
      }
    });
  } catch (e) {
    console.log(e);
  }
};

exports.transport_request = async (req, res) => {
  con.query(getRequestunkid, [hotel_code], (err, result) => {
    if (err) throw err;
    // console.log(
    //   result,
    //   typeof result,
    //   result[0].tranunkid,
    //   result[0],
    //   Object.values(result[0])[0]
    // );
    requestunkid = Object.values(result[0])[0];
    tranunkid = Object.values(result[0])[1];
    var requestdateTime;
    var description;
    try {
      console.log(req.body);
      var reqType;
      const { pickupBy, dropoffBy } = req.body;
      console.log(pickupBy, dropoffBy);

      if (pickupBy != undefined) {
        var { description1, transportNameNumber1, date1, time1 } = req.body;
        description = description1;
        description = `  PICKUP & ${description1}, ${transportNameNumber1}, ${pickupBy}`;
        date1 = moment(date1).format("YYYY-MM-DD");
        time1 = moment(time1).format("h:mm:ss a");
        console.log(
          "__________________________",
          date1,
          "___________________________",
          time1,
          "____________________________________"
        );
        requestdateTime = `${date1} ${time1}`;

      
      } else {
        var { description2, transportNameNumber2, date2, time2 } = req.body;
        console.log(time2);
        description = description2;
        description = ` DROPPOFF & ${description2}, ${transportNameNumber2}, ${dropoffBy}`;
        date2 = moment(date2).format("YYYY-MM-DD");
        time2 = moment(time2).format("h:mm:ss a");
        console.log(
          "__________________________",
          date2,
          "___________________________",
          time2,
          "____________________________________"
        );
        requestdateTime = `${date2} ${time2}`;
      }
      const parentid = -1;
      const status = 0;

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
          res.status(201).json({ message: {messageTitle:"Transport Request",messageBody:`Your request:${description} send sucessfully` } });
        }
      );
      console.log("sucess");
     
    } catch (e) {
      console.log(e);
    }
  });
};
