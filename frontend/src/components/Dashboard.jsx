import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";

const Dashboard=()=> {
  const [urls, setUrls] = useState([]);

  useEffect(()=> {
    const fetchUrls=async()=> {
      try{
        const response=await axios.get("http://localhost:5000/api/urls");
        console.log("API Response:", response.data);
        setUrls(response.data.urls);
      }catch(error){
        console.error("Error fetching URLs:",error);
      }
    };
    fetchUrls();
  },[]);

  console.log("Updated URLs:", urls);

  return(
    <div>
      <h1>Linklytics Dashboard</h1>
      {urls.map((url)=> (
        <div key={url._id}>
          <p>Original URL:{url.originalUrl}</p>
          <p>Short URL:http://localhost:5000/{url.shortCode}</p>
          <p>Clicks:{url.clicks}</p>
        </div>
      ))}
    </div>
  )
}

export default Dashboard;