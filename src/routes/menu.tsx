import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import dosa from "@/assets/food-dosa.jpg";
import burrata from "@/assets/food-burrata.jpg";
import tartare from "@/assets/food-tartare.jpg";
import turbot from "@/assets/food-turbot.jpg";
import trufflePasta from "@/assets/food-truffle-pasta.jpg";
import honeyTart from "@/assets/food-honey-tart.jpg";
import butterChicken from "@/assets/food-butter-chicken.jpg";
import sushi from "@/assets/food-sushi.jpg";
import pizza from "@/assets/food-pizza.jpg";
import scallops from "@/assets/dish-1.jpg";
import wagyu from "@/assets/dish-2.jpg";
import goldCube from "@/assets/dish-3.jpg";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Maison" },
      { name: "description", content: "Tonight's curated tasting menu at Maison's partner restaurants." },
    ],
  }),
  component: Menu,
});

const sections = [
  {
    title: "Starters",
    items: [
      { n: "Hokkaido Scallop Crudo", d: "yuzu, brown butter, finger lime", p: "$28", img: scallops },
      { n: "Heritage Tomato & Burrata", d: "basil oil, sourdough crisp", p: "$22", img: burrata },
      { n: "Wagyu Steak Tartare", d: "cured egg yolk, capers, sourdough", p: "$32", img: tartare },
    ],
  },
  {
    title: "From the East",
    items: [
      { n: "Masala Dosa", d: "crispy lentil crêpe, coconut chutney, sambar", p: "$18", img: dosa },
      { n: "Butter Chicken", d: "tomato-cream gravy, basmati rice, naan", p: "$26", img: butterChicken },
      { n: "Omakase Nigiri Selection", d: "salmon, tuna, uni — chef's choice", p: "$185", img: sushi },
    ],
  },
  {
    title: "Mains",
    items: [
      { n: "A5 Wagyu Reserve", d: "miso glaze, charred allium, jus", p: "$220", img: wagyu },
      { n: "Atlantic Turbot", d: "brown butter, capers, lemon", p: "$68", img: turbot },
      { n: "Tagliolini al Tartufo", d: "fresh white truffle, parmesan", p: "$95", img: trufflePasta },
      { n: "Wood-Fired Margherita", d: "san marzano, fior di latte, basil", p: "$24", img: pizza },
    ],
  },
  {
    title: "Desserts",
    items: [
      { n: "Valrhona Gold Cube", d: "70% chocolate, raspberry, gold leaf", p: "$32", img: goldCube },
      { n: "Honey Tarte", d: "wild honey, mascarpone, walnut", p: "$24", img: honeyTart },
    ],
  },
];

function Menu() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-16 mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Tonight's Menu</div>
          <h1 className="font-display text-5xl md:text-7xl">À la Carte</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            A seasonal expression of what's best on the market today — from Kyoto to Kerala to the Côte d'Azur.
          </p>
        </motion.div>

        <div className="mt-16 space-y-16">
          {sections.map((s, si) => (
            <motion.section
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: si * 0.05 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-display text-3xl text-gradient-gold">{s.title}</h2>
                <div className="flex-1 h-px bg-border/60" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {s.items.map((it) => (
                  <motion.div
                    whileHover={{ y: -6 }}
                    key={it.n}
                    className="glass rounded-2xl overflow-hidden group"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={it.img}
                        alt={it.n}
                        loading="lazy"
                        width={768}
                        height={576}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="font-display text-xl text-foreground">{it.n}</div>
                        <div className="text-primary font-display text-lg shrink-0">{it.p}</div>
                      </div>
                      <div className="text-sm text-muted-foreground italic mt-1">{it.d}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
