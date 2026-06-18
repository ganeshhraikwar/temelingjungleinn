import React, { useState, useEffect } from "react";
import {
  Mail, Phone, MapPin, Compass, HelpCircle, Heart, Trees,
  MessageSquare, Star, CheckCircle, Quote, ArrowUpRight
} from "lucide-react";
import { TourPackage, Booking, SiteSettings } from "./types";
import { INITIAL_PACKAGES, INITIAL_BOOKINGS, INITIAL_SETTINGS } from "./data/initialData";

import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesPanel from "./components/ServicesPanel";
import PackagesGrid from "./components/PackagesGrid";
import TripPlanner from "./components/TripPlanner";
import BookingModal from "./components/BookingModal";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [packages, setPackages] = useState<TourPackage[]>(() => {
    const saved = localStorage.getItem("tji_packages");
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("tji_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem("tji_settings");
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedTourToBook, setSelectedTourToBook] = useState<TourPackage | null>(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  // Active FAQ and custom testimonials state
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Save changes to localstorage to guarantee durability
  useEffect(() => {
    localStorage.setItem("tji_packages", JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem("tji_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("tji_settings", JSON.stringify(settings));
  }, [settings]);

  // Sync simulated HTML <head> metadata elements on state changes for genuine SEO behavior
  useEffect(() => {
    if (settings.seoTitle) {
      document.title = settings.seoTitle;
    }
    
    // Attempt to set meta tags if present in DOM, otherwise write them
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', settings.seoDescription);

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', settings.seoKeywords);
  }, [settings]);

  // Handle a new booking from hero calculator or general packages
  const handleAddNewBooking = (newB: Partial<Booking>) => {
    const fullBooking: Booking = {
      id: `b_${Date.now()}`,
      packageName: newB.packageName || "Custom Day Trip Adventure",
      customerName: newB.customerName || "Un-named guest",
      customerEmail: newB.customerEmail || "customer@mail.com",
      customerPhone: newB.customerPhone || "0000000",
      travelDate: newB.travelDate || new Date().toISOString().split('T')[0],
      paxCount: newB.paxCount || 2,
      notes: newB.notes || "No notes provided.",
      whatsappMessageSent: true,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => [fullBooking, ...prev]);
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      q: "Where is Temeling Jungle Inn located, and how do we meet?",
      a: "Our hub is located near Toyapakeh / Sakti region in Nusa Penida, Bali. For all our guided tour packages, we arrange hassle-free pick-ups directly at Toyapakeh Harbour, Banjar Nyuh Harbour, or your local hotel lobby on Nusa Penida!"
    },
    {
      q: "Is mainland fastboat pick-up and return ticket included in tour rates?",
      a: "Yes! Most of our premium day tour programs (like the West and East Tour packages) explicitly include your round-trip Express Fastboat ticket booking from Sanur Harbour, Bali to Nusa Penida and back."
    },
    {
      q: "When and how do we make the payments? Do you ask for deposits?",
      a: "At Temeling Jungle Inn, we believe in 100% trust with travelers. We require ZERO prepayments or bank deposits for standard tours! You pay our driver-guides conveniently on the spot in IDR Cash, Card, or Wise transfer at the start of your experience."
    },
    {
      q: "What should we pack/wear for the Tembeling rainforest and Diamond Beach pool tour?",
      a: "Diamond Beach and Kelingking require mild trekking down steep dirt stairs, so we strongly advise supportive tennis shoes. Pack your swimwear, towels, dry-bags, high UV sunscreen, and mineral water. Changing cabins are close to Tembeling rockpool!"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafdfb] relative overflow-x-hidden flex flex-col justify-between">
      
      {/* 1. Header Banner Promotions */}
      {!isBannerDismissed && (
        <AnnouncementBar settings={settings} onClose={() => setIsBannerDismissed(true)} />
      )}

      {/* 2. Primary Navigation Bar */}
      <Navbar
        settings={settings}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Container switches between VISITOR or ADMIN MODE */}
      <main className="flex-grow">
        {isAdminMode ? (
          /* ============================================== */
          /* BACKOFFICE MANAGEMENT CENTER */
          /* ============================================== */
          <div className="bg-[#f0fbf6] min-h-screen">
            <AdminPanel
              packages={packages}
              bookings={bookings}
              settings={settings}
              onUpdatePackages={setPackages}
              onUpdateBookings={setBookings}
              onUpdateSettings={setSettings}
            />
          </div>
        ) : (
          /* ============================================== */
          /* VISITOR LUXURY HUB LANDING */
          /* ============================================== */
          <div className="animate-in fade-in duration-300">
            
            {/* A. Hero banner stage & quote calculator */}
            <Hero
              settings={settings}
              onNewBookingSubmission={handleAddNewBooking}
              onScrollToPackages={() => handleScrollToSection("packages")}
            />

            {/* B. Core Service highlights */}
            <ServicesPanel onScrollToPackages={() => handleScrollToSection("packages")} />

            {/* C. Cultural About Column: Tembeling & Local Roots */}
            <section className="py-20 lg:py-28 bg-white overflow-hidden scroll-mt-2">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Visual Col with circular offsets */}
                  <div className="lg:col-span-6 relative">
                    <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-emerald-500/10 blur-xl"></div>
                    <div className="absolute right-4 bottom-4 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl text-emerald-500"></div>
                    
                    <img
                      src="https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80"
                      alt="Tembeling Sacred jungle basin pool"
                      className="rounded-3xl shadow-xl w-full h-[320px] sm:h-[420px] object-cover relative z-10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-6 -right-6 bg-white border border-emerald-50 rounded-2xl p-4 shadow-lg hidden sm:flex items-center gap-3 relative z-20 max-w-[240px]">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0">
                        <Trees className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-800">Sustainable Tourism</p>
                        <p className="text-[10px] text-slate-400">Supporting Sakti village farmers & guides.</p>
                      </div>
                    </div>
                  </div>

                  {/* Copywriter Columns */}
                  <div className="lg:col-span-6 space-y-6 text-left">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 inline-block px-3 py-1 rounded-md">
                      Our Philosophy
                    </p>
                    <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-800 tracking-tight leading-tight">
                      The Sanctuary of Tembeling Sacred Jungle
                    </h2>
                    
                    <p className="text-slate-600 font-sans text-sm sm:text-md leading-relaxed">
                      Temeling Jungle Inn takes its beautiful name from the legendary, sacred forest of <strong>Tembeling</strong> located on Nusa Penida's south coast. This is a unique primal green rainforest hidden deep inside towering, windswept limestone cliffs. 
                    </p>
                    <p className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed">
                      Within this jungle lies the secret limestone rock pools of crystal-clear ocean freshwater. For generations, locals respected these waters for purification ceremonies. Booking with us means supporting locally operated shuttle drivers, native speedboat captains, and ocean ecologists protecting Penida’s marine nature parks.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <span className="font-display font-extrabold text-2xl text-emerald-700 block">100%</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Balinese Owned Team</span>
                      </div>
                      <div>
                        <span className="font-display font-extrabold text-2xl text-teal-700 block">零</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Prepayment Needed</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* D. Tour Catalog Grid */}
            <PackagesGrid
              packages={packages}
              settings={settings}
              onOpenBookingModal={(pkg) => setSelectedTourToBook(pkg)}
            />

            {/* E. Custom Trip Creator widget */}
            <TripPlanner settings={settings} />

            {/* F. Happy Customers / Real Feedback section */}
            <section id="testimonials" className="py-20 lg:py-28 bg-white overflow-hidden scroll-mt-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 inline-block px-3 py-1 bg-opacity-80 rounded-md">
                    verified feedback
                  </p>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 tracking-tight">
                    Smiles from Nusa Penida Adventurers
                  </h2>
                  <p className="text-slate-500 font-sans text-sm">
                    Read organic recommendations written by travelers who booked our island shuttles & private Ray snorkeling programs.
                  </p>
                </div>

                {/* Feedback masonry grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      name: "Alex & Julia Watson",
                      country: "Australia",
                      date: "May 2026",
                      review: "The Tembeling sacred pool pool is a hidden paradise! Our driver made the steep scooter jungle shuttle feel incredibly fun & safe. Pay on site policy was amazing. No pressure at Kelingking back trails either, he took 4K Instagram photos of us!",
                      rating: 5,
                      pkg: "Tembeling Jungle & Rock Pool Explorer"
                    },
                    {
                      name: "Kaito Takahashi",
                      country: "Japan",
                      date: "June 2026",
                      review: "Outstanding snorkeling! We saw five oceanic Giant Manta Rays swimming right next to Gamat Bay marine coral. Guide GoPro pictures arrived in our email just 4 hours after ocean return. Highly professional captain and clean vests.",
                      rating: 5,
                      pkg: "Manta Ray Snorkeling Safari"
                    },
                    {
                      name: "Clara G.",
                      country: "Germany",
                      date: "April 2026",
                      review: "I rented the SUV private driver shuttle to customized my own route for Diamond Beach. Guide was incredibly resourceful and spoke clean English. Highly recommended if you want to avoid Bali scooter accidents!",
                      rating: 5,
                      pkg: "Private Car & Local Guide"
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#fafdfb] rounded-3xl p-6 border border-emerald-50/70 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-4 text-left">
                        {/* Rating stars */}
                        <div className="flex items-center gap-1">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>

                        <p className="text-slate-600 font-sans text-sm italic leading-relaxed">
                          "{item.review}"
                        </p>
                      </div>

                      {/* Author */}
                      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-slate-400">{item.country} · {item.date}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100/60 rounded text-[10px] font-bold text-emerald-800 uppercase block tracking-wider">
                          Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* G. Accordion FAQs Section */}
            <section id="faq" className="py-20 lg:py-28 bg-[#f5faf7] scroll-mt-10 overflow-hidden relative">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16 space-y-3">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">FAQ Hub</p>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800">Frequently Answered Queries</h2>
                  <p className="text-slate-500 font-sans text-sm">Need help with fastboat timings or payment pathways? We got you.</p>
                </div>

                {/* Accordion List */}
                <div className="space-y-4">
                  {faqs.map((faq, idx) => {
                    const isOpen = activeFaq === idx;
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl border border-emerald-50 overflow-hidden text-left shadow-xs transition duration-300"
                      >
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : idx)}
                          className="w-full px-6 py-4.5 font-bold text-sm sm:text-md text-slate-800 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                        >
                          <span className="pr-4">{faq.q}</span>
                          <span className={`w-5 h-5 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}>
                            ▼
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-500 font-sans leading-relaxed border-t border-slate-50 animate-in fade-in duration-200">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 text-center bg-white border border-emerald-50/60 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#059669] shrink-0" />
                    <span>Have other customized questions regarding Penida roads or child safety?</span>
                  </div>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}`}
                    target="_blank"
                    className="px-4 py-2 bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 rounded-xl hover:bg-emerald-100 transition"
                  >
                    Ask guide on WhatsApp 💬
                  </a>
                </div>

              </div>
            </section>

          </div>
        )}
      </main>

      {/* 3. Global Public Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/5 pb-10 mb-8 text-left">
          
          {/* Col 1 Brand specs */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-display font-extrabold text-lg leading-none">Temeling Jungle Inn</span>
                <span className="text-[10px] font-sans text-teal-400 font-medium">Nusa Penida Tour & Transit</span>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm max-w-sm leading-relaxed">
              Explore Nusa Penida’s emerald marine natural pools, high cliff panoramas, and snorkel Giant oceanic Rays under native, hospitable Balinese guidance. No downpayments required.
            </p>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-[#34d399] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>WhatsApp Reservation gateway active</span>
            </span>
          </div>

          {/* Col 2 Quick sitemap */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-semibold text-xs tracking-wider text-emerald-400 uppercase">Interactive Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => handleScrollToSection("packages")} className="hover:text-emerald-300 transition text-left cursor-pointer">
                  Island Packages (.html sitemap)
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection("services")} className="hover:text-emerald-300 transition text-left cursor-pointer">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection("planner")} className="hover:text-emerald-300 transition text-left cursor-pointer">
                  Custom Day-itinerary Creator
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection("testimonials")} className="hover:text-emerald-300 transition text-left cursor-pointer">
                  Reviews & Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection("faq")} className="hover:text-emerald-300 transition text-left cursor-pointer">
                  Client FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 Contacts */}
          <div className="md:col-span-4 space-y-3 font-sans">
            <h4 className="font-display font-semibold text-xs tracking-wider text-emerald-400 uppercase font-sans">Contact Center Sakti</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-[#34d399] shrink-0 mt-0.5" />
                <span className="leading-snug text-slate-300">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-[#34d399] shrink-0" />
                <span className="text-slate-300">{settings.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-[#34d399] shrink-0" />
                <a href={`https://wa.me/${settings.whatsappNumber}`} className="text-[#34d399] font-semibold font-mono hover:underline">
                  +{settings.whatsappNumber} (Direct Chat)
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Outer credit lines avoiding telemetries */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-[10.5px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Temeling Jungle Inn Penida. Proudly supporting local Bali eco-tourism. Suksma!</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsAdminMode(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hover:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Backoffice Dashboard System</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">Sitemap Friendly</a>
          </div>
        </div>

      </footer>

      {/* Floating Active Booking Modal */}
      {selectedTourToBook && (
        <BookingModal
          tour={selectedTourToBook}
          settings={settings}
          onClose={() => setSelectedTourToBook(null)}
          onBookingSuccess={(b) => {
            handleAddNewBooking(b);
          }}
        />
      )}

    </div>
  );
}
export {};
