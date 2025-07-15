// backend/models/User.js
const mongoose = require('mongoose');
require('dotenv').config();
const nodemailer = require('nodemailer');

const userSchema = new mongoose.Schema({
  name: {
	 type: String,
	 required: true 
	},
  email: {
	 type: String,
	 required: true, 
	 unique: true 
	},
  password: {
	 type: String,
	required: true 
	}, // Store hashed password!
	isVerified: {
		type: Boolean,
		default: false
	},
	otp:{
		type: String,
		required: false
	},
	otpExpiry: {
		type: Date,
		required: false
	},
  createdAt: { 
	type: Date,
	default: Date.now 
	}
});


userSchema.post("save", async function (doc) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587, // Add port
      secure: false, // Add secure
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
    });

    let info = await transporter.sendMail({
      from: `"Code Helper" <${process.env.MAIL_USER}>`,
      to: doc.email,
      subject: "Welcome to Code Helper",
      text: "Welcome to Code Helper! Enjoy on solving question using AI.",
      html: '<h2>Welcome to Code Helper</h2><p>Enjoy on solving question using AI</p>'
    });

    console.log("INFO:", info);
  } catch (err) {
    console.log("Error:", err);
  }
});

module.exports = mongoose.model('User', userSchema);