import {useState,useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Analytics=()=> {
  const {shortCode}=useParams();
  const [analytics,setAnalytics]=useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(()=> {
    const fetchAnalytics=async ()=> {
      try{
        const response=await axios.get(`http://localhost:5000/api/urls/${shortCode}/analytics`);
        setAnalytics(response.data);
      }catch(error){
        setError("Unable to fetch analytics. URL may not exist.");
        console.error("Error fectching analytics:",error);
      }
    };
    fetchAnalytics();
  },[shortCode]);

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        {error}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-5 block mx-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >Back to Dashboard</button>
      </div>
    );
  }

  if(!analytics){
    return(
      <div className="text-center mt-20 text-gray-500">
        Loading analytics...
      </div>
    )
  }

  return(
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">URL Analytics</h1>
      <div className="bg-blue-600 text-white p-8 rounded-xl shadow-sm">
        <p className="text-lg">Total Clicks</p>
        <h2 className="text-5xl font-bold mt-3">
          {analytics.clicks}
        </h2>
        <p className="text-blue-100 mt-2">
          Total visits to your shortend URL
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
        <h2 className="text-xl font-bold mb-5">
          URL Details
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Original URL</p>
            <p className="text-gray-800 break-all">
              {analytics.originalUrl}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Short Code</p>
            <p className="text-blue-600 font-semibold">
              {analytics.shortCode}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-gray-800">
              {new Date(analytics.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;