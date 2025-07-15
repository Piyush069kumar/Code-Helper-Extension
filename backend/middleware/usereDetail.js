// backend/controller/userController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Question = require("../models/Question");


require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    // console.log("req.cookies:", req.cookies)
    //extract JWt token
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    // console.log("token:", token)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    try {
      // console.log("JWT_SECRET:", process.env.JWT_SECRETE);
      // console.log("token:", token);
      const decode = jwt.verify(token, process.env.JWT_SECRETE);
      // console.log("Decoded user:", decode);
      req.user = decode;
      // console.log("req.user:", req.user);
      
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: "Token Invalid",
      });
    }

    next();
  } 
  catch (err) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while verifying the token",
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    console.log("req.cookies:", req.cookies)
    // Get token from cookie or header
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) {
      return res.status(401).json({ 
        success: false,
         message: "No token provided"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ 
      success: true,
       user
      });
  
    }
   catch (error) {
    res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};



exports.history = async(req,res)=>{
    try{
      const userId = req.user.id;
      const questions = await Question.find({user:userId});
      res.status(200).json({
        success:true,
        data:questions
      })

    }
    catch(err){
      res.status(500).json({
        success:false,
        message: err.message
      })

    }
}