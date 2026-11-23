import {useState} from "react";
import axios from "axios";
import { Link, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";

const Home=()=>{
  const [url,setUrl]=useState("");
  const [shortUrl,setShortUrl]=useState("");

  const handleShorten=async ()=> {
    try{
      const response=await axios.post(
        "http://localhost:5000/api/urls",
        {originalUrl:url}
      );
      setShortUrl(response.data.shortUrl);
    }catch(error){
      console.error("Error shortening URL:", error);
    }
  };

  const handleCopy=()=> {
    navigator.clipboard.writeText(shortUrl);
  };

  return(
    <main className="max-w-3xl mx-auto text-center mt-20 px-6">
      <h2 className="text-4xl font-bold text-gray-900">
        Shorten Your Links. Track every click.
      </h2>
      <p className="text-gray-500 mt-4">
        Create short links and track their performance with Linklytics.
      </p>
      <div className="flex gap-3 mt-8">
        <input
          type="text"
          value={url}
          onChange={(e)=>setUrl(e.target.value)}
          placeholder="Enter your long URL"
          className="flex-1 border rounded-lg px-4 py-3" 
        />
        <button onClick={handleShorten} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Shorten URL
        </button>
      </div>
      {shortUrl && (
        <div className="mt-6">
          <p className="text-green-600">{shortUrl}</p>
          <button
            className="mt-3 bg-gray-800 text-white px-4 py-2 rounded-lg"
            onClick={handleCopy}
          >Copy Url</button>
        </div>
      )}
    </main>
  );
}

const App=()=> {
  return(
    <div className="min-h-screen bg-gray-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold text-blue-600">Linklytics</h1>
        <div className="flex gap-6">
          <Link to="/">HOME</Link>
          <Link to="/dashboard">DASHBOARD</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics/:shortCode" element={<Analytics />} />
      </Routes>
    </div>
  )
}

export default App;