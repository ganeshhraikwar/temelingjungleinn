import React, { useState } from "react";
import { Compass, Calendar, Users, HelpCircle, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { SiteSettings, Booking } from "../types";

interface HeroProps {
  settings: SiteSettings;
  onNewBookingSubmission: (booking: Partial<Booking>) => void;
  onScrollToPackages: () => void;
}

export default function Hero({ settings, onNewBookingSubmission, onScrollToPackages }: HeroProps) {
  const [date, setDate] = useState("");
  const [pax, setPax] = useState(2);
  const [selectedService, setSelectedService] = useState("pkg_west_tour");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingCalculated, setBookingCalculated] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState<{ pricePerPax: number; total: number; title: string } | null>(null);

  const serviceOptions = [
    { id: "pkg_west_tour", title: "West Coast Day Tour", price: 45 },
    { id: "pkg_east_tour", title: "East Coast Paradise", price: 48 },
    { id: "pkg_tembeling", title: "Tembeling Jungle Secret Pool", price: 35 },
    { id: "pkg_snorkeling", title: "Manta Ray Snorkeling Safari", price: 38 },
    { id: "pkg_shuttle", title: "Private SUV Car & Driver", price: 55 },
  ];

  const handleCalculateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !date) {
      alert("Please fill in your Name, Phone Number, and Preferred Travel Date!");
      return;
    }

    const service = serviceOptions.find((s) => s.id === selectedService) || serviceOptions[0];
    
    // Private car rental price is flat up to 6 people, others are per-person
    const pricePerPax = service.price;
    const isFlatRate = selectedService === "pkg_shuttle";
    const total = isFlatRate ? pricePerPax : pricePerPax * pax;

    setQuoteDetails({
      pricePerPax,
      total,
      title: service.title,
    });
    setBookingCalculated(true);

    // Record booking state to global/localStorage state (which populates Admin panel!)
    onNewBookingSubmission({
      packageName: service.title,
      customerName,
      customerEmail: `${customerName.toLowerCase().replace(/\s+/g, "")}@example.com`,
      customerPhone,
      travelDate: date,
      paxCount: pax,
      notes: "Generated via Instant Hero Quote module.",
      status: "pending",
    });
  };

  const handleLaunchWhatsApp = () => {
    if (!quoteDetails) return;
    const message = `Hello Temeling Jungle Inn! 🌴\n\nI'd like to book the following tour:\n📍 *${quoteDetails.title}*\n📅 Date: ${date}\n👥 People: ${pax} pax\n👤 Booking Name: ${customerName}\n📱 Phone: ${customerPhone}\n\n💵 Total Quote: $${quoteDetails.total} USD.\nPlease confirm availability! Thank you.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encoded}`, "_blank");
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-[85vh] bg-slate-900 flex items-center justify-center py-12 lg:py-20 px-4 overflow-hidden">
      {/* Background Hero Image with Deep Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80"
          alt="Nusa Penida Beach and Tropical Palms"
          className="w-full h-full object-cover object-center opacity-45 scale-105 animate-subtle-pulse"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/40"></div>
        {/* Decorative jungle elements */}
        <div className="absolute -left-16 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-16 top-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Pillar: Slogans & Badges */}
        <div className="lg:col-span-7 text-white text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Local Nusa Penida Specialist</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            Escape to the Jungle & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              Ocean Marvels
            </span>{" "}
            of Bali
          </h1>

          <p className="text-slate-300 text-md sm:text-lg max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed">
            {settings.tagline}. Discover the magical Tembeling natural pool, hike the legendary Kelingking cliff, and swim alongside wild Giant Manta Rays.
          </p>

          {/* Core Trust Seals */}
          <div className="grid grid-cols-3 gap-4 pt-4 max-w-md mx-auto lg:mx-0 text-left">
            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-3.5 flex items-center gap-2.5">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-sm leading-tight">4.95 ★</p>
                <p className="text-[10px] text-slate-400">200+ Reviews</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-3.5 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-sm leading-tight">No Deposit</p>
                <p className="text-[10px] text-slate-400">Pay on Tour Day</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-3.5 flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <p className="font-semibold text-sm leading-tight">Local Guide</p>
                <p className="text-[10px] text-slate-400">Native Driver</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6">
            <button
              onClick={onScrollToPackages}
              className="pushable-btn-action"
            >
              <span className="pushable-btn-shadow"></span>
              <span className="pushable-btn-edge"></span>
              <span className="pushable-btn-front flex items-center gap-2">
                <span>Explore Tour Packages</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            <a
              href="#services"
              className="pushable-btn-action"
            >
              <span className="pushable-btn-shadow"></span>
              <span className="pushable-btn-edge"></span>
              <span className="pushable-btn-front pushable-btn-sec-front flex items-center gap-1.5">
                <span>View Our Services</span>
              </span>
            </a>
          </div>
        </div>

        {/* Right Pillar: Interactive Quote Calculator Widget */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-[0_25px_60px_rgba(4,120,87,0.18)] overflow-hidden text-slate-800 border-x border-t border-b-8 border-slate-200 hover:border-b-emerald-600 transition-all duration-300 relative">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-lg">Instant Booking Quote</h3>
                <p className="text-xs text-emerald-100">Calculate rates & chat with guide</p>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/15 rounded-md text-emerald-100">
                Live Rate
              </span>
            </div>

            {!bookingCalculated ? (
              <form onSubmit={handleCalculateQuote} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. David Beckham"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 text-sm transition-colors shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Travel Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 text-sm transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Guests (Pax)</label>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-inner">
                      <button
                        type="button"
                        onClick={() => setPax(Math.max(1, pax - 1))}
                        className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border-r border-slate-200 text-slate-600 text-sm font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-semibold text-slate-700 text-sm select-none">{pax}</span>
                      <button
                        type="button"
                        onClick={() => setPax(Math.min(12, pax + 1))}
                        className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border-l border-slate-200 text-slate-600 text-sm font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Service Package</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 text-sm transition-colors shadow-inner"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.title} (${opt.price} USD)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">WhatsApp Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +6141234567 or +6281234..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 text-sm transition-colors shadow-inner"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="pushable-btn-action w-full"
                  >
                    <span className="pushable-btn-shadow"></span>
                    <span className="pushable-btn-edge"></span>
                    <span className="pushable-btn-front py-3 flex items-center justify-center gap-2">
                      <span>Verify Quote & Book ✨</span>
                    </span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-[0_4px_15px_rgba(16,185,129,0.15)] border border-emerald-100">
                  <Star className="w-8 h-8 fill-emerald-500 text-emerald-500" />
                </div>

                <div>
                  <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">Rate Generated Successfully</p>
                  <h4 className="font-display font-extrabold text-2xl text-slate-800 mt-1">{quoteDetails?.title}</h4>
                  <p className="text-slate-500 text-xs mt-1">Date: {date} · Group size: {pax} Pax</p>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 max-w-sm mx-auto shadow-inner relative">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Base Fare Per Person</span>
                    <span>${quoteDetails?.pricePerPax} USD</span>
                  </div>
                  <div className="h-px bg-slate-200/60 my-2"></div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-slate-700">Estimated Fare</span>
                    <span className="font-mono text-2xl font-extrabold text-emerald-700">${quoteDetails?.total} <span className="text-xs font-sans text-slate-500 font-medium">USD</span></span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-left">Note: No upfront payment needed! Pay in Bali cash/card upon start of service.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <button
                    onClick={handleLaunchWhatsApp}
                    className="pushable-btn-action w-full"
                  >
                    <span className="pushable-btn-shadow"></span>
                    <span className="pushable-btn-edge"></span>
                    <span className="pushable-btn-front py-3.5 flex items-center justify-center gap-2">
                      <span>Send Proposal to WhatsApp 💬</span>
                    </span>
                  </button>

                  <button
                    onClick={() => setBookingCalculated(false)}
                    className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-bold hover:underline transition-all"
                  >
                    Calculate New Custom Quote
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
