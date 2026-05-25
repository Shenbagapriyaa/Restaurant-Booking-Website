import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Star, Sparkles, ArrowRight, Clock, MapPin, Users, ChefHat } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { restaurants, dishes, testimonials } from "@/lib/data";
import hero from "@/assets/hero.jpg";
import chef from "@/assets/chef.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison — Reserve Your Perfect Dining Experience" },
      { name: "description", content: "Book tables at the world's most memorable restaurants. Curated reservations, instant confirmation, michelin-grade venues." },
      { property: "og:title", content: "Maison — Premium Restaurant Reservations" },
      { property: "og:description", content: "Curated reservations for unforgettable dining experiences." },
    ],
  }),
  component: Index,
});

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const dur = 1600;
        const step = (t: number) => {
          const p = Math.min((t - start) / dur, 1);
          setN(Math.floor(p * to));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <img src={hero} alt="Elegant restaurant interior" className="w-full h-[120%] object-cover" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute inset-0 bg-background/40" />
        </motion.div>

        <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-7xl px-6 pt-44 md:pt-56 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs tracking-[0.2em] uppercase text-primary mb-8">
              <Sparkles className="w-3 h-3" />
              Michelin-grade venues, one tap away
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-foreground">
              Reserve your perfect
              <span className="block italic text-gradient-gold">dining experience.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              From candle-lit bistros to rooftop chef's tables — book the night you'll remember in seconds.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/reserve"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gradient-gold text-primary-foreground font-medium shadow-glow hover:shadow-elegant transition"
              >
                Book a Table
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass text-foreground hover:text-primary transition"
              >
                Explore Restaurants
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating quick-search */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl"
        >
          <div className="glass rounded-2xl p-3 shadow-elegant grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { icon: MapPin, label: "Location", value: "New York" },
              { icon: Clock, label: "Date", value: "Tonight" },
              { icon: Users, label: "Guests", value: "2 People" },
              { icon: ChefHat, label: "Cuisine", value: "Any" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/40 transition cursor-pointer">
                <f.icon className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.label}</div>
                  <div className="text-sm text-foreground">{f.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: 1240, s: "+", l: "Curated Restaurants" },
            { n: 98000, s: "+", l: "Tables Reserved" },
            { n: 47, s: "", l: "Cities Worldwide" },
            { n: 49, s: "★", l: "Average Rating" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="text-center glass rounded-2xl p-8">
                <div className="font-display text-4xl md:text-5xl text-gradient-gold">
                  <Counter to={s.n} />{s.s}
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Tonight's Featured</div>
              <h2 className="font-display text-4xl md:text-5xl">Plates worth crossing town for.</h2>
            </div>
            <Link to="/menu" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2">
              View full menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl overflow-hidden glass shadow-card"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <div className="text-xs text-primary tracking-widest uppercase">{d.price}</div>
                  <h3 className="font-display text-xl mt-1">{d.name}</h3>
                  <div className="text-xs text-muted-foreground mt-1">{d.chef}</div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CHEF'S SPECIAL */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden shadow-elegant">
              <img src={chef} alt="Executive chef" className="w-full h-[600px] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-primary">Executive Chef</div>
                <div className="font-display text-2xl mt-1">Antoine Laurent</div>
                <div className="text-sm text-muted-foreground">2 Michelin Stars · Aurum NYC</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Chef's Special</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              A seven-course journey, designed for one unforgettable night.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Each season, our partner chefs craft an exclusive tasting menu available only through Maison.
              Paired wines, intimate counters, and a story behind every plate.
            </p>
            <div className="mt-8 space-y-3">
              {["Welcome amuse-bouche", "Seasonal raw bar", "Hand-cut tagliolini, white truffle", "Wagyu sirloin, charred allium", "Gold cube finale"].map((c, i) => (
                <div key={c} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-gradient-gold text-primary-foreground text-xs grid place-items-center">{i + 1}</span>
                  <span className="text-foreground/90">{c}</span>
                </div>
              ))}
            </div>
            <Link
              to="/reserve"
              className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-gold text-primary-foreground font-medium shadow-glow"
            >
              Reserve the Tasting Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TRENDING RESTAURANTS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Trending This Week</div>
              <h2 className="font-display text-4xl md:text-5xl">Rooms with a reputation.</h2>
            </div>
            <Link to="/restaurants" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2">
              All restaurants <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.08}>
              <Link to="/restaurants/$id" params={{ id: r.id }}>
                <motion.div whileHover={{ y: -6 }} className="group rounded-2xl overflow-hidden glass shadow-card h-full">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass text-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      {r.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="font-display text-xl">{r.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{r.cuisine} · {r.location}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-primary">{r.price}</span>
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition inline-flex items-center gap-1">
                        Reserve <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Praise</div>
            <h2 className="font-display text-4xl md:text-5xl">Loved by diners and critics alike.</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className="glass rounded-2xl p-7 h-full">
                <div className="flex gap-1 text-primary mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-primary" />)}
                </div>
                <p className="text-foreground/90 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 pt-5 border-t border-border/50">
                  <div className="font-display text-lg">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl shadow-elegant">
            <img src={hero} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-background/80" />
            <div className="relative z-10 p-12 md:p-20 text-center max-w-3xl mx-auto">
              <h2 className="font-display text-4xl md:text-6xl leading-tight">
                Tonight's table is <span className="text-gradient-gold italic">waiting</span>.
              </h2>
              <p className="mt-6 text-muted-foreground text-lg">
                Instant confirmation. Zero booking fees. Just exceptional dining.
              </p>
              <Link
                to="/reserve"
                className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-gold text-primary-foreground font-medium shadow-glow"
              >
                Book Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
