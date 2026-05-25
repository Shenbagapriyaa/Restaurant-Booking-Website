// Realistic premium data for database seeding
export const menuItemsData = [
  // Starters
  {
    foodName: "Hokkaido Scallop Crudo",
    foodImage: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
    category: "Starters",
    description: "yuzu, brown butter, finger lime, micro-herbs",
    price: 48,
    vegNonVeg: "nonVeg",
    spicyLevel: 0,
    bestseller: true,
    chefSpecial: true,
    rating: 4.9
  },
  {
    foodName: "Heritage Tomato & Burrata",
    foodImage: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675",
    category: "Starters",
    description: "aged balsamic glaze, basil oil, sourdough crisp",
    price: 22,
    vegNonVeg: "veg",
    spicyLevel: 0,
    bestseller: false,
    chefSpecial: false,
    rating: 4.7
  },
  {
    foodName: "Wagyu Steak Tartare",
    foodImage: "https://images.unsplash.com/photo-1544025162-d76694265947",
    category: "Starters",
    description: "cured egg yolk, capers, cornichons, warm sourdough toast",
    price: 32,
    vegNonVeg: "nonVeg",
    spicyLevel: 1,
    bestseller: true,
    chefSpecial: false,
    rating: 4.8
  },
  {
    foodName: "Crispy Paneer Bites",
    foodImage: "https://images.unsplash.com/photo-1567188040759-fb8a883db6d8",
    category: "Starters",
    description: "Mint chutney, spiced yogurt drizzle, micro cilantro",
    price: 16,
    vegNonVeg: "veg",
    spicyLevel: 1,
    bestseller: false,
    chefSpecial: false,
    rating: 4.6
  },
  
  // From the East
  {
    foodName: "Masala Dosa",
    foodImage: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976",
    category: "From the East",
    description: "crispy fermented lentil crêpe, spiced potato filling, coconut chutney, sambar",
    price: 18,
    vegNonVeg: "veg",
    spicyLevel: 1,
    bestseller: true,
    chefSpecial: false,
    rating: 4.9
  },
  {
    foodName: "Steamed Idli Platter",
    foodImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
    category: "From the East",
    description: "Soft steamed rice cakes served with tomato-peanut chutney and hot sambar",
    price: 14,
    vegNonVeg: "veg",
    spicyLevel: 0,
    bestseller: false,
    chefSpecial: false,
    rating: 4.5
  },
  {
    foodName: "Paneer Butter Masala",
    foodImage: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
    category: "From the East",
    description: "Rich cottage cheese cubes cooked in a velvety tomato-cashew cream gravy",
    price: 24,
    vegNonVeg: "veg",
    spicyLevel: 1,
    bestseller: true,
    chefSpecial: true,
    rating: 4.8
  },
  {
    foodName: "Lucknowi Chicken Biryani",
    foodImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
    category: "From the East",
    description: "Fragrant long-grain basmati rice layered with tender saffron chicken and rose water",
    price: 28,
    vegNonVeg: "nonVeg",
    spicyLevel: 2,
    bestseller: true,
    chefSpecial: true,
    rating: 4.9
  },
  {
    foodName: "Premium Omakase Nigiri",
    foodImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    category: "From the East",
    description: "Chef's daily selection of prime cut salmon, fatty bluefin tuna, uni, and seasonal imports",
    price: 185,
    vegNonVeg: "nonVeg",
    spicyLevel: 0,
    bestseller: false,
    chefSpecial: true,
    rating: 4.9
  },
  {
    foodName: "Spiced Chicken Shawarma",
    foodImage: "https://images.unsplash.com/photo-1524351199679-46cddf530c04",
    category: "From the East",
    description: "Slow-roasted marinated chicken, garlic toum, pickles wrapped in thin pita bread",
    price: 20,
    vegNonVeg: "nonVeg",
    spicyLevel: 1,
    bestseller: true,
    chefSpecial: false,
    rating: 4.7
  },

  // Mains
  {
    foodName: "A5 Wagyu Reserve",
    foodImage: "https://images.unsplash.com/photo-1544025162-d76694265947",
    category: "Mains",
    description: "miso glaze, charred allium bulbs, rich veal bone marrow reduction",
    price: 220,
    vegNonVeg: "nonVeg",
    spicyLevel: 0,
    bestseller: false,
    chefSpecial: true,
    rating: 5.0
  },
  {
    foodName: "Atlantic Turbot Fillet",
    foodImage: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    category: "Mains",
    description: "pan-roasted in brown butter, caper berries, charred lemon reduction",
    price: 68,
    vegNonVeg: "nonVeg",
    spicyLevel: 0,
    bestseller: false,
    chefSpecial: false,
    rating: 4.8
  },
  {
    foodName: "Tagliolini al Tartufo",
    foodImage: "https://images.unsplash.com/photo-1612874742237-6526221588e3",
    category: "Mains",
    description: "Fresh hand-cut tagliolini tossed in rich alpine butter and fresh shaved white truffles",
    price: 95,
    vegNonVeg: "veg",
    spicyLevel: 0,
    bestseller: true,
    chefSpecial: true,
    rating: 4.9
  },
  {
    foodName: "Wood-Fired Margherita Pizza",
    foodImage: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    category: "Mains",
    description: "San Marzano tomatoes, fresh buffalo mozzarella, aromatic basil, extra virgin olive oil",
    price: 24,
    vegNonVeg: "veg",
    spicyLevel: 0,
    bestseller: true,
    chefSpecial: false,
    rating: 4.8
  },
  {
    foodName: "Gourmet Truffle Burger",
    foodImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    category: "Mains",
    description: "Dry-aged wagyu beef patty, black truffle aioli, gruyère cheese, brioche bun, hand-cut fries",
    price: 28,
    vegNonVeg: "nonVeg",
    spicyLevel: 0,
    bestseller: true,
    chefSpecial: false,
    rating: 4.7
  },

  // Desserts
  {
    foodName: "Valrhona Gold Cube",
    foodImage: "https://images.unsplash.com/photo-1587314168485-3236d6710814",
    category: "Desserts",
    description: "70% dark single-origin chocolate mousse, raspberry compote core, edible gold leaf layering",
    price: 32,
    vegNonVeg: "veg",
    spicyLevel: 0,
    bestseller: true,
    chefSpecial: true,
    rating: 4.9
  },
  {
    foodName: "Wild Honey Tarte",
    foodImage: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd",
    category: "Desserts",
    description: "Comb honey, whipped organic mascarpone cheese, toasted walnut crust base",
    price: 24,
    vegNonVeg: "veg",
    spicyLevel: 0,
    bestseller: false,
    chefSpecial: false,
    rating: 4.7
  },
  
  // Drinks / Mocktails
  {
    foodName: "Gold Dust Mojito",
    foodImage: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd",
    category: "Mocktails",
    description: "Fresh lime, crushed mint leaves, cane sugar, sparkling water, dusted with fine edible gold flakes",
    price: 16,
    vegNonVeg: "veg",
    spicyLevel: 0,
    bestseller: true,
    chefSpecial: false,
    rating: 4.8
  },
  {
    foodName: "Saffron Rose Elixir",
    foodImage: "https://images.unsplash.com/photo-1536935338788-846bb9981813",
    category: "Mocktails",
    description: "Infused rose water, saffron syrup, lime splash, fresh rose petals, premium tonic",
    price: 18,
    vegNonVeg: "veg",
    spicyLevel: 0,
    bestseller: false,
    chefSpecial: true,
    rating: 4.9
  }
];

export const restaurantsData = [
  {
    restaurantName: "Aurum",
    cuisineType: "Modern European",
    regionCategory: "European",
    restaurantImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    galleryImages: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
    ],
    description: "A destination dining room where seasonal European technique meets quiet luxury. Our open kitchen brings you face-to-face with the craft — expect produce-led tasting menus, a 600-label wine cellar, and a service team that remembers your name on a second visit.",
    location: "Downtown · New York",
    openingHours: "5pm – 11pm",
    ratings: 4.9,
    reviews: 1284,
    priceRange: "$$$$",
    featured: true,
    trending: true,
    // Menus will be mapped during seeding
    menuItems: []
  },
  {
    restaurantName: "Kaiseki Mori",
    cuisineType: "Japanese Omakase",
    regionCategory: "Asian",
    restaurantImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    galleryImages: [
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252",
      "https://images.unsplash.com/photo-1582450871972-ab5ca641643d"
    ],
    description: "An intimate, 8-seat Japanese counter experience where high-grade seasonal imports are crafted before you. Our menu features a curated sake pairing and is prepared by Chef Hiroshi Mori according to strict kaiseki guidelines.",
    location: "Soho · New York",
    openingHours: "6pm – 11:30pm",
    ratings: 4.8,
    reviews: 932,
    priceRange: "$$$$",
    featured: true,
    trending: false,
    menuItems: []
  },
  {
    restaurantName: "Lumière",
    cuisineType: "French Bistro",
    regionCategory: "European",
    restaurantImage: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c",
    galleryImages: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b"
    ],
    description: "A candle-lit sanctuary in West Village. Offering a classic French dining experience with a modern aesthetic, complete with a carefully curated French wine list and cozy window seating arrangements.",
    location: "West Village · New York",
    openingHours: "5pm – 11pm",
    ratings: 4.7,
    reviews: 1567,
    priceRange: "$$$",
    featured: false,
    trending: true,
    menuItems: []
  },
  {
    restaurantName: "Altitude 57",
    cuisineType: "Steakhouse",
    regionCategory: "American",
    restaurantImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    galleryImages: [
      "https://images.unsplash.com/photo-1544025162-d76694265947",
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368"
    ],
    description: "Enjoy a breathtaking skyline dining experience on our luxury rooftop lounge. Featuring premier USDA dry-aged steaks, custom mocktails, and a bustling metropolitan view.",
    location: "Midtown · Rooftop NYC",
    openingHours: "5pm – midnight",
    ratings: 4.8,
    reviews: 2103,
    priceRange: "$$$$",
    featured: false,
    trending: true,
    menuItems: []
  }
];
