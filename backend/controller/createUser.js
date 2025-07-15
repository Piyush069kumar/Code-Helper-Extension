const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

require("dotenv").config();

const pendingSignups = {}; // In-memory store for pending signups (use Redis in production)

//signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input first
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    //Emaail validation
    //test is a method that belongs to the RegExp object.
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailFormat.test(email)){
      return res.status(400).json({
        success:false,
        message:"Please enter a valid email address"
      })
    }
    // else{
    //   return res.status(200).json({
    //     success:true,
    //     message:"✅ email"
    //   });
    // };

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //Generate OTP
    const otp = Math.floor(100000+ Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpiry = new Date(Date.now() + 100 * 60 * 1000); // OTP valid for 100 minutes

    // Create user
     pendingSignups[email] = {
      name,
      email,
      password: hashPassword,
      otp,
      otpExpiry
    };

    //send OTP email
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER, // your email address
        pass: process.env.MAIL_PASS, // your email password
      },
    });

    await transporter.sendMail({
      from: `"Code Helper" <${process.env.MAIL_USER}>`, // sender address
      to:email,
      subject: "Verify your email",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`
    });

   

    return res.status(201).json({
      success: true,
      message: "Otp send successfully",
    });
    
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


//verify OTP
exports.verifyOtp = async(req,res)=>{
  try{
    const{email,otp} = req.body;
    const pending = pendingSignups[email];
    console.log("Pending signup:", pending);
    console.log("OTP:", otp);
    console.log("Email:", email);

    if(!pending){
      return res.status(400).json({
        success:false,
        message:"Invalid or expired OTP request"
      });
    }
     if (pending.otp !== otp || pending.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

     // Create user in DB
    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      isVerified: true,
      otp: undefined,
      otpExpiry: undefined,
    });

    // Remove from pending signups
    delete pendingSignups[email];
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;


    return res.status(200).json({
      success: true,
      message: "Email verified and user created successfully.",
      data: userResponse
    });

  } 
  catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all details"
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
    };

    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRETE, { expiresIn: "3h" });

      user = user.toObject();
      user.token = token;
      user.password = undefined;

      const option = {
        expires: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
        httpOnly: true,
        // secure: true, // Uncomment in production with HTTPS
      };

      res.cookie("token", token, option).status(200).json({
        success: true,
        token,
        user,
        message: "User Logged In Successfully"
      });
    } 
    else {
      res.status(403).json({
        success: false,
        message: "Invalid credentials"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Login Failure"
    });
  }
};



//logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};