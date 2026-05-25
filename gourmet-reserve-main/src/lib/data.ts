import rest1 from "@/assets/rest-1.jpg";
import rest2 from "@/assets/rest-2.jpg";
import rest3 from "@/assets/rest-3.jpg";
import rest4 from "@/assets/rest-4.jpg";
import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import dish4 from "@/assets/dish-4.jpg";

export const restaurants = [
  { id: "aurum", name: "Aurum", cuisine: "Modern European", location: "Downtown · New York", rating: 4.9, reviews: 1284, price: "$$$$", image: rest1, tags: ["Michelin", "Tasting Menu"] },
  { id: "kaiseki", name: "Kaiseki Mori", cuisine: "Japanese Omakase", location: "Soho · New York", rating: 4.8, reviews: 932, price: "$$$$", image: rest2, tags: ["Omakase", "Sake Pairing"] },
  { id: "lumiere", name: "Lumière", cuisine: "French Bistro", location: "West Village", rating: 4.7, reviews: 1567, price: "$$$", image: rest3, tags: ["Romantic", "Wine"] },
  { id: "altitude", name: "Altitude 57", cuisine: "Steakhouse", location: "Midtown · Rooftop", rating: 4.8, reviews: 2103, price: "$$$$", image: rest4, tags: ["Skyline", "Dry-Aged"] },
];

export const dishes = [
  { name: "Seared Hokkaido Scallops", chef: "Chef Antoine Laurent", image: dish1, price: "$48" },
  { name: "A5 Wagyu Reserve", chef: "Chef Marcus Vale", image: dish2, price: "$220" },
  { name: "Valrhona Gold Cube", chef: "Chef Émilie Dubois", image: dish3, price: "$32" },
  { name: "Omakase Selection", chef: "Chef Hiroshi Mori", image: dish4, price: "$185" },
];

export const testimonials = [
  { name: "Olivia Martin", role: "Food Critic, The Edge", quote: "An unforgettable evening — every plate told a story, and the service felt choreographed by candlelight.", rating: 5 },
  { name: "James Chen", role: "Frequent Diner", quote: "I book through this platform every weekend. The reservations always feel curated, never transactional.", rating: 5 },
  { name: "Sophia Reyes", role: "Travel Writer", quote: "From the rooftop in Manhattan to a hidden bistro in Paris — the best dining nights of my year started here.", rating: 5 },
];
