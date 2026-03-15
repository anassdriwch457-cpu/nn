import { BookOpen, Home, Search, WalletCards } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClassName = ({ isActive }) =>
  `btn-press rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out ${
    isActive
      ? "bg-premium-sheen text-obsidian-950 shadow-glow-violet"
      : "text-slate-200 hover:bg-white/[0.04] hover:text-white"
  }`;

export const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const isReaderPage = location.pathname.includes("/read/");

  return (
    <div className="min-h-screen bg-obsidian-depth pb-20 md:pb-0">
      {!isReaderPage && (
        <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-obsidian-900/55 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <Link to="/" className="group text-xl font-display font-bold tracking-wide">
              <span className="bg-premium-sheen bg-clip-text text-transparent transition-all duration-300 ease-in-out group-hover:brightness-125">
                Obsidian Series
              </span>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              <NavLink to="/" className={navClassName}>
                Home
              </NavLink>
              <NavLink to="/buy-coins" className={navClassName}>
                Wallet
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin/dashboard" className={navClassName}>
                  Admin
                </NavLink>
              )}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              {user ? (
                <>
                  <div className="hidden rounded-full border border-premium-gold/35 bg-premium-gold/10 px-3 py-1 text-sm text-premium-gold sm:block">
                    Coins: <span className="font-semibold">{user.coin_balance ?? 0}</span>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="btn-press rounded-full bg-white/[0.04] px-4 py-1.5 text-sm font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/[0.08]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn-press rounded-full bg-premium-sheen px-4 py-1.5 text-sm font-semibold text-obsidian-950 shadow-glow-violet"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={isReaderPage ? "" : "mx-auto max-w-6xl px-4 py-6"}>{children}</main>

      {!isReaderPage && (
        <nav className="glass-panel fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center justify-between rounded-2xl px-4 py-2 shadow-card-soft md:hidden">
          <Link to="/" className="btn-press flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[11px] text-slate-200">
            <Home size={16} />
            Home
          </Link>
          <Link
            to="/#search"
            className="btn-press flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[11px] text-slate-200"
          >
            <Search size={16} />
            Search
          </Link>
          <Link
            to="/#library"
            className="btn-press flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[11px] text-slate-200"
          >
            <BookOpen size={16} />
            Library
          </Link>
          <Link
            to="/buy-coins"
            className="btn-press flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[11px] text-slate-200"
          >
            <WalletCards size={16} />
            Wallet
          </Link>
        </nav>
      )}
    </div>
  );
};
