import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../api";

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setAnalytics(res.data));
  }, []);

  const dailyChartData = useMemo(() => {
    const rowMap = new Map();
    for (const row of analytics?.dailyCoinTransactions || []) {
      const day = row._id.day;
      const type = row._id.type;
      const data = rowMap.get(day) || { day, Purchase: 0, "Top-up": 0 };
      data[type] = row.total;
      rowMap.set(day, data);
    }
    return [...rowMap.values()];
  }, [analytics]);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | PrismYaoi</title>
      </Helmet>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black">Admin Analytics</h1>
          <div className="flex gap-3">
            <Link to="/admin/comics" className="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold">
              Manage Content
            </Link>
            <Link to="/admin/users" className="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold">
              Manage Users
            </Link>
          </div>
        </div>

        {!analytics ? (
          <p className="text-slate-300">Loading analytics...</p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-300">Total Users</p>
                <p className="text-3xl font-black text-fuchsia-300">{analytics.totalUsers}</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-300">Monthly Revenue</p>
                <p className="text-3xl font-black text-cyan-300">{analytics.monthlyRevenue} coins</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 md:col-span-2">
                <p className="mb-2 text-sm text-slate-300">Top 5 Most Read Comics</p>
                <ul className="space-y-1 text-sm">
                  {analytics.topComics.map((comic) => (
                    <li key={comic._id} className="flex justify-between">
                      <span>{comic.title}</span>
                      <span className="text-fuchsia-300">{comic.total_views} views</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-80 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <h2 className="mb-4 font-semibold">Daily Coin Transactions</h2>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={dailyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Line type="monotone" dataKey="Top-up" stroke="#22d3ee" strokeWidth={2} />
                    <Line type="monotone" dataKey="Purchase" stroke="#ff4fd8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <h2 className="mb-4 font-semibold">Top 5 Comics by Views</h2>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={analytics.topComics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="title" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="total_views" fill="#9d4edd" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};
