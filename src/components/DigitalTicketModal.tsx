import React from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  QrCode,
  MapPin,
  Calendar,
  Clock,
  Bus,
  ShieldCheck,
  User,
  Phone
} from 'lucide-react';

export const DigitalTicketModal: React.FC = () => {
  const { activeModal, setActiveModal, activeTicket, formatPrice } = useTravel();

  if (activeModal !== 'ticket' || !activeTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `TripGo Ticket: ${activeTicket.source} to ${activeTicket.destination}`,
        text: `TripGo Confirmed Ticket #${activeTicket.id} for ${activeTicket.busOperator} on ${activeTicket.departureDate}. Seats: ${activeTicket.selectedSeatNumbers.join(', ')}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `TripGo Confirmed Ticket #${activeTicket.id}: ${activeTicket.source} to ${activeTicket.destination}, Bus: ${activeTicket.busNumber}, Seats: ${activeTicket.selectedSeatNumbers.join(', ')}`
      );
      alert('Ticket details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Top Bar (No Print) */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Official E-Ticket Confirmed</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Share Ticket"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
          
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-md border border-slate-200 overflow-hidden relative">
            
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xl font-black tracking-tight">TripGo</span>
                <span className="text-[10px] ml-2 uppercase tracking-widest text-blue-200 font-semibold">
                  Boarding Pass
                </span>
                <div className="text-xs text-blue-100 mt-1 font-mono font-medium">
                  PNR / Booking ID: <span className="text-white font-bold">{activeTicket.id}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider">
                  Confirmed
                </span>
                <div className="text-[10px] text-blue-100 mt-1">
                  Booked on {activeTicket.bookingDate}
                </div>
              </div>
            </div>

            {/* Operator & Route Hero */}
            <div className="p-5 border-b border-dashed border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeTicket.busOperator}</h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">Vehicle: {activeTicket.busNumber}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Paid</span>
                  <div className="text-lg font-black text-blue-600 font-mono">
                    {formatPrice(activeTicket.totalAmount)}
                  </div>
                </div>
              </div>

              {/* Journey Path */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl grid grid-cols-3 gap-2 text-center items-center">
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-medium">DEPARTURE</div>
                  <div className="text-base font-extrabold text-slate-900">{activeTicket.departureTime}</div>
                  <div className="text-xs font-semibold text-slate-700">{activeTicket.source}</div>
                  <div className="text-[10px] text-slate-400">{activeTicket.departureDate}</div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-blue-600 font-semibold">{activeTicket.duration}</span>
                  <div className="w-full flex items-center gap-1 my-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <div className="flex-1 h-[2px] bg-blue-300 border-dashed" />
                    <Bus className="w-3.5 h-3.5 text-blue-600" />
                    <div className="flex-1 h-[2px] bg-blue-300 border-dashed" />
                    <span className="w-2 h-2 rounded-full bg-teal-600" />
                  </div>
                  <span className="text-[9px] text-slate-400">Direct Express</span>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">ARRIVAL</div>
                  <div className="text-base font-extrabold text-slate-900">{activeTicket.arrivalTime}</div>
                  <div className="text-xs font-semibold text-slate-700">{activeTicket.destination}</div>
                  <div className="text-[10px] text-slate-400">Next Morning</div>
                </div>
              </div>
            </div>

            {/* Boarding and Dropping Points Details */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Boarding Point</span>
                </div>
                <div className="font-semibold text-slate-900">{activeTicket.boardingPoint.name}</div>
                <div className="text-[11px] text-slate-500">
                  Landmark: {activeTicket.boardingPoint.landmark || 'Main Bus Bay'}
                </div>
                <div className="text-[11px] text-blue-700 font-medium">
                  Reporting Time: 15 mins before {activeTicket.boardingPoint.time}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold uppercase text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>Dropping Point</span>
                </div>
                <div className="font-semibold text-slate-900">{activeTicket.droppingPoint.name}</div>
                <div className="text-[11px] text-slate-500">
                  Landmark: {activeTicket.droppingPoint.landmark || 'Central Stand'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Expected: {activeTicket.droppingPoint.time}
                </div>
              </div>
            </div>

            {/* Passenger Table */}
            <div className="p-5 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Passenger & Seat Allocation
              </h4>
              <div className="divide-y divide-slate-100">
                {activeTicket.passengers.map((p, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-900">{p.name}</span>
                      <span className="text-slate-400 text-[11px]">({p.age} yrs, {p.gender})</span>
                    </div>
                    <div className="font-mono font-bold text-blue-600 px-2 py-0.5 rounded bg-blue-50">
                      Seat: {p.seatNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Barcode & QR Code Section */}
            <div className="p-5 bg-slate-50 flex items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-800">Scan at Bus Entrance</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Show this digital pass on your mobile to the bus conductor. Physical print is optional.
                </p>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  Ticket Key: {activeTicket.id}-VERIFIED-SECURE
                </div>
              </div>

              {/* High-Fidelity SVG QR Code representation */}
              <div className="w-20 h-20 bg-white p-2 rounded-xl border border-slate-200 shrink-0 shadow-sm flex items-center justify-center">
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-800">
                  <QrCode className="w-14 h-14" />
                </div>
              </div>
            </div>

            {/* Emergency & Support Footer */}
            <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>TripGo 24x7 Roadside Assistance: 1800-420-TRIP</span>
              </div>
              <div>operator.support@tripgo.com</div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
