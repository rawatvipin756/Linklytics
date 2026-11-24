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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6">
      <p className="text-red-400 text-lg">{error}</p>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-5 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

  if(!analytics){
    return(
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
  Loading analytics...
</div>
    )
  }

  
return (
  <div className="bg-slate-950 text-white px-6 py-10">

    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold">URL Analytics</h1>
          <p className="text-slate-400 mt-2">
            Track the performance of your shortened URL
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-3 rounded-xl transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Total Clicks */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 rounded-2xl shadow-lg mb-8">
        <p className="text-blue-100 text-lg">Total Clicks</p>

        <h2 className="text-5xl font-bold mt-4">
          {analytics.clicks}
        </h2>

        <p className="text-blue-200 mt-3">
          Total visits to your shortened URL
        </p>
      </div>

      {/* URL Details */}
      <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl">

        <h2 className="text-xl font-semibold mb-7">
          URL Details
        </h2>

        <div className="space-y-6">

          <div>
            <p className="text-sm text-slate-400 mb-2">
              Original URL
            </p>
            <p className="text-slate-200 break-all">
              {analytics.originalUrl}
            </p>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <p className="text-sm text-slate-400 mb-2">
              Short Code
            </p>
            <p className="text-blue-400 font-semibold">
              {analytics.shortCode}
            </p>
          </div>

          <div className="border-t border-slate-800 pt-5">
            <p className="text-sm text-slate-400 mb-2">
              Created At
            </p>
            <p className="text-slate-200">
              {new Date(analytics.createdAt).toLocaleString()}
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
);

};

export default Analytics;