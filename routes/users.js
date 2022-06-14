const express = require("express");

const {
  login,
  login2,
  requireSignin,
  userDashboard, 
  hotelMap,
  manageProfile
} = require("../controllers/userController");

const router = express.Router();

//route

//login
router.post("/login", login);
router.post("/login/:unkid",login2,login)
//dashboard
router.get("/userDashboard", requireSignin,userDashboard);
router.get("/hotelMap",requireSignin,hotelMap)
router.get("/manageProfile",requireSignin,manageProfile)
module.exports = router;
