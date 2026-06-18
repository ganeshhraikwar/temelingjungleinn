import React, { useState } from "react";
import { Trees, MapPin, Compass, HelpCircle, ArrowRight, Check, Ship, MessageSquare } from "lucide-react";
import { SiteSettings } from "../types";

interface TripPlannerProps {
  settings: SiteSettings;
}

interface Sight {
  id: string;
  name: string;
  region: "West" | "East" | "South Jungle" | "Marine";
  avgTimeMins: number; // minutes to spend
  description: string;
}

const NUSA_SIGHTS: Sight[] = [
  { id: "kelingking", name: "Kelingking Beach T-Rex Cliff", region: "West", avgTimeMins: 90, description: "The famous cliff path shaped like a dinosaur drinking from the turquoise ocean." },
  { id: "broken", name: "Broken Beach (Pasih Uug)", region: "West", avgTimeMins: 45, description: "A gorgeous circular caldera rocky bridge with ocean currents flushing inside." },
  { id: "angels", name: "Angel's Billabong Pool", region: "West", avgTimeMins: 45, description: "A crystal clear natural infinity tide pool overlooking the volcano waves." },
  { id: "crystal", name: "Crystal Bay Beach", region: "West", avgTimeMins: 90, description: "Pristine white sand beach perfect for coconut sipping and sunsets." },
  { id: "diamond", name: "Diamond Beach Cliffs", region: "East", avgTimeMins: 100, description: "Stunning diamond-pointed rocks with a stairway carved down the face of high cliffs." },
  { id: "atuh", name: "Atuh Beach Arch", region: "East", avgTimeMins: 60, description: "Quiet beach cove featuring a dramatic rock archway reflecting Bali sunrise." },
  { id: "treehouse", name: "Rumah Pohon Tree house", region: "East", avgTimeMins: 40, description: "The ultimate Instagram viewpoint treehouse overlooking the Thousand Islands view." },
  { id: "tembeling_pool", name: "Tembeling Sacred Pool & Forest", region: "South Jungle", avgTimeMins: 120, description: "Hidden emerald crystal freshwater pool inside a dense jungle cliff ravine." },
  { id: "peguyangan", name: "Peguyangan Springs Waterfall", region: "South Jungle", avgTimeMins: 90, description: "The legendary blue stairways leading down the sheer cliff to a pilgrim sea-spray spring." },
  { id: "manta_point", name: "Manta Point Snorkeling", region: "Marine", avgTimeMins: 90, description: "A protected marine sanctuary hosting Giant Oceanic Manta Rays you can swim next to." },
  { id: "gamat_bay", name: "Gamat Bay Coral Garden", region: "Marine", avgTimeMins: 60, description: "Coral wall gardens populated by tropical turtles and thousands of tiny colored fish." }
];

export default function TripPlanner({ settings }: TripPlannerProps) {
  const [selectedSights, setSelectedSights] = useState<string[]>(["kelingking", "tembeling_pool"]);
  const [plannerPhone, setPlannerPhone] = useState("");
  const [plannerName, setPlannerName] = useState("");

  const handleToggleSight = (id: string) => {
    setSelectedSights((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const getSelectedObjects = () => {
    return NUSA_SIGHTS.filter((s) => selectedSights.includes(s.id));
  };

  const calculateTravelStats = () => {
    const selected = getSelectedObjects();
    const explorationTimeMins = selected.reduce((acc, curr) => acc + curr.avgTimeMins, 0);
    // Add 45 minutes transit time between each sight
    const driveTransitMins = selected.length > 1 ? (selected.length - 1) * 45 : 0;
    const totalTimeMins = explorationTimeMins + driveTransitMins;
    
    // Estimate price
    // Base private car is $50. Plus $5 per tourist sight additions beyond 3 sights or specialized transfers.
    let basePrice = 55;
    if (selected.length > 3) {
      basePrice += (selected.length - 3) * 5;
    }
    // Deep Marine adds snorkel charter
    const hasSnorkeling = selected.some((s) => s.region === "Marine");
    if (hasSnorkeling) {
      basePrice += 25; // Snorkel captain inclusion
    }

    return {
      exPlorMins: explorationTimeMins,
      totalHours: (totalTimeMins / 60).toFixed(1),
      priceUSD: basePrice,
      isFeasible: totalTimeMins <= 600, // max 10 hours practical
    };
  };

  const stats = calculateTravelStats();

  const handleSharePlannerWhatsApp = () => {
    if (!plannerName) {
      alert("Please specify your name first!");
      return;
    }
    const selected = getSelectedObjects();
    const sightsListStr = selected.map((s, idx) => `  ${idx + 1}. [${s.region}] ${s.name}`).join("\n");
    const msg = `Hi Temeling Jungle Inn! 🌴\n\nI have generated a CUSTOM Nusa Penida day itinerary:\n\n👤 Lead Name: ${plannerName}\n⏱️ Est Duration: ${stats.totalHours} Hours\n💵 Estimated Guided Fare: $${stats.priceUSD} USD\n\n📍 Sights selected:\n${sightsListStr}\n\nPlease check if this route is available for our dates! Thank you.`;
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section id="planner" className="py-20 lg:py-28 bg-[#f5faf7] scroll-mt-10 overflow-hidden relative">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-emerald-100 inline-block px-3 py-1 bg-opacity-70 rounded-md">
            Interactive Creator
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 tracking-tight leading-tight">
            Design Your Custom Dream Day Itinerary
          </h2>
          <p className="text-slate-500 font-sans text-sm">
            Select the places you're eager to visit in Nusa Penida. Our smart planner computes estimated transit timing, recommends feasibility, and outlines direct guided driver costs!
          </p>
        </div>

        {/* Planner Workspace Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sights Checklist Column */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display font-bold text-lg text-slate-800 border-b border-slate-200/60 pb-3 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Which sights would you like to explore?</span>
            </h3>

            {/* Sights grouped by region */}
            {(["West", "East", "South Jungle", "Marine"] as const).map((region) => {
              const sightsInRegion = NUSA_SIGHTS.filter((s) => s.region === region);
              return (
                <div key={region} className="space-y-3">
                  <h4 className="text-xs font-extrabold text-teal-700 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                    <span>{region} Coast Attractions</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sightsInRegion.map((sight) => {
                      const isSelected = selectedSights.includes(sight.id);
                      return (
                        <button
                          key={sight.id}
                          onClick={() => handleToggleSight(sight.id)}
                          type="button"
                          className={`p-4 rounded-2xl border-x border-t border-b-[5px] text-left cursor-pointer transition-all duration-200 flex items-start gap-3 relative active:translate-y-[2px] active:border-b-2 ${
                            isSelected
                              ? "bg-white border-emerald-500 border-b-emerald-600 shadow-md shadow-emerald-950/5"
                              : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:-translate-y-0.5"
                          }`}
                        >
                          {/* Checkbox indicator */}
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-200 bg-slate-50"
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                          </div>

                          <div className="space-y-1 select-none">
                            <span className="block font-semibold text-xs sm:text-sm text-slate-800 leading-snug">
                              {sight.name}
                            </span>
                            <span className="block text-[10px] text-slate-400 font-sans">
                              ⏱️ Spend: {sight.avgTimeMins} mins
                            </span>
                            <span className="block text-[10.5px] text-slate-500 line-clamp-1">
                              {sight.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sights Summary & WhatsApp Dispatch Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border-x border-t border-b-[8px] border-slate-200 hover:border-b-[#059669] shadow-2xl transition-all duration-300 space-y-6 relative">
            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-xl text-slate-800">Your Route Summary</h3>
              <p className="text-xs text-slate-400">Calculated dynamic logistics report</p>
            </div>

            {/* List of currently selected sights */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 border-b border-slate-100 pb-4">
              {getSelectedObjects().length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-medium">Please select at least one tourist attraction destination on the left.</p>
                </div>
              ) : (
                getSelectedObjects().map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between text-xs p-2 bg-slate-50/70 border border-slate-100 rounded-xl shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-teal-50 border border-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-bold shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-700 truncate max-w-[200px]">{s.name}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100/60 text-emerald-800">
                      {s.region}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Meta statistics */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f0f9f4] p-3.5 rounded-2xl border border-emerald-50 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Duration</span>
                  <span className="font-display font-extrabold text-lg text-slate-800">{stats.totalHours} Hours</span>
                  <p className="text-[9.5px] text-slate-400">Exploration + drive times</p>
                </div>

                <div className="bg-[#f0f9f4] p-3.5 rounded-2xl border border-emerald-50 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Cost (Private Guide)</span>
                  <span className="font-display font-extrabold text-lg text-[#047857]">${stats.priceUSD} USD</span>
                  <p className="text-[9.5px] text-slate-400">AC Car, fuel, local drivers</p>
                </div>
              </div>

              {/* Feasibility Alert Block */}
              {selectedSights.length > 5 ? (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-normal shadow-xs">
                  ⚠️ <strong>Itinerary alert:</strong> Visited count exceeds 5 sights. This might feel stressful in a single day due to island harbor boat return limits! We highly advise keeping it to 4-5 sights or booking two days.
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 leading-normal shadow-xs animate-pulse-subtle">
                  ✨ <strong>Logistics check:</strong> This selected tour is highly feasible and balances drive-times nicely. Highly recommended!
                </div>
              )}
            </div>

            {/* Submit fields */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={plannerName}
                  onChange={(e) => setPlannerName(e.target.value)}
                  placeholder="e.g. Rachel Green"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all shadow-inner"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={selectedSights.length === 0}
                  onClick={handleSharePlannerWhatsApp}
                  className="pushable-btn-action w-full disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="pushable-btn-shadow"></span>
                  <span className="pushable-btn-edge"></span>
                  <span className="pushable-btn-front py-3.5 flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4 fill-white text-[#ffffff]/30 shrink-0" />
                    <span>Request Custom Itinerary Quote 💬</span>
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
export { NUSA_SIGHTS };
