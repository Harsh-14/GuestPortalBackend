const express = require("express");

const {
  login,
  requireSignin,
  userDashboard,
  hotelMap,
  manageProfile
} = require("../controllers/userController");

const router = express.Router();

//route

//login
router.post("/login", login);

//dashboard
router.get("/userDashboard", requireSignin,userDashboard);
router.get("/hotelMap",requireSignin,hotelMap)
router.get("/manageProfile",requireSignin,manageProfile)
module.exports = router;
