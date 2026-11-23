import {useState,useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Analytics=()=> {
  const {shortCode}=useParams();
  const [analytics,setAnalytics]=useState(null);

  useEffect(()=> {
    const fetchAnalytics=async ()=> {
      try{
        const response=await axios.get(`http://localhost:5000/api/urls/${shortCode}/analytics`);
        setAnalytics(response.data);
      }catch(error){
        console.error("Error fectching analytics:",error);
      }
    };
    fetchAnalytics();
  },[shortCode]);

  return(
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl text-bold">URL Annalytics</h1>
      {analytics &&(
        <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
          <p>Original URL: {analytics.originalUrl}</p>
          <p>Short Code: {analytics.shortCode}</p>
          <p>Total Clicks: {analytics.clicks}</p>
          <p>Created At: {new Date(analytics.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;