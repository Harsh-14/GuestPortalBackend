const express = require("express");

const {
  login,
  login2,
  requireSignin,
  userDashboard, 
  hotelMap,
  manageProfile,
  confirmCheckIn
} = require("../controllers/userController");

const router = express.Router();

//route

//login
router.post("/login", login);
router.post("/login/:unkid",login2,login)
//dashboard
router.get("/userDashboard", requireSignin,userDashboard);
//hotel on map
router.get("/hotelMap",requireSignin,hotelMap);
// manageProfile
router.get("/manageProfile",requireSignin,manageProfile);
//confirmCheckin
router.post("/confrimCheckIn",requireSignin,confirmCheckIn);
module.exports = router;
