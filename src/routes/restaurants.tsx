import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, MapPin, Search, ArrowRight, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { restaurants } from "@/lib/data";
import { restaurantService } from "@/lib/api";

export const Route = createFileRoute("/restaurants")({
  head: () => ({
    meta: [
      { title: "Restaurants — Maison" },
      { name: "description", content: "Browse curated, michelin-grade restaurants and reserve a table in seconds." },
    ],
  }),
  component: List,
});

const cuisines = ["All", "European", "Japanese", "French", "Steakhouse"];

function List() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState("All");
  const [liveRestaurants, setLiveRestaurants] = useState(restaurants);

  useEffect(() => {
    const fetchFilteredRestaurants = async () => {
      try {
        const params: any = {};
        if (q) params.search = q;
        if (active !== "All") params.cuisine = active;

        const res = await restaurantService.getAll(params);
        if (res.data.success) {
          const mapped = res.data.restaurants.map((r: any) => ({
            id: r._id,
            name: r.restaurantName,
            cuisine: r.cuisineType,
            location: r.location,
            rating: r.ratings,
            reviews: r.reviews || 0,
            price: r.priceRange,
            image: r.restaurantImage,
            tags: r.featured ? ["Featured", r.cuisineType] : [r.cuisineType],
          }));
          setLiveRestaurants(mapped);
        }
      } catch (err) {
        console.log("Using static local fallback for filtering");
        const localFiltered = restaurants.filter(
          (r) =>
            (active === "All" || r.cuisine.toLowerCase().includes(active.toLowerCase())) &&
            (q === "" || r.name.toLowerCase().includes(q.toLowerCase()) || r.location.toLowerCase().includes(q.toLowerCase()))
        );
        setLiveRestaurants(localFiltered);
      }
    };

    const delayDebounce = setTimeout(fetchFilteredRestaurants, 300);
    return () => clearTimeout(delayDebounce);
  }, [q, active]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-12 mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Explore</div>
          <h1 className="font-display text-5xl md:text-6xl">The Maison collection.</h1>
          <p className="mt-4 text-muted-foreground max-w-xl">Hand-picked restaurants from rising tasting menus to legendary classics.</p>
        </motion.div>

        <div className="mt-10 glass rounded-2xl p-3 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/40">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search restaurants, cuisines, neighborhoods…"
              className="bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary/40 text-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-xs tracking-wide transition ${
                active === c ? "bg-gradient-gold text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveRestaurants.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to="/restaurants/$id" params={{ id: r.id }}>
                <motion.div whileHover={{ y: -6 }} className="group rounded-2xl overflow-hidden glass shadow-card">
                  <div className="aspect-[5/3] overflow-hidden relative">
                    <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {r.tags.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-full glass text-[10px] tracking-widest uppercase">{t}</span>
                      ))}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass text-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" /> {r.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-display text-2xl">{r.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{r.cuisine}</div>
                      </div>
                      <div className="text-sm text-primary">{r.price}</div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" /> {r.location}
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{r.reviews.toLocaleString()} reviews</span>
                      <span className="text-xs text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Reserve Now <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
