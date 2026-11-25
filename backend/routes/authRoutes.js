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

router.post("/login",async (req,res)=> {
  try{
    const {email,password}=req.body;
  if(!email || !password){
    return res.status(400).json({
      message:"All fields are required"
    });
  }
  const exist=await User.findOne({email});
  if(!exist){
    return res.status(401).json({
      message:"Invalid email or password"
    });
  }
  const isPasswordCorrect=await bcrypt.compare(
    password,
    exist.password
  );
  if(!isPasswordCorrect){
    return res.status(401).json({
      message:"Invalid email or password"
    });
  }
  const token=jwt.sign(
      {id:exist._id},
      process.env.JWT_SECRET,
      {expiresIn:"7d"}
    );
    return res.status(200).json({
      message:"Login successfully",
      token,
      user:{
        id:exist._id,
        name:exist.name,
        email:exist.email
      }
    });
  }catch(error){
    console.error("Login error",error);
    return res.status(500).json({
      message:"Server error in login"
    });
  }
});

module.exports = router;