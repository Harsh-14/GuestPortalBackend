const express = require("express");

const {
  login,
  requireSignin,
  userDashboard,
  hotelMap
} = require("../controllers/userController");

const router = express.Router();

//route

//login
router.post("/login", login);

//dashboard
router.get("/userDashboard", requireSignin, userDashboard);
router.get("/hotelMap",hotelMap)
module.exports = router;
