const { redirect } = require("express/lib/response");
const jwt = require("jsonwebtoken");
const { con } = require("../config/connection");
const { checkProperty } = require("../functions/loginFunction");

exports.login = async (req, res) => {
  const { loginId, pin } = req.body;

  try {
    if (!loginId || !pin) {
      return res.status(401).json({ error: "Please fill all the fileds." });
    } else {
      var hotel_code = 9074;

      // check property code
      let sql = `SELECT databasename from saasconfig.syscompany where hotel_code=${hotel_code}`;
      con.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Result: " + result["0"]["databasename"]);

        const door_code = pin;
        var reservation_code = loginId;
        // Check pin
        sql = `SELECT fdtraninfo.tranunkid,fdtraninfo.statusunkid,fdrentalinfo.is_void_cancelled_noshow_unconfirmed AS isVoid,fdtraninfo.isgroupowner,fdtraninfo.allowselfguestportalaccess ,fdguesttran.guestunkid, fdtraninfo.supress_roomcharge from saas_ezee.fdtraninfo LEFT JOIN saas_ezee.fdrentalinfo ON fdtraninfo.tranunkid = fdrentalinfo.tranunkid AND fdrentalinfo.is_void_cancelled_noshow_unconfirmed=IF(fdtraninfo.statusunkid IN(5,6,7),1,0) AND ifnull(fdrentalinfo.ismodifiedfromOTA,0) <> 1 AND fdrentalinfo.statusunkid NOT IN (8,12) AND fdrentalinfo.hotel_code=${hotel_code} LEFT JOIN saas_ezee.fdguesttran ON fdtraninfo.masterguesttranunkid = fdguesttran.guesttranunkid  AND fdguesttran.hotel_code=${hotel_code} where IF(IFNULL(fdtraninfo.reservationno,'')='',TRIM(LEADING  FROM (TRIM(LEADING ${hotel_code} FROM fdtraninfo.tranunkid)))=${reservation_code},fdtraninfo.reservationno=${reservation_code}) AND 
      fdtraninfo.doorcode=${door_code} AND fdtraninfo.hotel_code=${hotel_code} GROUP BY fdtraninfo.tranunkid `;

        // console.log(sql)
        con.query(sql, (err, result) => {
          if (err) throw err;
          console.log(result);

          var tranunkid = result[0].tranunkid; //tranukid
          console.log("tarunkid ==========", tranunkid);
          console.log("datalength", result.length);
          data = result.length;

          // const tranunkid = result
          // data=0

          if (data == 1) {
            sql = `SELECT cfuser.language,cfuser.userunkid from saas_ezee.cfuser where hotel_code=${hotel_code} AND username='admin' AND sysdefined='ADMIN'`;
            con.query(sql, (err, result) => {
              if (err) throw err;
              console.log("Result_last", result);
              // return res.status(200).json({ data: result });

              sql = `SELECT website,accountfor,logo FROM saas_ezee.cfhotel WHERE hotel_code=${hotel_code}`;

              con.query(sql, (err, result) => {
                if (err) throw err;
                // console.log(result);
              });

              sql = `SELECT ER.exchangerateunkid,ER.isprefix AS Prefix,ER.currency_sign As Currency,ER.currency_code As Code,digits_after_decimal,ER.currency_name As Currency_Name,ER.exchange_rate1 as exchange_rate1,ER.exchange_rate2 as exchange_rate2 FROM saas_ezee.cfexchangerate AS ER  WHERE ER.isactive = 1 AND ER.hotel_code=${hotel_code}`;
              con.query(sql, (err, result) => {
                if (err) throw err;
                // console.log(result);
                // res.status(200).json({ data: result });

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
            });
          } else {
            res.status(401).json({ error: "You are not authorized user" });
          }
        });
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
  const tranunkid = `907400000000000011`;
  const hotel_code = 9074;
  const reservation_code = 9;
  sql = `SELECT 
  IFNULL(CASE
              WHEN IFNULL(fdtraninfo.groupunkid, 0) = 0 THEN fdtraninfo.reservationno
              ELSE (CASE
                  WHEN IFNULL(fdtraninfo.subreservationno, 0) = 0 THEN fdtraninfo.reservationno
                  ELSE CONCAT(fdtraninfo.reservationno,
                          '-',
                          fdtraninfo.subreservationno)
              END)
          END,
          '') AS reservationno,
  TRIM(LEADING '0' FROM (TRIM(LEADING ${hotel_code} FROM fdtraninfo.tranunkid))) AS loginid,
  fdtraninfo.arrivaldatetime AS arrival,
  fdtraninfo.masterfoliounkid AS foliounkid,
  fdtraninfo.departuredatetime AS departure,
  travelagentvoucherno,
  CONCAT(IFNULL(trcontact.salutation, ''),
          ' ',
          trcontact.name) AS name,
  trcontact.email AS notiemail,
  fdtraninfo.doorcode AS notidoorcode,
  fdtraninfo.reservationno AS notiresno,
  IFNULL((SELECT 
                  lookupunkid
              FROM
                  saas_ezee.cfcommonlookup AS cfcommonlookup
              WHERE
                  hotel_code = ${hotel_code}
                      AND lookuptype = 'SALUTATION'
                      AND (cfcommonlookup.lookup = trcontact.salutation)
              LIMIT 1),
          '') AS salutation,
  fdrentalinfo.adult,
  fdrentalinfo.child,
  cfroomtype.roomtype AS RoomType,
  cfroom.name AS Roomno,
  fdtraninfo.statusunkid,
  fdtraninfo.isgroupowner,
  fdrentalinfo.ratetypeunkid,
  DATEDIFF(fdtraninfo.departuredatetime,
          fdtraninfo.arrivaldatetime) AS noofdays,
  CAST(fdtraninfo.arrivaldatetime AS DATE) AS arrivaldate,
  CAST(fdtraninfo.departuredatetime AS DATE) AS departuredate,
  fdrentalinfo.childage,
  fdtraninfo.ispaymentlinkamountset,
  fdtraninfo.googleshortlink,
  fdtraninfo.lang_key,
  fdtraninfo.sourceunkid,
  IFNULL(fdtraninfo.groupunkid, 0) AS GroupId,
  IFNULL(trcontact.mobile, '') AS mobile,
  fdtraninfo.tranunkid,
  fdrentalinfo.rentalunkid,
  trcontact.custom3
FROM
  saas_ezee.fdtraninfo
      LEFT JOIN
      saas_ezee.fdrentalinfo ON fdrentalinfo.tranunkid = fdtraninfo.tranunkid
      AND fdrentalinfo.hotel_code = ${hotel_code}
      AND IFNULL(fdrentalinfo.ismodifiedfromOTA, 0) <> 1
      AND fdrentalinfo.statusunkid NOT IN (8 , 12)
      AND fdrentalinfo.rentaldate = CASE
      WHEN fdtraninfo.statusunkid IN (1 , 3, 11, 14) THEN '2022-06-07'
      ELSE CAST(fdtraninfo.arrivaldatetime AS DATE)
  END
      INNER JOIN
      saas_ezee.fdguesttran ON fdguesttran.tranunkid = fdtraninfo.tranunkid
      AND fdguesttran.hotel_code = ${hotel_code}
      AND fdtraninfo.masterguesttranunkid = fdguesttran.guesttranunkid
      INNER JOIN
      saas_ezee.trcontact ON fdguesttran.guestunkid = trcontact.contactunkid
      AND trcontact.hotel_code = ${hotel_code}
      INNER JOIN
      saas_ezee.cfroomtype ON cfroomtype.roomtypeunkid = fdrentalinfo.roomtypeunkid
      AND cfroomtype.hotel_code = ${hotel_code}
      LEFT JOIN
      saas_ezee.cfroom ON cfroom.roomunkid = fdrentalinfo.roomunkid
      AND cfroom.hotel_code = ${hotel_code}
WHERE
  fdtraninfo.hotel_code = ${hotel_code}
      AND fdtraninfo.tranunkid = ${tranunkid}
GROUP BY fdtraninfo.tranunkid`;

  
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);

    // var tranunkid = result[0].tranunkid;

    // console.log("_______________________________", tranunkid);

    res.status(200).json({ message: result });
  });
};


exports.hotelMap = async (req, res) => {
  const hotel_code = 9074;

  var sql=`SELECT saas_ezee.cfhotel.*,saas_ezee.cfcountry.country_name FROM saas_ezee.cfhotel LEFT JOIN saas_ezee.cfcountry ON saas_ezee.cfcountry.countryunkid = saas_ezee.cfhotel.country  WHERE saas_ezee.cfhotel.hotel_code=9075`
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);

    res.status(200).json({ message: result });
  });
}