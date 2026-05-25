import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === "login") {
        await login(formData.email, formData.password);
      } else {
        await register(formData.fullName, formData.email, formData.password, formData.phoneNumber);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAuthModalOpen(false);
    // Reset form
    setFormData({ fullName: "", email: "", password: "", phoneNumber: "" });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md p-4">
        {/* Modal Backdrop click */}
        <div className="absolute inset-0" onClick={handleClose} />

        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl glass shadow-elegant p-8 border border-white/10"
        >
          {/* Header */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-[10px] tracking-[0.2em] uppercase text-primary mb-3">
              <Sparkles className="w-3 h-3" />
              Maison dining circle
            </span>
            <h2 className="font-display text-3xl">
              {tab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-xs text-muted-foreground mt-2">
              {tab === "login"
                ? "Unlock custom reservations and fine dining recommendation insights."
                : "Join to book candlelit bistros and Michelin-grade tables."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-secondary/30 rounded-xl p-1 mb-6 border border-border/40">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
                tab === "login"
                  ? "bg-gradient-gold text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
                tab === "register"
                  ? "bg-gradient-gold text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">
                  Full Name
                </span>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Antoine Laurent"
                    className="w-full bg-secondary/30 border border-border/40 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-primary/60 transition"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">
                Email Address
              </span>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@maison.com"
                  className="w-full bg-secondary/30 border border-border/40 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-primary/60 transition"
                />
              </div>
            </label>

            {tab === "register" && (
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">
                  Phone Number
                </span>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+1 (212) 555-0182"
                    className="w-full bg-secondary/30 border border-border/40 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-primary/60 transition"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">
                Password
              </span>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-secondary/30 border border-border/40 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-primary/60 transition"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-full bg-gradient-gold text-primary-foreground font-medium shadow-glow hover:opacity-95 transition flex justify-center items-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : tab === "login" ? (
                "Log In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Quick Credential Tip for Seeding */}
          <div className="mt-6 border-t border-border/30 pt-4 text-center">
            <p className="text-[10px] text-muted-foreground">
              Demo Client: <span className="text-primary">jane.doe@maison.com</span> / <span className="text-primary">password123</span>
              <br />
              Demo Admin: <span className="text-primary">admin@maison.com</span> / <span className="text-primary">adminpassword</span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
