
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const Analytics = () => {
  const { shortCode } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState(7);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/urls/${shortCode}/analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setAnalytics(response.data);
      } catch (error) {
        setError("Unable to fetch analytics. URL may not exist.");
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6">
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-5 bg-blue-600 px-5 py-3 rounded-xl"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Loading analytics...
      </div>
    );
  }

  // Prepare chart data for the last 7 days
  const chartData = [];

  for (let i = dateRange - 1; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const clicks = analytics.clickHistory
      ? analytics.clickHistory.filter(click => {
          const clickDate = new Date(click.clickedAt);

          return clickDate >= date && clickDate < nextDate;
        }).length
      : 0;

    chartData.push({
      date: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
      }),
      clicks
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

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
            className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-7 rounded-2xl">
            <p className="text-blue-100">Total Clicks</p>
            <h2 className="text-4xl font-bold mt-3">
              {analytics.clicks}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl">
            <p className="text-slate-400">Clicks Today</p>
            <h2 className="text-4xl font-bold mt-3">
              {analytics.clicksToday}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl">
            <p className="text-slate-400">Last 7 Days</p>
            <h2 className="text-4xl font-bold mt-3">
              {analytics.clicksLast7Days}
            </h2>
          </div>

        </div>

        {/* Daily Click Chart */}
        <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl mb-8">

          <h2 className="text-xl font-semibold mb-6">
            Daily Click Activity
          </h2>

          <div className="flex gap-3 mb-6">
          <button
            onClick={() => setDateRange(7)}
            className={`px-4 py-2 rounded-lg ${
              dateRange === 7
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            7 Days
          </button>

          <button
            onClick={() => setDateRange(30)}
            className={`px-4 py-2 rounded-lg ${
              dateRange === 30
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            30 Days
          </button>
        </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis allowDecimals={false} stroke="#94a3b8" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Clicks */}
        <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl mb-8">

          <h2 className="text-xl font-semibold mb-6">
            Recent Click Activity
          </h2>

          {analytics.recentClicks.length === 0 ? (
            <p className="text-slate-400">No clicks recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {analytics.recentClicks.map((click) => (
                <div
                  key={click._id}
                  className="flex justify-between items-center border-b border-slate-800 pb-4"
                >
                  <span className="text-slate-300">
                    Link visited
                  </span>

                  <span className="text-slate-400 text-sm">
                    {new Date(click.clickedAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* URL Details */}
        <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl">

          <h2 className="text-xl font-semibold mb-7">
            URL Details
          </h2>

          <div className="space-y-6">

            <div>
              <p className="text-sm text-slate-400 mb-2">Original URL</p>
              <p className="text-slate-200 break-all">
                {analytics.originalUrl}
              </p>
            </div>

            <div className="border-t border-slate-800 pt-5">
              <p className="text-sm text-slate-400 mb-2">Short Code</p>
              <p className="text-blue-400 font-semibold">
                {analytics.shortCode}
              </p>
            </div>

            <div className="border-t border-slate-800 pt-5">
              <p className="text-sm text-slate-400 mb-2">Created At</p>
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