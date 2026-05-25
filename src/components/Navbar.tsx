import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/restaurants", label: "Restaurants" },
  { to: "/menu", label: "Menu" },
  { to: "/reserve", label: "Reservations" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout, setAuthModalOpen } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className={`mx-auto max-w-7xl px-6 ${scrolled ? "" : ""}`}>
        <div
          className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-elegant" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-full bg-gradient-gold grid place-items-center shadow-glow">
              <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
            </span>
            <span className="font-display text-2xl tracking-wide">
              Maison<span className="text-gradient-gold">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = path === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative px-4 py-2 text-sm tracking-wide transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-gold"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/reserve"
              className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-gold text-primary-foreground text-sm font-medium hover:opacity-90 transition shadow-glow"
            >
              Book a Table
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 rounded-full bg-gradient-gold grid place-items-center text-primary-foreground font-display text-sm cursor-pointer shadow-glow"
                >
                  {user.fullName[0].toUpperCase()}
                </button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 glass rounded-xl p-2 shadow-elegant border border-white/10"
                    >
                      <div className="px-3 py-2 border-b border-border/40 mb-1">
                        <div className="text-xs font-semibold truncate">{user.fullName}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="block w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-secondary/40 text-foreground transition"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-destructive/10 text-destructive transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full glass text-foreground text-sm font-medium hover:text-primary transition"
              >
                Sign In
              </button>
            )}

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 glass rounded-2xl p-4 flex flex-col gap-1"
            >
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl hover:bg-secondary/60 text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/reserve"
                onClick={() => setOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl bg-gradient-gold text-primary-foreground text-center font-medium"
              >
                Book a Table
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="mt-2 w-full px-4 py-3 rounded-xl glass text-destructive text-center font-medium"
                >
                  Logout ({user.fullName})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setOpen(false);
                  }}
                  className="mt-2 w-full px-4 py-3 rounded-xl glass text-foreground text-center font-medium"
                >
                  Sign In
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
