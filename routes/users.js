const express = require("express");

const {
  login,
  login2,
  requireSignin,
  userDashboard, 
  hotelMap,
  manageProfile,
  confirmCheckIn,
  transport_request,
  updateManageProfile,
  insert_newGuest_manageProfile
} = require("../controllers/userController");

const router = express.Router();
//route

//login
// router.post("/login", login);

router.post("/login/:unkid",login2,login)
//dashboard
router.get("/userDashboard", requireSignin,userDashboard);
//hotel on map
router.get("/hotelMap",hotelMap);
// manageProfile
router.get("/manageProfile",requireSignin,manageProfile);

//manage profile update
router.put("/manageProfile/update",requireSignin,updateManageProfile)


router.post("/manageProfile/newguest",requireSignin,insert_newGuest_manageProfile)


//confirmCheckin
router.post("/confrimCheckIn",requireSignin,confirmCheckIn);
//transport request
router.post("/transport",requireSignin,transport_request);
module.exports = router;
