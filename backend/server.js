const express=require("express");
const crypto=require("crypto");
require("dotenv").config();
const connectDB=require("./config/db");
const Url=require("./models/Url");
const cors=require("cors");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app=express();
app.use(express.json());
app.use(cors());
app.use("/api/auth",authRoutes);

const PORT=5000;

app.get("/",(req,res)=> {
  res.send("Linklytics server is running!");
});

app.get("/api/urls",authMiddleware,async (req,res)=> {
  try{
    const urls=await Url.find({
      user:req.user.id
    });
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

app.get("/api/urls/:shortCode/analytics",authMiddleware,async (req,res)=> {
  try{
    const code=req.params.shortCode;
    const url=await Url.findOne({
      shortCode:code,
      user:req.user.id
    });
    if(!url){
      return res.status(404).json({
        message:"Url dosent exist"
      });
    }
    const today=new Date();
    today.setHours(0,0,0,0);
    const tomorrow=new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1);
    const clicksToday=url.clickHistory.filter(click=> 
      click.clickedAt >=today &&
      click.clickedAt < tomorrow).length;
    // Last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);
    last7Days.setHours(0, 0, 0, 0);

    const clicksLast7Days = url.clickHistory.filter(click =>
      click.clickedAt >= last7Days
    ).length;

    // Last 30 days
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 29);
    last30Days.setHours(0, 0, 0, 0);

    const clicksLast30Days = url.clickHistory.filter(click =>
      click.clickedAt >= last30Days
    ).length;
    const recentClicks=[...url.clickHistory]
      .sort((a,b)=>b.clickedAt-a.clickedAt)
      .slice(0,10);
    return res.status(200).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      clicksToday,
      clicksLast7Days,
      clicksLast30Days,
      createdAt: url.createdAt,
      recentClicks,
      clickHistory: url.clickHistory
    });
  }catch(error){
    console.error("Analytic error",error);
    res.status(500).json({
      message:"Server error while fetching analytics"
    });
  }
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
    url.clicks+=1;
    url.clickHistory.push({
      clickedAt:new Date()
    });
    await url.save();
    return res.redirect(url.originalUrl);
  }catch(error){
    console.error("Error in finding code",error);
    res.status(500).json({
      message:"Server error"
    });
  }
});

app.post("/api/urls",authMiddleware,async (req,res)=> {
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
      shortCode,
      user:req.user.id
    });
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

app.delete("/api/urls/:id",authMiddleware,async (req,res)=> {
  try{
    const id=req.params.id;
    const deleteUrl=await Url.findByIdAndDelete({
      _id:id,
      user:req.user.id
    });
    if(!deleteUrl){
      return res.status(404).json({
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

app.get("/api/protected", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "You accessed a protected route!",
    userId: req.user.id
  });
});

const startServer=async()=> {
  await connectDB();
  app.listen(PORT,()=> {
    console.log(`Server is connected to the PORT ${PORT}`);
  });
}

startServer();