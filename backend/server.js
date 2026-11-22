const express=require("express");
const crypto=require("crypto");
require("dotenv").config();
const connectDB=require("./config/db");
const Url=require("./models/Url");
const cors=require("cors");

const app=express();
app.use(express.json());
app.use(cors());

const PORT=5000;

app.get("/",(req,res)=> {
  res.send("Linklytics server is running!");
});

app.get("/:shortCode",async (req,res)=> {
  try{
    const code=req.params.shortCode;
    const url=await Url.findOne({shortCode:code});
    if(!url){
      return res.status(404).json({
        message:"Url not found"
      });
    }
    await Url.findOneAndUpdate(
      {shortCode:code},
      {$inc:{clicks:1}}
    );
    res.redirect(url.originalUrl);
  }catch(error){
    consoel.error("Error in finding code",error);
    res.status(500).json({
      message:"Server error"
    });
  }
});

app.get("/api/urls",async (req,res)=> {
  try{
    const urls=await Url.find();
    res.status(200).json({
      urls
    });
  }catch(error){
    console.error("Error fetching urls:",error);
    res.status(500).json({
      message:"Server error while fetching URLs"
    });
  }
});

app.get("/api/urls/:shortCode/analytics",async (req,res)=> {
  try{
    const code=req.params.shortCode;
    const url=await Url.findOne({shortCode:code});
    if(!url){
      res.status(404).json({
        message:"Url dosent exist"
      });
    }
    res.status(200).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt
    });
  }catch(error){
    console.error("Analytic error",error);
    res.status(500).json({
      message:"Server errorwhile fetching analytics"
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

app.delete("/api/urls/:id",async (req,res)=> {
  try{
    const id=req.params.id;
    const deleteUrl=await Url.findByIdAndDelete(id);
    if(!deleteUrl){
      res.status(404).json({
        message:"Url not found"
      });
    }
    return res.status(200).json({
      message:"URL deleted succesfully"
    });
  }catch(error){
    console.error("Error in deleting URL",error);
    res.status(500).json({
      message:"Error is deleting url"
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