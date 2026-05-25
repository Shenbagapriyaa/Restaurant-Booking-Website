import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Phone, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { restaurants, dishes } from "@/lib/data";

export const Route = createFileRoute("/restaurants/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Restaurant — Maison` },
      { name: "description", content: `Reserve a table at ${params.id} through Maison.` },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = useParams({ from: "/restaurants/$id" });
  const r = restaurants.find((x) => x.id === id) ?? restaurants[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative h-[70vh] overflow-hidden">
        <img src={r.image} alt={r.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex gap-2 mb-4">
              {r.tags.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full glass text-[10px] uppercase tracking-widest">{t}</span>
              ))}
            </div>
            <h1 className="font-display text-5xl md:text-7xl">{r.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 text-primary"><Star className="w-4 h-4 fill-primary" /> {r.rating} · {r.reviews} reviews</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {r.location}</span>
              <span>{r.cuisine}</span>
              <span className="text-primary">{r.price}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="font-display text-3xl mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              A destination dining room where seasonal European technique meets quiet luxury. Our open kitchen brings you face-to-face with the craft —
              expect produce-led tasting menus, a 600-label wine cellar, and a service team that remembers your name on a second visit.
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl mb-6">Menu Highlights</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {dishes.map((d) => (
                <div key={d.name} className="flex gap-4 glass rounded-2xl p-4">
                  <img src={d.image} alt={d.name} loading="lazy" className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-display text-lg">{d.name}</div>
                      <div className="text-primary text-sm">{d.price}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{d.chef}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl mb-6">Guest Reviews</h2>
            <div className="space-y-4">
              {[
                { n: "Eleanor Park", q: "The most considered tasting menu I've had this year. Every pour felt deliberate." },
                { n: "Marcus Wei", q: "Hidden gem feel with destination-restaurant execution. Already rebooked." },
              ].map((rv) => (
                <div key={rv.n} className="glass rounded-2xl p-6">
                  <div className="flex gap-1 text-primary mb-3">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-primary" />)}</div>
                  <p className="text-foreground/90">"{rv.q}"</p>
                  <div className="mt-3 text-xs text-muted-foreground">{rv.n} · Verified diner</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl mb-4">Location</h2>
            <div className="aspect-[16/9] rounded-2xl overflow-hidden glass grid place-items-center text-muted-foreground">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div>{r.location}</div>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 self-start">
          <div className="glass rounded-2xl p-6 shadow-elegant">
            <div className="text-xs uppercase tracking-widest text-primary mb-2">Reserve a Table</div>
            <div className="font-display text-2xl">Available tonight</div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {["6:30", "7:00", "7:30", "8:00", "8:30", "9:00"].map((t) => (
                <button key={t} className="py-2 rounded-xl glass text-sm hover:bg-gradient-gold hover:text-primary-foreground transition">
                  {t}
                </button>
              ))}
            </div>
            <Link to="/reserve" className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-gold text-primary-foreground font-medium shadow-glow">
              Book a Table <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-6 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Tue–Sun · 5pm – 11pm</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +1 (212) 555-0188</div>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
