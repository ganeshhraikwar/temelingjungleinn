import React, { useState } from "react";
import { X, Calendar, Users, FileText, Phone, MessageSquare, Check, Trees } from "lucide-react";
import { TourPackage, Booking, SiteSettings } from "../types";

interface BookingModalProps {
  tour: TourPackage;
  settings: SiteSettings;
  onClose: () => void;
  onBookingSuccess: (booking: Partial<Booking>) => void;
}

export default function BookingModal({ tour, settings, onClose, onBookingSuccess }: BookingModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [paxCount, setPaxCount] = useState(2);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const calculateTotal = () => {
    // Rental transport is a flat rate, tours are per-pax
    if (tour.category === "transportation") {
      return tour.price;
    }
    return tour.price * paxCount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !travelDate) {
      alert("Please fill out Name, Phone, and Travel Date!");
      return;
    }

    setIsSubmitting(true);

    const totalUSD = calculateTotal();
    const newBooking: Partial<Booking> = {
      packageName: tour.title,
      customerName,
      customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, "")}@example.com`,
      customerPhone,
      travelDate,
      paxCount,
      notes: notes || "No additional notes.",
      whatsappMessageSent: true,
      status: "pending"
    };

    // Store in global/localStorage
    onBookingSuccess(newBooking);

    // Formulate beautiful WhatsApp receipt
    const waText = `Hello Temeling Jungle Inn! 🌴\n\nI'd like to book a Nusa Penida experience:\n\n📍 *Package:* ${tour.title}\n📅 *Travel Date:* ${travelDate}\n👥 *Headcount:* ${paxCount} traveler(s)\n\n👤 *Lead Customer:* ${customerName}\n📱 *Contact:* ${customerPhone}\n✉️ *Email:* ${customerEmail || 'not provided'}\n\n💬 *Pick-up / Notes:* ${notes || 'Standard harbour / hotel pickup'}\n\n💵 *Estimated Fee:* $${totalUSD} USD (~Rp ${(totalUSD * 16000).toLocaleString("id-ID")})\n\nPlease verify availability! Matur Suksma (Thank you)! 🙏`;

    setIsSubmitting(false);
    setShowSuccess(true);

    // Launch WhatsApp after brief success animation
    setTimeout(() => {
      window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waText)}`, "_blank");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-left relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <Trees className="w-4.5 h-4.5 text-emerald-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-100">Direct Reservation</span>
          </div>
          <h3 className="font-display font-bold text-lg md:text-xl leading-snug">{tour.title}</h3>
          <p className="text-xs text-white/80 mt-1">${tour.price} USD Per Person · Pay on arrival</p>
        </div>

        {/* Modal Body */}
        {!showSuccess ? (
          <form onSubmit={handleSubmit} className="p-6 text-left space-y-4 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your full name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rachel Green"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp phone number</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +6141234567"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Preferred travel date</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Number of travelers</label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPaxCount(Math.max(1, paxCount - 1))}
                    className="px-3 py-1.5 bg-slate-50 border-r border-slate-200 hover:bg-slate-100 text-xs font-bold font-sans"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-slate-700 text-xs">{paxCount} pax</span>
                  <button
                    type="button"
                    onClick={() => setPaxCount(Math.min(10, paxCount + 1))}
                    className="px-3 py-1.5 bg-slate-50 border-l border-slate-200 hover:bg-slate-100 text-xs font-bold font-sans"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your email address (optional)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. rachel@holiday.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hotel name or Harbor Pick-up location</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Pickup at Toyapakeh Harbour at 09:30 AM or Seminyak Hotel Lobby"
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
              ></textarea>
            </div>

            {/* Price Preview Frame */}
            <div className="bg-[#f0fcf6] border border-emerald-100 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Dynamic Total Fare</p>
                <p className="text-slate-400 text-[10px]">No downpayment required - pay cash/card on site.</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-mono font-extrabold text-[#047857]">${calculateTotal()} USD</span>
                <p className="text-[10px] font-mono text-slate-500">~Rp {(calculateTotal() * 16000).toLocaleString("id-ID")}</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-emerald-600/10 active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>{isSubmitting ? "Generating Ticket..." : "Instant WhatsApp Booking Confirmation 💬"}</span>
            </button>
          </form>
        ) : (
          <div className="p-12 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 stroke-[3.5px]" />
            </div>
            <h4 className="font-display font-extrabold text-xl text-slate-800">Booking Order Logged!</h4>
            <p className="text-slate-500 text-xs font-sans max-w-sm mx-auto leading-relaxed">
              We've created your reservation record ID in our dashboard backend. <br />
              <strong className="text-[#047857]">Launching WhatsApp Chat link now</strong> to confirm details with your native coordinator guide.
            </p>
            <div className="pt-2 animate-pulse text-[10.5px] text-teal-600 font-semibold">
              Opening Chat Conversation...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
