import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClassName = ({ isActive }) =>
  `rounded-full px-3 py-1 text-sm font-medium ${isActive ? "bg-prism-neon text-slate-900" : "text-slate-200 hover:text-white"}`;

export const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-prism-bg">
      <header className="sticky top-0 z-50 border-b border-slate-700/80 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-black tracking-wide">
            <span className="bg-prism-neon bg-clip-text text-transparent">PrismYaoi</span>
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navClassName}>
              Home
            </NavLink>
            <NavLink to="/buy-coins" className={navClassName}>
              Buy Coins
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin/dashboard" className={navClassName}>
                Admin
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="rounded-full border border-fuchsia-400/50 px-3 py-1 text-sm text-fuchsia-200">
                  Coins: <span className="font-semibold">{user.coin_balance ?? 0}</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-pride-rainbow px-4 py-1 text-sm font-semibold text-slate-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded-full bg-prism-neon px-4 py-1 text-sm font-semibold text-slate-900">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
};
