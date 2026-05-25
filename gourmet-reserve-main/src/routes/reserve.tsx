import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Calendar, Clock, Users, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "Reserve a Table — Maison" },
      { name: "description", content: "Book your perfect dining experience in seconds. Instant confirmation." },
    ],
  }),
  component: Reserve,
});

const times = ["6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30"];
const tables = [
  { id: 1, label: "Window · 2", seats: 2, available: true },
  { id: 2, label: "Booth · 4", seats: 4, available: true },
  { id: 3, label: "Bar · 2", seats: 2, available: false },
  { id: 4, label: "Chef's · 6", seats: 6, available: true },
  { id: 5, label: "Patio · 4", seats: 4, available: true },
  { id: 6, label: "Private · 8", seats: 8, available: false },
];

function Reserve() {
  const [time, setTime] = useState("7:30");
  const [table, setTable] = useState(1);
  const [guests, setGuests] = useState(2);
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-16 mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Reservations</div>
          <h1 className="font-display text-5xl md:text-6xl">Reserve your table.</h1>
          <p className="mt-4 text-muted-foreground max-w-xl">Choose your time, pick your table, and we'll handle the rest.</p>
        </motion.div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
            toast.success("Reservation confirmed", { description: "We've sent the details to your email." });
          }}
          className="mt-12 grid lg:grid-cols-5 gap-8"
        >
          <div className="lg:col-span-3 space-y-6">
            <div className="glass rounded-2xl p-6">
              <div className="text-sm font-display text-xl mb-4">Guest Details</div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { l: "Full Name", t: "text", p: "Jane Doe" },
                  { l: "Email", t: "email", p: "jane@maison.com" },
                  { l: "Phone", t: "tel", p: "+1 (212) 000-0000" },
                  { l: "Occasion", t: "text", p: "Anniversary, birthday…" },
                ].map((f) => (
                  <label key={f.l} className="block">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">{f.l}</span>
                    <input
                      required={f.l !== "Occasion"}
                      type={f.t}
                      placeholder={f.p}
                      className="mt-2 w-full px-4 py-3 rounded-xl bg-secondary/40 outline-none focus:ring-2 focus:ring-primary/40 transition"
                    />
                  </label>
                ))}
                <label className="block sm:col-span-2">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Special Requests</span>
                  <textarea rows={3} placeholder="Allergies, seating preference…" className="mt-2 w-full px-4 py-3 rounded-xl bg-secondary/40 outline-none focus:ring-2 focus:ring-primary/40 transition resize-none" />
                </label>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="font-display text-xl mb-4">Select a Table</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tables.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    disabled={!t.available}
                    onClick={() => setTable(t.id)}
                    className={`relative px-4 py-5 rounded-xl text-left transition ${
                      !t.available
                        ? "opacity-40 cursor-not-allowed bg-secondary/20"
                        : table === t.id
                          ? "bg-gradient-gold text-primary-foreground shadow-glow"
                          : "glass hover:ring-gold"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-widest opacity-80">Table {t.id}</div>
                    <div className="font-display text-lg mt-1">{t.label}</div>
                    <div className="text-xs mt-1 opacity-70">{t.available ? "Available" : "Booked"}</div>
                    {t.available && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6">
              <div className="font-display text-xl mb-4">When</div>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</span>
                  <input type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="mt-2 w-full px-4 py-3 rounded-xl bg-secondary/40 outline-none focus:ring-2 focus:ring-primary/40" />
                </label>

                <div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Time</span>
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {times.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTime(t)}
                        className={`py-2 rounded-lg text-sm transition ${
                          time === t ? "bg-gradient-gold text-primary-foreground" : "glass hover:ring-gold"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Guests</span>
                  <div className="mt-2 flex items-center gap-3 glass rounded-xl p-2">
                    <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-lg bg-secondary/50">−</button>
                    <div className="flex-1 text-center font-display text-2xl">{guests}</div>
                    <button type="button" onClick={() => setGuests(Math.min(12, guests + 1))} className="w-10 h-10 rounded-lg bg-secondary/50">+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
                <Sparkles className="w-3.5 h-3.5" /> AI Recommendation
              </div>
              <div className="font-display text-lg mt-2">Try the 5-course tasting menu</div>
              <div className="text-xs text-muted-foreground mt-1">Based on your past visits and tonight's market produce.</div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 rounded-full bg-gradient-gold text-primary-foreground font-medium shadow-glow hover:opacity-95 transition"
            >
              Confirm Reservation
            </button>
          </aside>
        </form>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md p-6"
            onClick={() => setDone(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-3xl p-10 max-w-md text-center shadow-elegant"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                transition={{ delay: 0.15, type: "spring" }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-gold grid place-items-center shadow-glow"
              >
                <Check className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h3 className="mt-6 font-display text-3xl">Reservation Confirmed</h3>
              <p className="mt-3 text-muted-foreground">
                Table {table} for {guests} · {time} PM tonight.
                <br />A confirmation has been sent to your inbox.
              </p>
              <button
                onClick={() => setDone(false)}
                className="mt-6 px-6 py-3 rounded-full bg-gradient-gold text-primary-foreground font-medium"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
