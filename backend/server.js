const express=require("express");

const app=express();
app.use(express.json());

const PORT=5000;

app.get("/",(req,res)=> {
  res.send("Linklytics server is running!");
});

app.post("/api/urls",(req,res)=> {
  const originalUrl=req.body.originalUrl;
  if(!originalUrl){
    res.status(400).json({
      message:"URL is reqired"
    });
  }
  try{
    new URL(originalUrl);
  }catch(error){
    return res.status(400).json({
      message:"Invalid URL"
    });
  }
  res.json({
    message:"URL recieved succesfully",
    originalUrl:originalUrl
  });
});

app.listen(PORT,()=> {
  console.log(`Server is connected to the PORT ${PORT}`);
});