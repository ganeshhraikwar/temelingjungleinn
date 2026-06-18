import React from "react";
import { Compass, Car, Ship, Check, ArrowRight } from "lucide-react";

interface ServicesPanelProps {
  onScrollToPackages: () => void;
}

export default function ServicesPanel({ onScrollToPackages }: ServicesPanelProps) {
  const services = [
    {
      icon: <Compass className="w-6 h-6" />,
      tag: "Unforgettable Expeditions",
      title: "Guided Island Tours",
      description: "Carefully designed packages covering the most legendary viewpoints, rainforests, and snorkeling bays. High-quality safety gears & custom itineraries.",
      bullets: ["Kelingking & west shore cliffs", "Diamond Beach & eastern views", "Sacred Tembeling Forest pool", "Coral reef & manta swim"],
      gradient: "from-emerald-500 to-teal-600",
      badgeColor: "bg-emerald-50 text-emerald-800",
      iconContainer: "bg-emerald-500text-white"
    },
    {
      icon: <Car className="w-6 h-6" />,
      tag: "Premium Private Shuttles",
      title: "Comfortable Transports",
      description: "Avoid unsafe scooter rides on rough island paths! Rent your own spacious air-conditioned tourist SUV with fuel and local native driver included.",
      bullets: ["AC SUV accommodates up to 6 pax", "Full-tank fuel/petrol included", "Expert driver doubles as guide", "Customizable departure/pickup"],
      gradient: "from-teal-500 to-sky-600",
      badgeColor: "bg-teal-50 text-teal-800",
      iconContainer: "bg-teal-500 text-white"
    },
    {
      icon: <Ship className="w-6 h-6" />,
      tag: "Hassle-Free Sea Passage",
      title: "Fastboat Tickets Booking",
      description: "Direct modern speedboats crossing from Sanur Beach (Bali mainland) directly to Nusa Penida in under 30 minutes. Daily convenient schedules.",
      bullets: ["Instant digital voucher receipt", "Luggage handling of any size", "Return tickets with open dates", "Vip lounge boarding access"],
      gradient: "from-sky-500 to-emerald-600",
      badgeColor: "bg-sky-50 text-sky-800",
      iconContainer: "bg-sky-500 text-white"
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#f5faf7] relative overflow-hidden">
      {/* Decorative floral blurs */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute left-0 top-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl text-emerald-500/5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-emerald-100/60 inline-block px-3 py-1.5 rounded-full">
            What We Do
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 tracking-tight leading-tight">
            Complete Nusa Penida Travel Solutions
          </h2>
          <p className="text-slate-500 font-sans text-sm sm:text-md max-w-xl mx-auto">
            Temeling Jungle Inn handles everything from mainland fastboat transfers to rugged jeep shuttles and ocean-side guide excursions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 border-x border-t border-b-[8px] border-slate-200 hover:border-b-[#059669] shadow-[0_8px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_25px_50px_rgba(4,120,87,0.13)] hover:-translate-y-2.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-6">
                {/* Icon Circle */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-lg shadow-emerald-500/10 border-b-2 border-slate-900/15`}>
                  {item.icon}
                </div>

                <div className="space-y-3">
                  <span className={`inline-block text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-md ${item.badgeColor} shadow-xs border border-emerald-50`}>
                    {item.tag}
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-slate-800 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Bullets */}
                <ul className="space-y-2.5 pt-2 border-t border-slate-100">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-sans font-medium">
                      <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 mt-0.5 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      </div>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="pt-8">
                <button
                  onClick={onScrollToPackages}
                  className="w-full py-3 px-4 rounded-xl border-x border-t border-b-4 border-slate-200 hover:border-b-[#059669] text-[#059669] hover:bg-emerald-50/40 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-[2px] active:border-b-0 shadow-xs"
                >
                  <span>Select Package</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Seal Banner */}
        <div className="mt-16 bg-gradient-to-r from-emerald-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-12 translate-y-12">
            <Compass className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <h4 className="font-display font-bold text-xl sm:text-2xl leading-tight">
              Ready for a custom adventure itinerary?
            </h4>
            <p className="text-emerald-200 text-xs sm:text-sm leading-relaxed">
              Tell us what places you want to visit (e.g. Peguyangan Waterfall, Seganing Falls, Kelingking Cliff) and we will craft a private air-conditioned vehicle guided tour just for you!
            </p>
            <div className="pt-2">
              <button
                onClick={onScrollToPackages}
                className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Plan Custom Route
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
