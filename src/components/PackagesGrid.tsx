import React, { useState } from "react";
import { Star, MapPin, CheckCircle, Clock, ArrowRight, ShieldCheck, HelpCircle, X, ExternalLink } from "lucide-react";
import { TourPackage, SiteSettings, Booking } from "../types";

interface PackagesGridProps {
  packages: TourPackage[];
  settings: SiteSettings;
  onOpenBookingModal: (pkg: TourPackage) => void;
}

export default function PackagesGrid({ packages, settings, onOpenBookingModal }: PackagesGridProps) {
  const [activeTab, setActiveTab] = useState<"all" | "island-tour" | "transportation" | "fastboat">("all");
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);

  const filteredPackages = activeTab === "all"
    ? packages
    : packages.filter(pkg => pkg.category === activeTab);

  const getIDREquivalent = (usd: number) => {
    // Standard Balinese rate e.g. 1 USD = 16,000 IDR
    return (usd * 16000).toLocaleString("id-ID");
  };

  return (
    <section id="packages" className="py-20 lg:py-28 bg-[#fafdfb] scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <p className="text-xs font-bold text-[#059669] uppercase tracking-widest bg-emerald-100/60 inline-block px-3 py-1 bg-opacity-70 rounded-md">
              Perfect Choice
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 tracking-tight leading-tight">
              Curated Island Travel Packages
            </h2>
            <p className="text-slate-500 font-sans text-sm max-w-xl">
              Select one of our standard adventures or custom rentals. WhatsApp concierge available 18/7 for planning.
            </p>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Show All Packages" },
              { id: "island-tour", label: "Island Tours" },
              { id: "transportation", label: "Transport Car Rent" },
              { id: "fastboat", label: "Fastboats" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 max-w-md mx-auto space-y-3">
            <p className="font-semibold text-slate-700">No active packages in this filter</p>
            <p className="text-xs text-slate-400">Head over to the admin panel to add some!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl overflow-hidden border-x border-t border-b-[8px] border-slate-200 hover:border-b-[#059669] shadow-[0_8px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(4,120,87,0.14)] hover:-translate-y-2.5 transition-all duration-300 flex flex-col justify-between group relative ${
                  pkg.isPopular ? "ring-2 ring-amber-400 ring-offset-2" : ""
                }`}
              >
                {/* Popularity Banner */}
                {pkg.isPopular && (
                  <span className="absolute left-4 top-4 z-10 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-xl shadow-[0_4px_10px_rgba(245,158,11,0.3)] animate-pulse-subtle border-b-2 border-amber-800">
                    🔥 Highly Recommended
                  </span>
                )}

                {/* Package Thumbnail */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  
                  {/* Category Pill Overlaid */}
                  <span className="absolute right-4 bottom-4 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-lg text-[10px] font-bold uppercase text-emerald-800 tracking-wider shadow-sm border border-emerald-50">
                    {pkg.category.replace("-", " ")}
                  </span>
                </div>

                {/* Card Content body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header: Title & Reviews */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded-md text-[11px] shadow-xs border border-amber-100">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{pkg.rating}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-sans">({pkg.reviewsCount} verified reviews)</span>
                      </div>

                      <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 group-hover:text-emerald-700 tracking-tight transition-colors">
                        {pkg.title}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Quick Specs */}
                    <div className="border-y border-dashed border-slate-100 py-3.5 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-sans">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono font-bold text-[#047857]">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Local Driver Inclusive</span>
                      </div>
                    </div>

                    {/* Sights Visited */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Highlights Include:</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.spots.map((spot, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold text-slate-600 bg-slate-50/80 border border-slate-100/60 rounded-lg px-2.5 py-1 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-default"
                          >
                            {spot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action buttons */}
                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Per Person</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold font-display text-slate-800">${pkg.price}</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase">USD</span>
                      </div>
                      <p className="text-[10px] text-[#059669] font-bold font-mono" title="Based on current daily course">
                        💵 ~Rp {getIDREquivalent(pkg.price)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => onOpenBookingModal(pkg)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-[0_4px_10px_rgba(16,185,129,0.2)] border-x border-t border-b-4 border-emerald-800 hover:border-b-2 active:border-b-0 active:translate-y-[4px] hover:translate-y-[2px] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book Tour</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="px-4 py-1 text-center text-slate-500 hover:text-emerald-700 font-bold text-xs hover:underline transition duration-200"
                      >
                        See Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Package Modal Backdrop */}
        {selectedPackage && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in zoom-in duration-200">
              
              {/* Modal Image Header */}
              <div className="relative h-64 sm:h-72">
                <img
                  src={selectedPackage.image}
                  alt={selectedPackage.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="absolute right-4 top-4 p-2 bg-slate-900/60 hover:bg-slate-900/90 text-white rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <span className="px-2 py-0.5 bg-emerald-500 rounded text-[10px] font-bold uppercase tracking-wider inline-block mb-2">
                    {selectedPackage.category.replace("-", " ")}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight">
                    {selectedPackage.title}
                  </h3>
                  <p className="text-slate-200 text-xs sm:text-sm mt-1 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-emerald-300" />
                    <span>Duration: {selectedPackage.duration}</span>
                  </p>
                </div>
              </div>

              {/* Modal Details Scroll Body */}
              <div className="p-6 sm:p-8 space-y-6 text-left">
                
                {/* Intro Description */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-slate-800 uppercase tracking-widest">Experience Description</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-sans">{selectedPackage.description}</p>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Sights Visited */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Destinations / Sights Visited:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedPackage.spots.map((spot, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-100/80 rounded-xl p-3 text-xs text-slate-700 font-semibold shadow-inner">
                        <span className="w-5 h-5 bg-emerald-400 text-emerald-950 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span>{spot}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Inclusions */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-800 uppercase tracking-widest">What's Inclusive in Price:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPackage.included.map((inc, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Guidelines Section */}
                <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>Important Visitor Preparation</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Bali island sun can be very warm! We highly advise you to wear comfortable shoes for cliff stairways (e.g. Kelingking & Diamond Beach), pack your swimsuits, a dry-bag, sunscreen of high factor, and a portable battery. We pay for all entrance ticket tokens.
                  </p>
                </div>

                {/* Pay on site trust */}
                <p className="text-[11px] text-amber-600 text-center font-medium">
                  🔒 Secure Direct Booking Policy: No deposits or credit card details needed. Cancel freely if plans change.
                </p>

                {/* Modal Footer Controls */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Grand Fare Total:</span>
                    <span className="text-2xl font-extrabold text-[#047857]">${selectedPackage.price} USD</span>
                    <span className="text-xs text-slate-500 font-bold ml-1">/ Pax</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPackage(null)}
                      className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-xl transition"
                    >
                      Close Details
                    </button>
                    <button
                      onClick={() => {
                        onOpenBookingModal(selectedPackage);
                        setSelectedPackage(null);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1"
                    >
                      <span>Book Direct Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
