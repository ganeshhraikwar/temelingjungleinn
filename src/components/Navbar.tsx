import React, { useState } from "react";
import { Compass, Menu, X, ShieldAlert, User, Phone, Trees } from "lucide-react";
import { SiteSettings } from "../types";

interface NavbarProps {
  settings: SiteSettings;
  isAdminMode: boolean;
  setIsAdminMode: (isAdmin: boolean) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function Navbar({
  settings,
  isAdminMode,
  setIsAdminMode,
  activeSection,
  setActiveSection,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Island Packages", id: "packages" },
    { label: "Our Services", id: "services" },
    { label: "Trip Planner", id: "planner" },
    { label: "Testimonials", id: "testimonials" },
    { label: "FAQ", id: "faq" },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    setIsAdminMode(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openWhatsAppDirect = () => {
    const text = encodeURIComponent(`Hi ${settings.companyName}! I'm visiting Nusa Penida and would like to ask about custom tours.`);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, "_blank");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-50/70 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          {/* Logo Brand */}
          <div className="flex items-center">
            <button
              onClick={() => {
                setIsAdminMode(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            >
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all duration-300">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-display font-bold text-lg md:text-xl text-slate-800 tracking-tight leading-none">
                  Temeling
                </span>
                <span className="block font-sans font-medium text-xs text-teal-600 tracking-wider uppercase">
                  Jungle Inn Penida
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          {!isAdminMode && (
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative text-sm font-medium transition-colors hover:text-emerald-600 py-2 cursor-pointer ${
                    activeSection === item.id ? "text-emerald-600" : "text-slate-600"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Call to Actions & Admin Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                isAdminMode
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {isAdminMode ? (
                <>
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>View Website</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
                  <span>Admin Panel</span>
                </>
              )}
            </button>

            {!isAdminMode && (
              <button
                onClick={openWhatsAppDirect}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer font-sans"
              >
                <Phone className="w-3.5 h-3.5 animate-bounce" />
                <span>Chat Reservation</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburguer & Admin Panel Switcher */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Admin Toggle for Mobile */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`p-1.5 rounded-xl border text-slate-700 transition-all cursor-pointer ${
                isAdminMode ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200"
              }`}
              title="Admin Toggle"
            >
              <ShieldAlert className={`w-5 h-5 ${isAdminMode ? "text-emerald-600" : "text-amber-500"}`} />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/55 transition-all focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-emerald-50 bg-white shadow-inner animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-3 pb-6 space-y-2.5">
            {!isAdminMode ? (
              <>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pt-2">Nusa Penida Guide</p>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-700 transition"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="h-px bg-slate-100 my-2"></div>
                <button
                  onClick={openWhatsAppDirect}
                  className="flex w-full items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md active:scale-95 transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Chat booking via WhatsApp</span>
                </button>
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs text-slate-600 font-medium">Currently in Administrator Dashboard Mode</p>
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-lg shadow"
                >
                  <User className="w-4.5 h-4.5" />
                  <span>View Visitor Site</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
