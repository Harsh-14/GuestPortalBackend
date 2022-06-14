const express = require("express");

const {
  login,
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

//dashboard
router.get("/userDashboard", requireSignin,userDashboard);
//hotel on map
router.get("/hotelMap",requireSignin,hotelMap);
// manageProfile
router.get("/manageProfile",requireSignin,manageProfile);
//confirmCheckin
router.post("/confrimCheckIn",requireSignin,confirmCheckIn);
module.exports = router;
