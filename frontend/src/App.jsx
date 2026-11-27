import {useState} from "react";
import axios from "axios";
import { Link, Routes, Route,useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import { toast } from "react-toastify";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const Home=()=>{
  const [url,setUrl]=useState("");
  const [shortUrl,setShortUrl]=useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten=async ()=> {
    if(!url.trim()){
      toast.error("Please enter a valid URL");
      return;
    }
    try{
      const parsedUrl=new URL(url);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:"){
        toast.error("Only HTTP and HTTPS URLs are allowed");
        return;
      }
    }catch(error){
      toast.error("Please enter a valid URL");
      return;
    }
    setLoading(true);
    try{
      const token=localStorage.getItem("token");
      const response=await axios.post(
        "http://localhost:5000/api/urls",
        {originalUrl:url},{
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      );
      setShortUrl(response.data.shortUrl);
      toast.success("URL created successfully!");
    }catch(error){
      console.error("Error shortening URL:", error);
      toast.error("Failed to shorten URL!");
    }finally{
      setLoading(false);
    }
  };

  const handleCopy=async ()=> {
    try{
      await navigator.clipboard.writeText(shortUrl);
      toast.success("URL copied successfully!")
    }catch(error){
      toast.error("Error in copying URL");
    }
  };

  const handleLogout=async()=> {

  }

 
return (
  <main className="bg-slate-950 text-white">

    {/* Hero Section */}
    <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">

      <div className="inline-block bg-blue-950/60 border border-blue-800 text-blue-300 px-4 py-2 rounded-full text-sm mb-8">
        ✨ Smart URL Management Platform
      </div>

      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        Shorten Your Links.
        <span className="block text-transparent bg-clip-text bg-gradient-to from-blue-400 to-purple-500">
          Track Every Click.
        </span>
      </h1>

      <p className="text-slate-400 max-w-2xl mx-auto mt-6 text-lg">
        Create powerful short links, manage your URLs, and
        understand your audience with Linklytics.
      </p>

      {/* URL Input */}
      <div className="max-w-3xl mx-auto mt-12 bg-slate-900 border border-slate-700 p-3 rounded-2xl flex flex-col sm:flex-row gap-3 shadow-2xl shadow-blue-950/30">

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) handleShorten();
          }}
          placeholder="Paste your long URL here..."
          className="flex-1 bg-transparent text-white px-4 py-3 outline-none placeholder:text-slate-500 min-w-0"
        />

        <button
          onClick={handleShorten}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-7 py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Shortening..." : "Shorten URL →"}
        </button>

      </div>

      {/* Short URL Result */}
      {shortUrl && (
        <div className="max-w-3xl mx-auto mt-6 bg-slate-900 border border-emerald-800/60 p-5 rounded-2xl">

          <p className="text-emerald-400 text-sm mb-3">
            ✓ Your shortened URL is ready!
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 break-all hover:text-blue-300"
            >
              {shortUrl}
            </a>

            <button
              onClick={handleCopy}
              className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-lg transition shrink-0"
            >
              Copy URL
            </button>
          </div>

        </div>
      )}

    </section>

    {/* Features Section */}
    <section className="max-w-6xl mx-auto px-6 pb-24">

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          Everything you need to manage links
        </h2>
        <p className="text-slate-400 mt-3">
          Simple tools to make every link more useful.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl hover:border-blue-600 transition">
          <div className="text-3xl mb-5">🔗</div>
          <h3 className="text-xl font-semibold mb-3">
            Shorten URLs
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Convert long and complicated URLs into short,
            easy-to-share links.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl hover:border-blue-600 transition">
          <div className="text-3xl mb-5">📊</div>
          <h3 className="text-xl font-semibold mb-3">
            Track Analytics
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Monitor total clicks and understand how your
            shortened links perform.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl hover:border-blue-600 transition">
          <div className="text-3xl mb-5">⚡</div>
          <h3 className="text-xl font-semibold mb-3">
            Manage Links
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Organize, copy, view analytics, and delete
            your shortened URLs easily.
          </p>
        </div>

      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-slate-800 py-7 text-center text-slate-500 text-sm">
      © {new Date().getFullYear()} Linklytics. Built to make links smarter.
    </footer>

  </main>
);

}

const App=()=> {
  const navigate=useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const handleLogout=()=> {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
    navigate("/login");
  };
  
return (
  <div className="min-h-screen bg-slate-950 text-white">

    <nav className="bg-slate-900 border-b border-slate-800">
  <div className="max-w-7xl mx-auto flex justify-between items-center p-6">

    {/* Logo */}
    <Link to="/" className="text-3xl font-bold text-blue-500">
      Linklytics
    </Link>

    {/* Navigation links */}
    <div className="flex gap-6 text-sm font-medium">
      <Link to="/" className="text-slate-300 hover:text-blue-400">
        HOME
      </Link>

      {isLoggedIn ? (
        <>
          <Link to="/dashboard" className="text-slate-300 hover:text-blue-400">
            DASHBOARD
          </Link>

          <button onClick={handleLogout} className="text-red-400">
            LOGOUT
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-slate-300 hover:text-blue-400">
            LOGIN
          </Link>

          <Link to="/signup" className="text-slate-300 hover:text-blue-400">
            SIGNUP
          </Link>
        </>
      )}
    </div>

  </div>
</nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/signup"
        element={<Signup setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route
        path="/login"
        element={<Login setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }/>
      <Route path="/analytics/:shortCode" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      }/>
    </Routes>

  </div>
);

}

export default App;