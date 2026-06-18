export interface TourPackage {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "Full Day (8-10 Hours)"
  price: number; // in USD or IDR (e.g., 50 USD/Pax)
  category: "island-tour" | "transportation" | "fastboat";
  image: string;
  spots: string[]; // key attractions visited
  included: string[]; // e.g., "Lunch", "English Speaking Guide", "Mineral Water", "AC Car"
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
}

export interface Booking {
  id: string;
  packageName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  paxCount: number;
  notes?: string;
  whatsappMessageSent: boolean;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  whatsappNumber: string; // e.g., "+628123456789"
  fastboatPriceOneWay: number;
  fastboatPriceReturn: number;
  announcementText: string;
  isAnnouncementActive: boolean;
  address: string;
  email: string;
}

export interface SiteStats {
  views: number;
  bookingsCount: number;
  revenue: number;
  conversionRate: number;
}
