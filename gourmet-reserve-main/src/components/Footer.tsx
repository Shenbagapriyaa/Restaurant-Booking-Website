import { Instagram, Twitter, Facebook, UtensilsCrossed } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-gradient-gold grid place-items-center">
              <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
            </span>
            <span className="font-display text-2xl">Maison<span className="text-gradient-gold">.</span></span>
          </div>
          <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
            Curated reservations for the world's most memorable dining rooms. From rooftop steakhouses to hidden omakase counters.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full glass grid place-items-center hover:text-primary transition">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4">Discover</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/restaurants" className="hover:text-primary">Restaurants</Link></li>
            <li><Link to="/menu" className="hover:text-primary">Tonight's Menu</Link></li>
            <li><Link to="/reserve" className="hover:text-primary">Reservations</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">My Bookings</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>concierge@maison.com</li>
            <li>+1 (212) 555-0140</li>
            <li>Open daily · 9am — 11pm</li>
          </ul>
        </div>
      </div>
      <div className="hairline">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-muted-foreground flex justify-between">
          <span>© 2026 Maison Reservations. All rights reserved.</span>
          <span>Crafted with intention.</span>
        </div>
      </div>
    </footer>
  );
}
