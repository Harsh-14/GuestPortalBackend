const express = require("express");

const { login,requireSignin,userDashboard } = require("../controllers/userController");

const router = express.Router();




//route


//login
router.post("/login", login);

//dashboard
router.get("/userDashboard",requireSignin,userDashboard)






module.exports = router;
