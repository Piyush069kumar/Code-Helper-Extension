const express = require("express");
const router = express.Router();


const { logout,signup,login,verifyOtp } = require("../controller/createUser");
const{askQuestion} = require("../controller/aiController");
const{auth,getUserProfile,history} = require("../middleware/usereDetail");


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",logout);
router.post("/verify-otp", verifyOtp);



//test route
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to protected route"
    })
})

//AI interaction
router.post("/askQuestion",auth,askQuestion);

//protected route
router.get("/userprofile",auth,getUserProfile);
router.get("/history",auth,history);


module.exports = router;

