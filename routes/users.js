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
router.get("/userDashboard", userDashboard);
router.get("/hotelMap",hotelMap)
router.get("/manageProfile",manageProfile)
module.exports = router;
