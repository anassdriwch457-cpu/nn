import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { api } from "../api";

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [coinAdjustments, setCoinAdjustments] = useState({});

  const loadUsers = () => api.get("/admin/users").then((res) => setUsers(res.data));

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleBan = async (user) => {
    await api.patch(`/admin/users/${user._id}/ban`, { banned: !user.is_banned });
    await loadUsers();
  };

  const adjustCoins = async (userId) => {
    const amount = Number(coinAdjustments[userId] || 0);
    if (!Number.isInteger(amount)) {
      alert("Coin adjustment must be an integer.");
      return;
    }
    await api.patch(`/admin/users/${userId}/coins`, { amount });
    setCoinAdjustments((prev) => ({ ...prev, [userId]: "" }));
    await loadUsers();
  };

  return (
    <>
      <Helmet>
        <title>Admin User Management | PrismYaoi</title>
      </Helmet>

      <section className="space-y-4">
        <h1 className="text-3xl font-black">User Management</h1>

        <div className="space-y-3">
          {users.map((user) => (
            <article
              key={user._id}
              className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-semibold">
                  {user.username} <span className="text-xs text-slate-400">({user.role})</span>
                </p>
                <p className="text-sm text-slate-300">{user.email}</p>
                <p className="text-sm text-cyan-300">Coins: {user.coin_balance}</p>
                {user.is_banned && <p className="text-sm text-rose-300">Status: Banned</p>}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleBan(user)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${user.is_banned ? "bg-emerald-500 text-slate-900" : "bg-rose-500 text-white"}`}
                >
                  {user.is_banned ? "Unban" : "Ban"}
                </button>

                <input
                  type="number"
                  placeholder="+/- coins"
                  value={coinAdjustments[user._id] ?? ""}
                  onChange={(e) =>
                    setCoinAdjustments((prev) => ({
                      ...prev,
                      [user._id]: e.target.value,
                    }))
                  }
                  className="w-28 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => adjustCoins(user._id)}
                  className="rounded-full bg-prism-neon px-4 py-2 text-sm font-bold text-slate-900"
                >
                  Adjust
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};
