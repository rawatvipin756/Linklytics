import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard=()=> {
  const [urls, setUrls] = useState([]);
  const navigate = useNavigate();

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

  const handleDelete=async(id)=> {
    try{
      const response = await axios.delete(`http://localhost:5000/api/urls/${id}`);
      setUrls((prevUrls)=> 
        prevUrls.filter((url)=>url._id!==id)
      );
      console.log("API response:",response.data);
      toast.success("URL deleted successfully!");
    }catch(error){
      console.error("Error deleting URL:",error);
      toast.error("Failed to delete URL!");
    }
  };

  return(
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Linklytics Dashboard</h1>
      {urls.map((url)=> (
        <div key={url._id} className="bg-white p-5 rounded-xl shadow-sm border mb-4">
          <p className="text-gray-700 font-medium">Original URL:{url.originalUrl}</p>
          <a
            href={`http://localhost:5000/${url.shortCode}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            <p className="text-blue-600 font-semibold inline">Short Code: </p>http://localhost:5000/{url.shortCode}
          </a>
          <p className="text-gray-500 text-sm">Clicks:{url.clicks}</p>
          <button
            onClick={()=> handleDelete(url._id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
          <button 
          onClick={()=> navigate(`/analytics/${url.shortCode}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            View Analytics
          </button>
        </div>
      ))}
    </div>
  )
}

export default Dashboard;