/**
 * Single source of truth for Tour Categories across TravelKo
 */

export const TOUR_CATEGORIES = [
  "Mountain Climbing",
  "Island Hopping",
  "Scuba Diving",
  "Camping",
  "Hiking",
  "Nature & Cultural",
  "Adventure & Extreme",
  "Beach & Relaxation",
];

export const CATEGORY_DETAILS = [
  {
    name: "Mountain Climbing",
    slug: "mountain-climbing",
    image: "/adventures/mountain-climbing.jpg",
    description: "Conquer scenic summits, volcanic peaks, and stunning seas of clouds.",
  },
  {
    name: "Island Hopping",
    slug: "island-hopping",
    image: "/adventures/island-hopping.jpg",
    description: "Cruise across pristine lagoons, hidden coves, and karst limestone islands.",
  },
  {
    name: "Scuba Diving",
    slug: "scuba-diving",
    image: "/adventures/scuba-diving.jpg",
    description: "Discover world-class coral reefs, marine sanctuaries, and vibrant sea life.",
  },
  {
    name: "Camping",
    slug: "camping",
    image: "/adventures/camping.jpg",
    description: "Camp beneath the stars along scenic coastal coves and tranquil ridges.",
  },
  {
    name: "Hiking",
    slug: "hiking",
    image: "/adventures/hiking.jpg",
    description: "Trek scenic mountain trails, lush jungles, and hidden waterfalls.",
  },
  {
    name: "Nature & Cultural",
    slug: "nature-cultural",
    image: "/adventures/nature-cultural.jpg",
    description: "Experience ancient rice terraces, historic towns, and rich local heritage.",
  },
  {
    name: "Adventure & Extreme",
    slug: "adventure-extreme",
    image: "/adventures/adventure-extreme.jpg",
    description: "Get adrenaline pumping with canyoneering, cliff jumping, and white-water rapids.",
  },
  {
    name: "Beach & Relaxation",
    slug: "beach-relaxation",
    image: "/adventures/beach-relaxation.jpg",
    description: "Unwind on powdery white sand beaches and idyllic coastal escapes.",
  },
];

export const CATEGORY_IMAGE_MAP = CATEGORY_DETAILS.reduce((acc, cat) => {
  acc[cat.name] = cat.image;
  return acc;
}, {});

// Alias mapping to normalize legacy, abbreviated, or alternative category names in DB
const CATEGORY_ALIASES = {
  "beach": "Beach & Relaxation",
  "beaches": "Beach & Relaxation",
  "beach & relaxation": "Beach & Relaxation",
  "beach and relaxation": "Beach & Relaxation",
  "relaxation": "Beach & Relaxation",

  "adventure": "Adventure & Extreme",
  "extreme": "Adventure & Extreme",
  "adventure & extreme": "Adventure & Extreme",
  "adventure and extreme": "Adventure & Extreme",

  "heritage": "Nature & Cultural",
  "culture": "Nature & Cultural",
  "cultural": "Nature & Cultural",
  "nature": "Nature & Cultural",
  "nature & cultural": "Nature & Cultural",
  "nature and cultural": "Nature & Cultural",

  "mountain": "Mountain Climbing",
  "mountain climbing": "Mountain Climbing",
  "mountaineering": "Mountain Climbing",

  "island": "Island Hopping",
  "island hopping": "Island Hopping",
  "islands": "Island Hopping",

  "scuba": "Scuba Diving",
  "scuba diving": "Scuba Diving",
  "diving": "Scuba Diving",

  "camping": "Camping",

  "hiking": "Hiking",
  "trekking": "Hiking",
};

/**
 * Returns the standardized canonical category name for any input or legacy DB string
 */
export const getCanonicalCategory = (categoryName) => {
  if (!categoryName || typeof categoryName !== "string") return "Beach & Relaxation";
  const normalized = categoryName.trim().toLowerCase();

  if (CATEGORY_ALIASES[normalized]) {
    return CATEGORY_ALIASES[normalized];
  }

  const matched = TOUR_CATEGORIES.find((cat) => {
    const cNorm = cat.toLowerCase();
    return cNorm.includes(normalized) || normalized.includes(cNorm);
  });

  return matched || categoryName;
};

/**
 * Returns the curated 16:9 photography image for any category or tour category string
 */
export const getCategoryImage = (categoryName) => {
  const canonical = getCanonicalCategory(categoryName);
  return CATEGORY_IMAGE_MAP[canonical] || "/adventures/mountain-climbing.jpg";
};
