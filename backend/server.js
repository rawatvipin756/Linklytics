const express=require("express");
const crypto=require("crypto");
require("dotenv").config();
const connectDB=require("./config/db");
const Url=require("./models/Url");

const app=express();
app.use(express.json());

const PORT=5000;

app.get("/",(req,res)=> {
  res.send("Linklytics server is running!");
});

app.get("/:shortCode",async (req,res)=> {
  try{
    const code=req.params.shortCode;
    const url=await Url.findOne({shortCode:code});
    if(!url){
      return res.status(400).json({
        message:"Url not found"
      });
    }
    res.redirect(url.originalUrl);
  }catch(error){
    consoel.error("Error in finding code",error);
    res.status(500).json({
      message:"Server error"
    });
  }
});

app.post("/api/urls",async (req,res)=> {
  try{
    const originalUrl=req.body.originalUrl;
    if(!originalUrl){
      return res.status(400).json({
        message:"URL is reqired"
      });
    }
    let parsedUrl;
    try{
      parsedUrl=new URL(originalUrl);
    }catch(error){
      return res.status(400).json({
        message:"Invalid URL"
      });
    }
    if(!["http:","https:"].includes(parsedUrl.protocol)){
      return res.status(400).json({
        message:"Only HTTP and HTTPS URLs are allowed"
      });
    }
    const shortCode=crypto.randomBytes(4).toString("hex");
    const shortUrl=`http://localhost:${PORT}/${shortCode}`;
    const newUrl=await Url.create({
      originalUrl,
      shortCode
    })
    res.status(201).json({
      message:"URL shorened succesfully",
      originalUrl:newUrl.originalUrl,
      shortCode:newUrl.shortCode,
      shortUrl
    });
  }catch(error){
    console.error("Error creating short URL",error);
    res.status(500).json({
      message:"Server error while shortening URL"
    });
  }
});

const startServer=async()=> {
  await connectDB();
  app.listen(PORT,()=> {
    console.log(`Server is connected to the PORT ${PORT}`);
  });
}

startServer();