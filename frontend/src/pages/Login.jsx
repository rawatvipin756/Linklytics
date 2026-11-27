import {useState} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login=({setIsLoggedIn})=> {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);

  const navigate=useNavigate();

  const handleLogin=async(e)=> {
    e.preventDefault();
    try{
      setLoading(true);
      const response=await axios.post(
        "http://localhost:5000/api/auth/login",
        {email,password}
      );
      localStorage.setItem("token",response.data.token);
      setIsLoggedIn(true);
      toast.success("Login successfull!");
      navigate("/dashboard");
    }catch(error){
      toast.error(error.response?.data?.message || "Login failed");
    }finally{
      setLoading(false);
    }
  };
  return(
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Login
        </h1>

        <p className="text-slate-400 text-center mb-8">
          Welcome back! Login to your account.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Loging..." : "Login"}
          </button>

        </form>
        <p className="text-slate-400 text-center mt-6">
  Don't have an account?{" "}
  <Link to="/signup" className="text-blue-400 hover:text-blue-300">
    Sign up
  </Link>
</p>

      </div>
    </div>
  )
}

export default Login;