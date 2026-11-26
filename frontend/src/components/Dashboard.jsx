import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard=()=> {
  const [urls, setUrls] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const totalUrls = urls.length;

const totalClicks = urls.reduce(
  (total, url) => total + url.clicks,
  0
);

const averageClicks = totalUrls > 0
  ? (totalClicks / totalUrls).toFixed(1)
  : 0;

  useEffect(()=> {
    const fetchUrls=async()=> {
      try{
        const token=localStorage.getItem("token");
        const response=await axios.get(
          "http://localhost:5000/api/urls",{
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );
        setUrls(response.data.urls);
      }catch(error){
        console.error("Error fetching URLs:",error);
      }finally {
        setLoading(false);
      }
    };
    fetchUrls();
  },[]);

  const handleDelete=async(id)=> {
    const confirmDelete=window.confirm(
      "Are you sure you want to delete this URL?"
    );
    if(!confirmDelete){
      return;
    }
    setDeletingId(id);
    try{
      const token=localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/api/urls/${id}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
      setUrls((prevUrls)=> 
        prevUrls.filter((url)=>url._id!==id)
      );
      toast.success("URL deleted successfully!");
    }catch(error){
      console.error("Error deleting URL:",error);
      toast.error("Failed to delete URL!");
    }finally{
      setDeletingId(null);
    }
  };

  const handleCopy=async(shortCode)=> {
    const shortUrl = `http://localhost:5000/${shortCode}`;
    try{
      await navigator.clipboard.writeText(shortUrl);
      toast.success("URL copied successfully!");
    }catch(error) {
      console.error("Error copying URL:", error);
      toast.error("Failed to copy URL!");
    }
  }

  
return (
  <div className="min-h-screen bg-slate-950 text-white">
    <main className="max-w-5xl w-full mx-auto px-6 py-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-slate-400 mt-2">
            Manage and track your shortened URLs
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-medium transition"
        >
          + Create URL
        </button>
      </header>

<section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

  <div className="flex justify-between items-center mb-6">
    <div>
      <h3 className="text-xl font-semibold">Your URLs</h3>
      <p className="text-slate-400 text-sm mt-1">
        Manage and track your shortened links
      </p>
    </div>
    <span className="text-sm text-slate-400">
      {totalUrls} links
    </span>
  </div>

  {loading ? (
    <p className="text-slate-400 py-8 text-center">
      Loading URLs...
    </p>
  ) : urls.length === 0 ? (
    <div className="text-center py-12">
      <p className="text-slate-300 text-lg font-medium">
        No URLs found
      </p>
      <p className="text-slate-500 text-sm mt-2">
        Create your first short URL to get started!
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-5 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
      >
        Create URL
      </button>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[750px]">

        <thead>
          <tr className="text-slate-400 text-sm border-b border-slate-700">
            <th className="py-4 px-3 font-medium">Original URL</th>
            <th className="py-4 px-3 font-medium">Short URL</th>
            <th className="py-4 px-3 font-medium">Clicks</th>
            <th className="py-4 px-3 font-medium">Created</th>
            <th className="py-4 px-3 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {urls.map((url) => (
            <tr
              key={url._id}
              className="border-b border-slate-800 hover:bg-slate-800/60 transition"
            >
              <td className="py-5 px-3 max-w-[220px]">
                <p className="text-slate-200 truncate" title={url.originalUrl}>
                  {url.originalUrl}
                </p>
              </td>

              <td className="py-5 px-3">
                <a
                  href={`http://localhost:5000/${url.shortCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  {url.shortCode}
                </a>
              </td>

              <td className="py-5 px-3">
                <span className="bg-blue-950 text-blue-300 px-3 py-1 rounded-full text-sm">
                  {url.clicks}
                </span>
              </td>

              <td className="py-5 px-3 text-slate-400 text-sm">
                {new Date(url.createdAt).toLocaleDateString()}
              </td>

              <td className="py-5 px-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(url.shortCode)}
                    className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg text-sm"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => navigate(`/analytics/${url.shortCode}`)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(url._id)}
                    disabled={deletingId === url._id}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-3 py-2 rounded-lg text-sm"
                  >
                    {deletingId === url._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )}

</section>


    </main>
  </div>
);

}

export default Dashboard;