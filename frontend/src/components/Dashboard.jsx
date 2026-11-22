import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";

const Dashboard=()=> {
  const [urls, setUrls] = useState([]);

  useEffect(()=> {
    const fetchUrls=async()=> {
      try{
        const response=await axios.get("http://localhost:5000/api/urls");
        setUrls(response.data.urls);
      }catch(error){
        console.error("Error fetching URLs:",error);
      }
    };
    fetchUrls();
  },[]);

  console.log(urls);

  return(
    <div>
      <h1>Linklytics Dashboard</h1>
    </div>
  )
}

export default Dashboard;