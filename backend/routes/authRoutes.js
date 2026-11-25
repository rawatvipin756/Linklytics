const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/signup",async (req,res)=> {
  try{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
      return res.status(400).json({
        message:"All fields are required"
      });
    }
    const existingUser=await User.findOne({email});
    if(existingUser){
      return res.status(409).json({
        message:"Email already registered"
      });
    }
    if(password.length<8){
      return res.status(400).json({
        message:"Password must be at least 8 characters"
      });
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user=await User.create({
      name,
      email,
      password:hashedPassword
    });
    const token=jwt.sign(
      {id:user._id},
      process.env.JWT_SECRET,
      {expiresIn:"7d"}
    );
    return res.status(201).json({
      message:"User registerd successfully",
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email
      }
    });
  }catch(error){
    console.error("Signup error:",error);
    return res.status(500).json({
      message:"Server error during signup"
    });
  }
});

module.exports = router;