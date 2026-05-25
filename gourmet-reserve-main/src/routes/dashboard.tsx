import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Calendar, Heart, User, Bell, TrendingUp, MapPin, ArrowRight, X, Mail, Phone, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { restaurants } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Maison" },
      { name: "description", content: "Your reservations, favorites, and dining history at a glance." },
    ],
  }),
  component: Dashboard,
});

const upcoming = [
  { rest: restaurants[0], date: "Tonight · 7:30 PM", guests: 2, table: "Booth · 4" },
  { rest: restaurants[1], date: "Sat, Jun 1 · 8:00 PM", guests: 4, table: "Chef's · 6" },
];
const history = [
  { rest: restaurants[2], date: "May 14 · 7:00 PM", guests: 2 },
  { rest: restaurants[3], date: "Apr 28 · 9:00 PM", guests: 3 },
  { rest: restaurants[0], date: "Mar 02 · 6:30 PM", guests: 2 },
];
const favorites = [restaurants[0], restaurants[2], restaurants[3]];
const notifications = [
  { icon: Calendar, title: "Reservation confirmed", body: "Aurum · Tonight at 7:30 PM. Booth · 4.", time: "2h ago", unread: true },
  { icon: Star, title: "Chef's tasting menu added", body: "Kaiseki Mori just released a new spring omakase.", time: "Yesterday", unread: true },
  { icon: Heart, title: "Lumière is fully booked tomorrow", body: "We'll notify you the moment a table opens.", time: "2 days ago", unread: false },
  { icon: TrendingUp, title: "You earned 250 Gold points", body: "Redeem points toward a complimentary wine pairing.", time: "Last week", unread: false },
];

type TabKey = "reservations" | "favorites" | "notifications" | "profile";

function Dashboard() {
  const [tab, setTab] = useState<TabKey>("reservations");

  const nav: { key: TabKey; icon: typeof Calendar; label: string }[] = [
    { key: "reservations", icon: Calendar, label: "Reservations" },
    { key: "favorites", icon: Heart, label: "Favorites" },
    { key: "notifications", icon: Bell, label: "Notifications" },
    { key: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-28 pb-12 mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2 lg:sticky lg:top-28 self-start">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-gold grid place-items-center text-primary-foreground font-display text-lg">J</div>
                <div>
                  <div className="font-display text-lg">Jane Doe</div>
                  <div className="text-xs text-muted-foreground">Gold Member</div>
                </div>
              </div>
            </div>
            <nav className="glass rounded-2xl p-2">
              {nav.map((n) => {
                const active = tab === n.key;
                return (
                  <button
                    key={n.key}
                    onClick={() => setTab(n.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition ${
                      active
                        ? "bg-gradient-gold text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    <n.icon className="w-4 h-4" /> {n.label}
                    {n.key === "notifications" && (
                      <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-background/20" : "bg-primary/20 text-primary"}`}>
                        2
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main */}
          <main className="space-y-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-10"
              >
                {tab === "reservations" && <ReservationsTab />}
                {tab === "favorites" && <FavoritesTab />}
                {tab === "notifications" && <NotificationsTab />}
                {tab === "profile" && <ProfileTab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ReservationsTab() {
  return (
    <>
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Welcome back</div>
        <h1 className="font-display text-4xl md:text-5xl">Good evening, Jane.</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { l: "Upcoming", v: "2", s: "reservations" },
          { l: "This Year", v: "18", s: "visits" },
          { l: "Saved", v: "9", s: "restaurants" },
        ].map((c, i) => (
          <motion.div
            key={c.l}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-6"
          >
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.l}</div>
            <div className="font-display text-4xl text-gradient-gold mt-2">{c.v}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.s}</div>
          </motion.div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Upcoming Reservations</h2>
          <Link to="/reserve" className="text-xs text-primary inline-flex items-center gap-1">New booking <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {upcoming.map((u) => (
            <motion.div whileHover={{ y: -4 }} key={u.rest.id + u.date} className="glass rounded-2xl overflow-hidden flex">
              <img src={u.rest.image} alt={u.rest.name} loading="lazy" className="w-32 h-full object-cover" />
              <div className="flex-1 p-5">
                <div className="font-display text-xl">{u.rest.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1"><MapPin className="w-3 h-3" /> {u.rest.location}</div>
                <div className="mt-3 text-sm text-primary">{u.date}</div>
                <div className="text-xs text-muted-foreground mt-1">{u.guests} guests · {u.table}</div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => toast("Modify reservation", { description: "Editing flow coming soon." })} className="text-xs px-3 py-1.5 rounded-full glass">Modify</button>
                  <button
                    onClick={() => toast("Reservation cancelled", { description: "We hope to host you another time." })}
                    className="text-xs px-3 py-1.5 rounded-full glass text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Recommended for you</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.slice(0, 3).map((r) => (
            <Link to="/restaurants/$id" params={{ id: r.id }} key={r.id}>
              <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl overflow-hidden">
                <img src={r.image} alt={r.name} loading="lazy" className="w-full aspect-[4/3] object-cover" />
                <div className="p-4">
                  <div className="font-display text-lg">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.cuisine}</div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-4">Booking History</h2>
        <div className="glass rounded-2xl overflow-hidden">
          {history.map((h, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 ${i ? "border-t border-border/40" : ""}`}>
              <img src={h.rest.image} alt="" loading="lazy" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="font-display text-base">{h.rest.name}</div>
                <div className="text-xs text-muted-foreground">{h.date} · {h.guests} guests</div>
              </div>
              <button onClick={() => toast("Rebooking…", { description: `${h.rest.name} — choose a new date.` })} className="text-xs text-primary hover:underline">Rebook</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function FavoritesTab() {
  const [saved, setSaved] = useState(favorites.map((f) => f.id));
  return (
    <>
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Saved places</div>
        <h1 className="font-display text-4xl md:text-5xl">Your Favorites</h1>
        <p className="text-muted-foreground mt-3 max-w-xl">Restaurants you love — one tap away from your next reservation.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {favorites.map((r) => {
          const isSaved = saved.includes(r.id);
          return (
            <motion.div whileHover={{ y: -4 }} key={r.id} className="glass rounded-2xl overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <button
                  onClick={() => {
                    setSaved((s) => isSaved ? s.filter((id) => id !== r.id) : [...s, r.id]);
                    toast(isSaved ? "Removed from favorites" : "Saved to favorites", { description: r.name });
                  }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center bg-background/60 backdrop-blur hover:bg-background/80"
                  aria-label="Toggle favorite"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? "fill-primary text-primary" : "text-foreground"}`} />
                </button>
              </div>
              <div className="p-4">
                <div className="font-display text-lg">{r.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {r.location}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-primary">★ {r.rating}</span>
                  <Link to="/reserve" className="text-xs px-3 py-1.5 rounded-full bg-gradient-gold text-primary-foreground">Reserve</Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

function NotificationsTab() {
  const [items, setItems] = useState(notifications);
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Inbox</div>
          <h1 className="font-display text-4xl md:text-5xl">Notifications</h1>
        </div>
        <button
          onClick={() => { setItems(items.map((i) => ({ ...i, unread: false }))); toast("All caught up"); }}
          className="text-xs text-primary hover:underline"
        >
          Mark all read
        </button>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {items.map((n, i) => (
          <div key={i} className={`flex items-start gap-4 p-5 ${i ? "border-t border-border/40" : ""} ${n.unread ? "bg-primary/[0.03]" : ""}`}>
            <div className="w-10 h-10 rounded-full bg-secondary/60 grid place-items-center text-primary shrink-0">
              <n.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-display text-base">{n.title}</div>
                {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{n.body}</div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground/70 mt-2">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ProfileTab() {
  const [form, setForm] = useState({
    name: "Jane Doe",
    email: "jane.doe@maison.com",
    phone: "+1 (212) 555 0182",
    preferences: "Window seating, no shellfish, prefers red wine pairing.",
  });
  return (
    <>
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Account</div>
        <h1 className="font-display text-4xl md:text-5xl">Profile</h1>
      </div>

      <div className="glass rounded-2xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-gold grid place-items-center text-primary-foreground font-display text-3xl">J</div>
        <div className="flex-1">
          <div className="font-display text-2xl">{form.name}</div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-primary" /> Gold Member</span>
            <span>·</span>
            <span>Member since 2022</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); toast("Profile updated", { description: "Your preferences have been saved." }); }}
        className="glass rounded-2xl p-6 space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Email" icon={Mail} value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Phone" icon={Phone} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Dining preferences" value={form.preferences} onChange={(v) => setForm({ ...form, preferences: v })} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => toast("Changes discarded")} className="text-xs px-4 py-2 rounded-full glass">Cancel</button>
          <button type="submit" className="text-xs px-5 py-2 rounded-full bg-gradient-gold text-primary-foreground font-medium">Save changes</button>
        </div>
      </form>
    </>
  );
}

function Field({ label, value, onChange, icon: Icon }: { label: string; value: string; onChange: (v: string) => void; icon?: typeof Mail }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-secondary/30 border border-border/40 rounded-xl py-2.5 ${Icon ? "pl-9" : "pl-3"} pr-3 text-sm focus:outline-none focus:border-primary/60 transition`}
        />
      </div>
    </label>
  );
}
