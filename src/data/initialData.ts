import { TourPackage, Booking, SiteSettings } from "../types";

export const INITIAL_PACKAGES: TourPackage[] = [
  {
    id: "pkg_west_tour",
    title: "Nusa Penida West Coast Day Tour",
    description: "Witness the iconic cliffs and blue lagoons of western Nusa Penida. This comprehensive package includes private transport, local guiding, and tickets to all sights.",
    duration: "Full Day (8-10 Hours)",
    price: 45,
    category: "island-tour",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    spots: ["Kelingking Beach (T-Rex Cliff)", "Broken Beach (Pasih Uug)", "Angel's Billabong (Natural Pool)", "Crystal Bay Sunset"],
    included: [
      "AC Private SUV Cruiser",
      "Experienced English-speaking Driver-Guide",
      "Fastboat return ticket (Sanur - Penida - Sanur)",
      "Traditional Balinese Indonesian Lunch",
      "Entrance fees & parking permits",
      "Chilled Mineral Water"
    ],
    rating: 4.9,
    reviewsCount: 142,
    isPopular: true
  },
  {
    id: "pkg_east_tour",
    title: "Nusa Penida East Coast Paradise",
    description: "Explore the wilder cliff edges, legendary beaches, and scenic viewpoint treehouses of Nusa Penida's pristine eastern coastline.",
    duration: "Full Day (8-10 Hours)",
    price: 48,
    category: "island-tour",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    spots: ["Diamond Beach (White Sand Cliffs)", "Atuh Beach (Rock Arch)", "Thousand Islands Viewpoint (Pulau Seribu)", "Rumah Pohon Tree House photo-op"],
    included: [
      "AC Private SUV Cruiser",
      "Local Driver & Photographer",
      "Fastboat return ticket (Sanur - Penida)",
      "Vibrant beachfront lunch set",
      "Entrance tickets",
      "Fresh coconuts at the beach"
    ],
    rating: 4.8,
    reviewsCount: 98,
    isPopular: false
  },
  {
    id: "pkg_tembeling",
    title: "Tembeling Forest & Rock Pool Explorer",
    description: "Venture deep into the mysterious native rainforest of Tembeling. Swim in the clear emerald freshwater pools on the cliff's edge and discover secret caves.",
    duration: "Half Day (6 Hours)",
    price: 35,
    category: "island-tour",
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80",
    spots: ["Tembeling Primary Rainforest Resort", "Tembeling Sacred Freshwater Swimming Pool", "Peguyangan Spring overlook", "Banah Cliff panorama"],
    included: [
      "Rugged 4x4 or specialized Scooter Shuttle",
      "Indigenous Jungle Guide",
      "Traditional Balinese snack pack",
      "Entrance donation & temple custom sashes",
      "Mineral water"
    ],
    rating: 4.95,
    reviewsCount: 76,
    isPopular: true
  },
  {
    id: "pkg_snorkeling",
    title: "Manta Ray Snorkeling Safari",
    description: "Swim with majestic Giant Oceanic Manta Rays and explore the colorful coral walls of Nusa Penida’s surrounding marine sanctuaries.",
    duration: "Half Day (5 Hours)",
    price: 38,
    category: "island-tour",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    spots: ["Manta Point (Ray Sanctuary)", "Gamat Bay (Coral Garden)", "Wall Bay (Drift Snorkel)", "Crystal Bay Reefs"],
    included: [
      "Shared Tour Speedboat with captain",
      "Professional Snorkeling Guide",
      "High-end snorkel, mask, fins, & lifejacket",
      "Underwater GoPro photoshoot (files included!)",
      "Light fruits & drinks onboard",
      "Marine park insurance"
    ],
    rating: 4.85,
    reviewsCount: 215,
    isPopular: true
  },
  {
    id: "pkg_shuttle",
    title: "Nusa Penida Private Car & Local Driver",
    description: "Rent your own private vehicle and create your custom itinerary. Travel at your own pace with a friendly local expert driver who knows the island's secret shortcuts.",
    duration: "Full Day (10 Hours)",
    price: 55,
    category: "transportation",
    image: "https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&w=800&q=80",
    spots: ["Custom Tour - Your choice of any west, east, or south sights"],
    included: [
      "Private Air-Conditioned SUV (fits up to 6 passengers)",
      "Fuel/Petrol fully included",
      "Expert island driver-guide",
      "Parking fees & toll charges",
      "Flexible schedule and custom routing"
    ],
    rating: 4.9,
    reviewsCount: 84,
    isPopular: false
  },
  {
    id: "pkg_fastboat",
    title: "Express Fastboat Tickets (Sanur ⇄ Nusa Penida)",
    description: "Book return fastboat tickets on the safest and fastest modern cruisers. Daily comfortable 30-minute ocean crossing between Bali mainland and Nusa Penida.",
    duration: "30-Minute Ocean Cross",
    price: 25,
    category: "fastboat",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    spots: ["Departure Sanur: 08:30, 11:00, 14:00", "Departure Penida: 09:30, 13:00, 17:00"],
    included: [
      "Direct return fastboat tickets",
      "Luggage handling & porter support",
      "Air-conditioned interior cabin & sound system",
      "Insurance and safety vests",
      "Hotel pick-up discount voucher in Sanur"
    ],
    rating: 4.75,
    reviewsCount: 310,
    isPopular: false
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: "Temeling Jungle Inn",
  tagline: "Your Ultimate Gateway to Nusa Penida's Hidden Paradise",
  seoTitle: "Temeling Jungle Inn | Best Nusa Penida Tour Guide & Fastboats",
  seoDescription: "Book Nusa Penida island tours, fastboat tickets from Sanur, private car rentals, and snorkeling with Manta Rays. Experience Bali's jungle paradise with local guides.",
  seoKeywords: "Nusa Penida tour, Temeling Jungle, Tembeling beach pool, fastboat sanur penida, kelingking beach, diamond beach, manta snorkeling",
  whatsappNumber: "6282146950275", // Real Indonesia Balinese format number,
  fastboatPriceOneWay: 14,
  fastboatPriceReturn: 25,
  announcementText: "🏝️ Summer Promo Available: Save 10% on combined Snorkeling & West Tour packages! Tap Book Now.",
  isAnnouncementActive: true,
  address: "Sakti, Nusa Penida, Klungkung Regency, Bali 80771, Indonesia",
  email: "hello@temelingjungleinn.com"
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "b_1",
    packageName: "Nusa Penida West Coast Day Tour",
    customerName: "Sarah Miller",
    customerEmail: "sarah.m@traveler.com",
    customerPhone: "+61412345678",
    travelDate: "2026-06-25",
    paxCount: 2,
    notes: "Pickup from Sanur harbour, looking forward to Kelingking!",
    whatsappMessageSent: true,
    status: "confirmed",
    createdAt: "2026-06-15T09:30:00.000Z"
  },
  {
    id: "b_2",
    packageName: "Manta Ray Snorkeling Safari",
    customerName: "Hiroshi Sato",
    customerEmail: "sato.hiro@tokyomail.jp",
    customerPhone: "+819012345678",
    travelDate: "2026-06-28",
    paxCount: 4,
    notes: "Need prescription snorkel mask if possible.",
    whatsappMessageSent: true,
    status: "pending",
    createdAt: "2026-06-17T14:45:00.000Z"
  },
  {
    id: "b_3",
    packageName: "Express Fastboat Tickets (Sanur ⇄ Nusa Penida)",
    customerName: "Emma Lefevre",
    customerEmail: "emma.lefe@holiday.fr",
    customerPhone: "+33612345678",
    travelDate: "2026-06-18",
    paxCount: 1,
    notes: "One way ticket only please.",
    whatsappMessageSent: false,
    status: "completed",
    createdAt: "2026-06-16T11:15:00.000Z"
  },
  {
    id: "b_4",
    packageName: "Nusa Penida East Coast Paradise",
    customerName: "Michael Chang",
    customerEmail: "m.chang@singmail.sg",
    customerPhone: "+6591234567",
    travelDate: "2026-07-02",
    paxCount: 3,
    notes: "Need child seat for a 4-year old.",
    whatsappMessageSent: true,
    status: "pending",
    createdAt: "2026-06-17T20:00:00.000Z"
  }
];
