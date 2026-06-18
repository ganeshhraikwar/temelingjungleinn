import React, { useState } from "react";
import {
  TrendingUp, Users, DollarSign, ListCollapse, PlusCircle, Trash, Edit3, Save,
  Check, X, Search, PhoneCall, MonitorPlay, Activity, RefreshCw, Settings, FileSearch, Sparkles
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell
} from "recharts";
import { TourPackage, Booking, SiteSettings } from "../types";

interface AdminPanelProps {
  packages: TourPackage[];
  bookings: Booking[];
  settings: SiteSettings;
  onUpdatePackages: (pkgs: TourPackage[]) => void;
  onUpdateBookings: (bks: Booking[]) => void;
  onUpdateSettings: (set: SiteSettings) => void;
}

export default function AdminPanel({
  packages,
  bookings,
  settings,
  onUpdatePackages,
  onUpdateBookings,
  onUpdateSettings,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "packages" | "bookings" | "seo" | "settings">("dashboard");

  // Filter lists
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [bookingSearch, setBookingSearch] = useState<string>("");

  // Create Package State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState("");
  const [newPkgDesc, setNewPkgDesc] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState(40);
  const [newPkgCategory, setNewPkgCategory] = useState<"island-tour" | "transportation" | "fastboat">("island-tour");
  const [newPkgImage, setNewPkgImage] = useState("https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80");
  const [newPkgInclusions, setNewPkgInclusions] = useState("AC private SUV, English-speaking guide, Mineral water");
  const [newPkgSpots, setNewPkgSpots] = useState("Kelingking Cliff, Broken Beach");

  // Edit Package State
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [editPkgTitle, setEditPkgTitle] = useState("");
  const [editPkgPrice, setEditPkgPrice] = useState(0);
  const [editPkgDesc, setEditPkgDesc] = useState("");

  // Edit SEO State
  const [tempSeoTitle, setTempSeoTitle] = useState(settings.seoTitle);
  const [tempSeoDesc, setTempSeoDesc] = useState(settings.seoDescription);
  const [tempSeoKeywords, setTempSeoKeywords] = useState(settings.seoKeywords);

  // Edit Site Settings State
  const [tempWhatsApp, setTempWhatsApp] = useState(settings.whatsappNumber);
  const [tempTagline, setTempTagline] = useState(settings.tagline);
  const [tempAddress, setTempAddress] = useState(settings.address);
  const [tempEmail, setTempEmail] = useState(settings.email);
  const [tempAnnouncement, setTempAnnouncement] = useState(settings.announcementText);
  const [tempAnnActive, setTempAnnActive] = useState(settings.isAnnouncementActive);

  // Calculates financial stats and aggregates booking trends
  const calculateMetrics = () => {
    const totalCount = bookings.length;
    // Calculate confirmed/completed estimated revenue
    const revenueUSD = bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((acc, b) => {
        // match pricing
        const pkg = packages.find((p) => p.title === b.packageName);
        const price = pkg ? pkg.price : 45;
        // transportation is flat, tours are per-pax
        const isFlat = pkg ? pkg.category === "transportation" : false;
        return acc + (isFlat ? price : price * b.paxCount);
      }, 0);

    const pendingCount = bookings.filter((b) => b.status === "pending").length;
    const completedCount = bookings.filter((b) => b.status === "completed").length;

    return {
      revenueUSD,
      totalCount,
      pendingCount,
      completedCount,
      conversionRate: totalCount > 0 ? ((completedCount + bookings.filter(b=>b.status==='confirmed').length) / totalCount * 100).toFixed(0) : "100"
    };
  };

  const metrics = calculateMetrics();

  // Recharts Data Aggregation
  // Let's create a beautiful monthly trend sequence based on logged bookings and mock historic bookings
  const monthlyTimelineData = [
    { name: "Jan", Bookings: 12, Revenue: 450 },
    { name: "Feb", Bookings: 18, Revenue: 680 },
    { name: "Mar", Bookings: 22, Revenue: 890 },
    { name: "Apr", Bookings: 31, Revenue: 1350 },
    { name: "May", Bookings: 45, Revenue: 1800 },
    { name: "Jun (Current)", Bookings: bookings.length + 35, Revenue: metrics.revenueUSD + 1400 },
  ];

  // Aggregates bookings per package category
  const getCategoryChartData = () => {
    const tourBookings = bookings.filter(b => {
      const matchPkg = packages.find(p => p.title === b.packageName);
      return matchPkg ? matchPkg.category === "island-tour" : true;
    }).length + 14;

    const transportBookings = bookings.filter(b => {
      const matchPkg = packages.find(p => p.title === b.packageName);
      return matchPkg ? matchPkg.category === "transportation" : false;
    }).length + 5;

    const boatBookings = bookings.filter(b => {
      const matchPkg = packages.find(p => p.title === b.packageName);
      return matchPkg ? matchPkg.category === "fastboat" : false;
    }).length + 9;

    return [
      { name: "Guided Tours", count: tourBookings, fill: "#10b981" },
      { name: "AC Private Car", count: transportBookings, fill: "#0ea5e9" },
      { name: "Fastboat Passages", count: boatBookings, fill: "#6366f1" },
    ];
  };

  // Booking handlers
  const handleUpdateBookingStatus = (id: string, newStatus: Booking["status"]) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    onUpdateBookings(updated);
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm("Are you sure you want to dismiss this booking?")) {
      const updated = bookings.filter((b) => b.id !== id);
      onUpdateBookings(updated);
    }
  };

  // Tour Package editing/creation handlers
  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgTitle) return;

    const newPkg: TourPackage = {
      id: `pkg_${Date.now()}`,
      title: newPkgTitle,
      description: newPkgDesc || "Fascinating tropical experience.",
      duration: "Full Day (8-10 Hours)",
      price: newPkgPrice,
      category: newPkgCategory,
      image: newPkgImage || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
      spots: newPkgSpots.split(",").map((s) => s.trim()).filter(Boolean),
      included: newPkgInclusions.split(",").map((s) => s.trim()).filter(Boolean),
      rating: 4.9,
      reviewsCount: 1,
    };

    onUpdatePackages([...packages, newPkg]);
    setShowAddForm(false);
    
    // Reset Form
    setNewPkgTitle("");
    setNewPkgDesc("");
    setNewPkgPrice(40);
    setNewPkgSpots("Kelingking Cliff, Broken Beach");
    setNewPkgInclusions("AC Private Car, fuel, local guide");
  };

  const handleDeletePackage = (id: string) => {
    if (confirm("Are you sure you want to delete this tour package permanently?")) {
      const updated = packages.filter((p) => p.id !== id);
      onUpdatePackages(updated);
    }
  };

  const handleStartEditPackage = (pkg: TourPackage) => {
    setEditingPkgId(pkg.id);
    setEditPkgTitle(pkg.title);
    setEditPkgPrice(pkg.price);
    setEditPkgDesc(pkg.description);
  };

  const handleSaveEditPackage = () => {
    const updated = packages.map((p) =>
      p.id === editingPkgId
        ? { ...p, title: editPkgTitle, price: editPkgPrice, description: editPkgDesc }
        : p
    );
    onUpdatePackages(updated);
    setEditingPkgId(null);
  };

  // SEO Scorecard Audit Calculator
  const getSEOAuditReport = () => {
    const lengthScore = tempSeoTitle.length >= 40 && tempSeoTitle.length <= 65 ? 30 : 15;
    const descScore = tempSeoDesc.length >= 120 && tempSeoDesc.length <= 165 ? 30 : 15;
    const keywordsCount = tempSeoKeywords.split(",").filter(k => k.trim().length > 0).length;
    const keywordScore = keywordsCount >= 5 ? 20 : keywordsCount * 4;
    const focusKeywordPresence = tempSeoTitle.toLowerCase().includes("nusa penida") && tempSeoDesc.toLowerCase().includes("tour") ? 20 : 5;

    const totalScore = lengthScore + descScore + keywordScore + focusKeywordPresence;

    const issues: string[] = [];
    if (tempSeoTitle.length < 40) issues.push("SEO Title is brief. Expand the title to 45-60 characters for higher clicks.");
    if (tempSeoTitle.length > 65) issues.push("SEO Title is lengthy. Keep it under 65 letters to avoid search clipping.");
    if (tempSeoDesc.length < 120) issues.push("Meta Description is short. Extend copy up to 140 letters detailing reviews, safety, and price.");
    if (tempSeoDesc.length > 170) issues.push("Meta Description is long. Google will truncate text beyond 165 characters.");
    if (keywordsCount < 5) issues.push("Add at least 5 target keywords (e.g. 'manta snorkeling Bali', 'fastboat sanur harbour').");
    if (!tempSeoTitle.toLowerCase().includes("penida")) issues.push("Your Title lacks the core keyword 'Nusa Penida'!");

    return {
      score: totalScore,
      issues: issues.length > 0 ? issues : ["🎉 Outstanding! Your SEO is heavily optimized. Zero issues detected."],
      grade: totalScore >= 85 ? "Excellent (A)" : totalScore >= 60 ? "Moderate (B)" : "Needs Work (C)"
    };
  };

  const seoReport = getSEOAuditReport();

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      seoTitle: tempSeoTitle,
      seoDescription: tempSeoDesc,
      seoKeywords: tempSeoKeywords,
    });
    alert("Metadata updated successfully! Simulated sitemap refreshed.");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      whatsappNumber: tempWhatsApp,
      tagline: tempTagline,
      address: tempAddress,
      email: tempEmail,
      announcementText: tempAnnouncement,
      isAnnouncementActive: tempAnnActive,
    });
    alert("Global company configuration updated successfully!");
  };

  // Booking search logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.packageName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerPhone.includes(bookingSearch);

    const matchesStatus = bookingFilter === "all" || b.status === bookingFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#f2f8f4] min-h-screen text-slate-800 pb-16 font-sans">
      
      {/* Top Banner indicating Admin Status */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-950 text-white px-4 py-8 shadow-inner relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#10b981]">Secure Authority Center</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight">
              Temeling Jungle Inn Admin Dashboard
            </h1>
            <p className="text-[#a7f3d0] text-xs sm:text-sm">Manage packages, booking inquiries, SEO audits & WhatsApp config.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-800 text-teal-200 px-3 py-1 bg-opacity-50 rounded-lg font-mono">
              Role: Master Admin
            </span>
            <div className="px-3 py-1 bg-white text-emerald-950 font-semibold text-xs rounded-lg shadow flex items-center gap-1.5 pointer-events-none">
              <Activity className="w-3.5 h-3.5 text-[#10b981] animate-spin" />
              <span>Sitemap: Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Core Administrative Navigation */}
        <div className="flex flex-wrap border-b border-emerald-100 bg-white shadow-xs p-2 rounded-2xl gap-1 mb-8">
          {[
            { id: "dashboard", label: "Dashboard & Charts", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "bookings", label: `Bookings Tracker (${bookings.filter(b=>b.status==='pending').length} pending)`, icon: <Users className="w-4 h-4" /> },
            { id: "packages", label: `Edit Packages (${packages.length})`, icon: <PlusCircle className="w-4 h-4" /> },
            { id: "seo", label: `SEO Audit Score`, icon: <FileSearch className="w-4 h-4" /> },
            { id: "settings", label: "Config Settings", icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "text-slate-600 hover:bg-slate-100/80"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ==================================================================================== */}
        {/* VIEW: DASHBOARD */}
        {/* ==================================================================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 text-left animate-in fade-in duration-300">
            
            {/* Stats Cards Bento Block */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Company Revenue (Est.)</span>
                <span className="font-display font-extrabold text-2xl md:text-3xl text-emerald-700 font-mono">${metrics.revenueUSD} <span className="text-xs font-sans text-slate-400">USD</span></span>
                <p className="text-[10px] text-[#059669] font-semibold mt-1">~Rp {(metrics.revenueUSD * 16000).toLocaleString("id-ID")}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Inquiries Total</span>
                <span className="font-display font-extrabold text-2xl md:text-3xl text-slate-800 font-mono">{metrics.totalCount}</span>
                <p className="text-[10px] text-amber-600 font-semibold mt-1">{metrics.pendingCount} pending verification</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Client Conversion</span>
                <span className="font-display font-extrabold text-2xl md:text-3xl text-sky-700 font-mono">{metrics.conversionRate}%</span>
                <p className="text-[10px] text-slate-400 font-sans mt-1">Confirmed vs overall queries</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-50 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Available Packages</span>
                <span className="font-display font-extrabold text-2xl md:text-3xl text-slate-800 font-mono">{packages.length}</span>
                <p className="text-[10px] text-[#059669] font-semibold mt-1">100% cloud persistent</p>
              </div>

            </div>

            {/* Graphics Bento Block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Graphic 1: Booking & Revenue growth */}
              <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-800">Reservation Growth (2026)</h3>
                  <p className="text-xs text-slate-400">Monthly breakdown of visitors booking tours</p>
                </div>
                <div className="h-[250px] w-full text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTimelineData}>
                      <defs>
                        <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Area type="monotone" dataKey="Bookings" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorB)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Graphic 2: Category volume */}
              <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-800">Booking Shares per Category</h3>
                  <p className="text-xs text-slate-400">Popularity distribution of our primary services</p>
                </div>
                <div className="h-[250px] w-full text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getCategoryChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                        {getCategoryChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Live activity logs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-800">Pending Actions Required</h3>
                  <p className="text-xs text-slate-400">Customer requests waiting for WhatsApp review</p>
                </div>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs text-[#059669] hover:underline font-bold"
                >
                  Manage bookings
                </button>
              </div>

              {bookings.filter(b => b.status === "pending").length === 0 ? (
                <div className="py-8 text-center bg-[#f0fbf6] rounded-2xl border border-dashed border-emerald-100">
                  <p className="text-xs text-emerald-800 font-semibold">🌴 All client inquiries processed! Great job.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {bookings.filter(b => b.status === "pending").map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-50/40 border border-amber-100 rounded-2xl text-xs gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">{item.customerName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{item.customerPhone}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">Requested: <strong>{item.packageName}</strong> with <strong>{item.paxCount} pax</strong> on {item.travelDate}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleUpdateBookingStatus(item.id, "confirmed")}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10.5px] font-bold"
                        >
                          Confirm & Notify
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(item.id, "cancelled")}
                          className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-[10.5px] font-semibold"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================================================================== */}
        {/* VIEW: BOOKINGS TRACKER */}
        {/* ==================================================================================== */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6 text-left animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-800 select-none">Client Booking Inquiries</h3>
                <p className="text-xs text-slate-400">Total list of bookings processed through client forms and quote grids</p>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search by name/phone..."
                    className="pl-8.5 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 w-44 font-sans"
                  />
                </div>

                <select
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 focus:outline-none focus:focus:border-emerald-500"
                >
                  <option value="all">All Booking Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* List Table wrapper */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-[#f0fbf6] text-emerald-950 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-50">
                  <tr>
                    <th className="py-3 px-4">Client Detail</th>
                    <th className="py-3 px-4">Selected Package</th>
                    <th className="py-3 px-4">Date & Headcount</th>
                    <th className="py-3 px-4">Status & Action</th>
                    <th className="py-3 px-4">WhatsApp Chaser</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        0 bookings found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((bk) => (
                      <tr key={bk.id} className="hover:bg-slate-50/50 transition">
                        {/* Name/Phone */}
                        <td className="py-4 px-4 space-y-1 font-sans">
                          <p className="font-bold text-slate-800 text-sm">{bk.customerName}</p>
                          <p className="text-[10px] text-slate-400">{bk.customerEmail}</p>
                          <p className="text-[10px] font-mono text-[#059669] font-semibold">{bk.customerPhone}</p>
                        </td>

                        {/* Package Name */}
                        <td className="py-4 px-4 font-semibold text-slate-700">
                          {bk.packageName}
                        </td>

                        {/* Date / Headcount */}
                        <td className="py-4 px-4 space-y-1">
                          <p className="font-semibold text-slate-600">{bk.travelDate}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{bk.paxCount} travelers inclusive</p>
                        </td>

                        {/* Status Updater */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1.5 w-28">
                            <select
                              value={bk.status}
                              onChange={(e) => handleUpdateBookingStatus(bk.id, e.target.value as any)}
                              className={`px-2.5 py-1 text-[10.5px] font-bold rounded-lg border focus:outline-none leading-none cursor-pointer ${
                                bk.status === "pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : bk.status === "confirmed"
                                  ? "bg-emerald-50 text-[#047857] border-emerald-200"
                                  : bk.status === "completed"
                                  ? "bg-sky-50 text-sky-700 border-sky-200"
                                  : "bg-slate-50 text-slate-500 border-slate-200"
                              }`}
                            >
                              <option value="pending">🟡 Pending</option>
                              <option value="confirmed">🟢 Confirmed</option>
                              <option value="completed">🔵 Completed</option>
                              <option value="cancelled">🔴 Cancelled</option>
                            </select>
                          </div>
                        </td>

                        {/* WhatsApp Outbox Dispatch button */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => {
                              const noteStr = bk.notes ? ` Notes: ${bk.notes}` : "";
                              const messageStr = `Hi ${bk.customerName}! Tropical regards from Temeling Jungle Inn. 🌴 We saw your inquiry for "${bk.packageName}" package on date ${bk.travelDate} for ${bk.paxCount} travelers.${noteStr} Please let us know if you have any questions!`;
                              window.open(`https://wa.me/${bk.customerPhone.replace(/[\s\+]+/g, "")}?text=${encodeURIComponent(messageStr)}`, "_blank");
                            }}
                            className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10.5px] font-semibold px-3 py-1.5 rounded-lg border border-emerald-200"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-[#059669]" />
                            <span>Quick Chat</span>
                          </button>
                        </td>

                        {/* Delete row */}
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleDeleteBooking(bk.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                            title="Delete Inquiry"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-2">
              <p>💡 Tip: Changing a status immediately cascades metrics reporting inside the Dashboards.</p>
              <p className="font-mono">Total inquiries processed: {bookings.length} pieces</p>
            </div>

          </div>
        )}

        {/* ==================================================================================== */}
        {/* VIEW: MANAGE PACKAGES */}
        {/* ==================================================================================== */}
        {activeTab === "packages" && (
          <div className="space-y-8 text-left animate-in fade-in duration-300">
            
            {/* Header control and "Add new package" Toggle */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-800">Dynamic Tour Package Catalog Editor</h3>
                <p className="text-xs text-slate-400 font-sans">Submit new package routes, configure prices, or edit highlights.</p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span>{showAddForm ? "Close Creator Form" : "Create New Custom Tour"}</span>
              </button>
            </div>

            {/* Creation Form Block */}
            {showAddForm && (
              <form onSubmit={handleAddPackage} className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-xl space-y-6">
                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-[#047857] text-lg">New Tour Package Specification</h4>
                  <p className="text-slate-400 text-xs">Register new tour route into index.html catalog lists</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Package Title / Route Name</label>
                    <input
                      type="text"
                      required
                      value={newPkgTitle}
                      onChange={(e) => setNewPkgTitle(e.target.value)}
                      placeholder="e.g. Peguyangan Cliff trekking"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fare Price ($ USD)</label>
                    <input
                      type="number"
                      required
                      value={newPkgPrice}
                      onChange={(e) => setNewPkgPrice(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Package Category Filter</label>
                    <select
                      value={newPkgCategory}
                      onChange={(e) => setNewPkgCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="island-tour">Island Guided Tour</option>
                      <option value="transportation">Private Driver Transport</option>
                      <option value="fastboat">Fastboat Harbor tickets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Display Cover Photo (Unsplash URL)</label>
                    <input
                      type="url"
                      value={newPkgImage}
                      onChange={(e) => setNewPkgImage(e.target.value)}
                      placeholder="e.g. https://images.unsplash.com/..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sights Visited (Comma Separated)</label>
                    <input
                      type="text"
                      value={newPkgSpots}
                      onChange={(e) => setNewPkgSpots(e.target.value)}
                      placeholder="e.g. Peguyangan spring, Manta snorkeling, Kelingking"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Inclusive Items list (Comma Separated)</label>
                    <input
                      type="text"
                      value={newPkgInclusions}
                      onChange={(e) => setNewPkgInclusions(e.target.value)}
                      placeholder="e.g. AC Cruiser, Lunchbox, English guide, Harbor tickets"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Brief Description</label>
                  <textarea
                    value={newPkgDesc}
                    onChange={(e) => setNewPkgDesc(e.target.value)}
                    placeholder="Short summary describing the package landmarks..."
                    rows={3}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Create Package and Cascade Public Pages ✨
                </button>
              </form>
            )}

            {/* Existing Packages Table list with inline editor */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
              <h4 className="font-display font-bold text-base text-slate-800 border-b border-slate-100 pb-3">Active Registered Packages</h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px] divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[9px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 w-20">Media</th>
                      <th className="py-3.5 px-4">Package Identity</th>
                      <th className="py-3.5 px-4 w-28">Category</th>
                      <th className="py-3.5 px-4 w-24">Fare Price</th>
                      <th className="py-3.5 px-4 text-center w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {packages.map((pkg) => {
                      const isEditing = editingPkgId === pkg.id;
                      return (
                        <tr key={pkg.id} className="hover:bg-slate-50/40">
                          {/* Image */}
                          <td className="py-4 px-4">
                            <img
                              src={pkg.image}
                              alt={pkg.title}
                              className="w-12 h-12 object-cover rounded-xl"
                            />
                          </td>

                          {/* Info Column */}
                          <td className="py-4 px-4 space-y-1">
                            {isEditing ? (
                              <div className="space-y-1.5 max-w-sm">
                                <input
                                  type="text"
                                  value={editPkgTitle}
                                  onChange={(e) => setEditPkgTitle(e.target.value)}
                                  className="w-full px-2 py-1 border text-xs font-semibold rounded focus:outline-none"
                                />
                                <textarea
                                  value={editPkgDesc}
                                  onChange={(e) => setEditPkgDesc(e.target.value)}
                                  rows={2}
                                  className="w-full px-2 py-1 border text-[11px] rounded focus:outline-none resize-none"
                                ></textarea>
                              </div>
                            ) : (
                              <>
                                <p className="font-bold text-slate-800 text-sm">{pkg.title}</p>
                                <p className="text-slate-400 text-xs sm:line-clamp-1 max-w-md">{pkg.description}</p>
                              </>
                            )}
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-600 uppercase border border-slate-100">
                              {pkg.category.replace("-", " ")}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4 font-mono font-bold text-[#059669]">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPkgPrice}
                                onChange={(e) => setEditPkgPrice(parseInt(e.target.value) || 0)}
                                className="w-16 px-1.5 py-1 border text-xs font-bold rounded focus:outline-none"
                              />
                            ) : (
                              <span className="text-sm font-sans">${pkg.price} USD</span>
                            )}
                          </td>

                          {/* Controls */}
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={handleSaveEditPackage}
                                    className="p-1.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg"
                                    title="Save modification"
                                  >
                                    <h1 className="leading-none flex items-center justify-center font-bold text-xs">Save</h1>
                                  </button>
                                  <button
                                    onClick={() => setEditingPkgId(null)}
                                    className="p-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-lg"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleStartEditPackage(pkg)}
                                    className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50"
                                    title="Edit Price & details"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePackage(pkg.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                                    title="Delete package"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================================================================== */}
        {/* VIEW: SEO ANALYZER */}
        {/* ==================================================================================== */}
        {activeTab === "seo" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-in fade-in duration-300">
            
            {/* Left Box: SEO Meta Edit Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-800">HTML Title & Metadata optimization</h3>
                <p className="text-xs text-slate-400">Modify simulated index.html head assets to trigger search rankings</p>
              </div>

              <form onSubmit={handleSaveSEO} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">SEO Page Title</label>
                    <span className={`text-[10px] font-mono ${tempSeoTitle.length >= 40 && tempSeoTitle.length <= 65 ? 'text-emerald-600 font-bold' : 'text-amber-600'}`}>{tempSeoTitle.length} chars (Target: 40-65)</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={tempSeoTitle}
                    onChange={(e) => setTempSeoTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Meta Description Tag</label>
                    <span className={`text-[10px] font-mono ${tempSeoDesc.length >= 120 && tempSeoDesc.length <= 165 ? 'text-emerald-600 font-bold' : 'text-amber-600'}`}>{tempSeoDesc.length} chars (Target: 120-165)</span>
                  </div>
                  <textarea
                    required
                    value={tempSeoDesc}
                    onChange={(e) => setTempSeoDesc(e.target.value)}
                    rows={4}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-600 leading-relaxed font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-widest mb-1">Search Engine Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    value={tempSeoKeywords}
                    onChange={(e) => setTempSeoKeywords(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-600 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">E.g. Nusa penida tour guide, Temeling jungle inn booking, fastboat Sanur Bali</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Update and Relaunch SEO Scorecard</span>
                </button>
              </form>
            </div>

            {/* Right Box: Live SEO Scorecard Audit */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm text-center space-y-5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Live Organic Rating</span>
                
                {/* Score gauge */}
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center rounded-full border-[10px] border-[#0ea5e9]">
                  <div className="text-center">
                    <span className="font-display font-extrabold text-4xl text-slate-800">{seoReport.score}</span>
                    <span className="text-xs text-slate-400 font-bold block">/ 100</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs bg-emerald-50 text-[#047857] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Grade: {seoReport.grade}
                  </span>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Audit Sights Recommendations */}
                <div className="space-y-3 pt-2 text-left">
                  <p className="text-xs font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI SEO Recommendations checklist:</span>
                  </p>

                  <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {seoReport.issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="w-4 h-4 bg-amber-100 text-amber-800 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          !
                        </span>
                        <span className="font-sans leading-relaxed">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================================================================================== */}
        {/* VIEW: SETTINGS CHANNEL */}
        {/* ==================================================================================== */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm text-left animate-in fade-in duration-300 max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="font-display font-bold text-xl text-slate-800 select-none">Global Site variables & WhatsApp Gateway</h3>
              <p className="text-xs text-slate-400 font-sans">Modify default company contacts and announcement toggles instantaneously.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Official WhatsApp Phone Number</label>
                  <input
                    type="text"
                    required
                    value={tempWhatsApp}
                    onChange={(e) => setTempWhatsApp(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-700 font-mono"
                  />
                  <p className="text-[9.5px] text-slate-400 mt-1">E.g. "62" country code prefix. Avoid placing '+' or spaces.</p>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">Official Company Email</label>
                  <input
                    type="email"
                    required
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-widest mb-1">Company Tagline</label>
                <input
                  type="text"
                  required
                  value={tempTagline}
                  onChange={(e) => setTempTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-widest mb-1">Physical Company Address (Bali, Indonesia)</label>
                <input
                  type="text"
                  required
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none text-slate-600 font-sans"
                />
              </div>

              <div className="h-px bg-slate-100 my-4"></div>

              {/* Promo announcement toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#059669] uppercase tracking-widest">Header Announcement banner text</label>
                    <p className="text-[10px] text-slate-400">Controls the marquee line on top of index.html</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTempAnnActive(!tempAnnActive)}
                    className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-md cursor-pointer transition ${
                      tempAnnActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {tempAnnActive ? "● Banner Enabled" : "○ Banner Disabled"}
                  </button>
                </div>

                <input
                  type="text"
                  value={tempAnnouncement}
                  disabled={!tempAnnActive}
                  onChange={(e) => setTempAnnouncement(e.target.value)}
                  placeholder="e.g. 🏝️ Limited Promo Summer! Save 10% booking now."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer pt-3"
              >
                Save Global settings changes
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
export {};
