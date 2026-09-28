import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import {
  Briefcase,
  Ticket,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  FileText,
  DollarSign,
  TrendingUp,
  Download
} from 'lucide-react';
import { Booking } from '../types/travel.ts';

export const MyTripsPage: React.FC = () => {
  const { bookings, cancelBooking, setActiveTicket, setActiveModal, formatPrice, setCurrentView } = useTravel();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.bookingStatus === 'confirmed';
    if (activeTab === 'cancelled') return b.bookingStatus === 'cancelled';
    return b.bookingStatus === 'completed';
  });

  const totalSpent = bookings
    .filter((b) => b.bookingStatus === 'confirmed')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  const handleCancelClick = async (booking: Booking) => {
    const confirmPrompt = window.confirm(
      `Are you sure you want to cancel booking #${booking.id}? As per policy, an 80% refund (approx ${formatPrice(Math.round(booking.totalAmount * 0.8))}) will be initiated back to your ${booking.paymentMethod.toUpperCase()}.`
    );
    if (!confirmPrompt) return;

    setCancellingId(booking.id);
    const res = await cancelBooking(booking.id);
    setCancellingId(null);
    if (res.success) {
      alert(`Booking #${booking.id} cancelled. Refund of ${formatPrice(res.refundAmount || 0)} initiated!`);
    } else {
      alert(`Cancellation failed: ${res.error}`);
    }
  };

  const handleViewTicket = (b: Booking) => {
    setActiveTicket(b);
    setActiveModal('ticket');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Stats */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                My Trips & Digital Bookings
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your confirmed travel reservations, cancel trips with automated refunds, and view e-tickets
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Bookings</div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              {bookings.length}
            </div>
          </div>
          <div className="w-[1px] h-8 bg-slate-200" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Spend</div>
            <div className="text-base font-extrabold text-blue-600 font-mono">
              {formatPrice(totalSpent)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'upcoming', label: 'Active & Upcoming Trips', count: bookings.filter(b => b.bookingStatus === 'confirmed').length },
          { id: 'cancelled', label: 'Cancelled & Refunded', count: bookings.filter(b => b.bookingStatus === 'cancelled').length },
          { id: 'completed', label: 'Past Trips', count: bookings.filter(b => b.bookingStatus === 'completed').length },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No {activeTab} bookings found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ready for your next journey? Search available buses and book seats in just a few clicks.
          </p>
          <button
            type="button"
            onClick={() => setCurrentView('buses')}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Search Buses Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
            >
              {/* Left Route & Operator info (5 cols) */}
              <div className="lg:col-span-5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    #{b.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      b.bookingStatus === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.bookingStatus === 'cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {b.bookingStatus}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {b.source} ➔ {b.destination}
                </h3>

                <p className="text-xs text-slate-500 font-medium">
                  {b.busOperator} · Vehicle: {b.busNumber}
                </p>

                <div className="text-[11px] text-slate-400">
                  Boarding: <strong className="text-slate-700">{b.boardingPoint?.name || b.source}</strong> ({b.boardingPoint?.time})
                </div>
              </div>

              {/* Center Travel Dates & Seats (4 cols) */}
              <div className="lg:col-span-4 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{b.departureDate}</span>
                  <span>·</span>
                  <span>{b.departureTime}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Ticket className="w-3.5 h-3.5 text-blue-600" />
                  <span>Seats: <strong className="font-mono text-slate-900">{b.selectedSeatNumbers.join(', ')}</strong></span>
                  <span>({b.passengers.length} Traveler{b.passengers.length > 1 ? 's' : ''})</span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Payment: {b.paymentMethod.toUpperCase()} · Status: <span className="text-emerald-700 font-medium">{b.paymentStatus}</span>
                </div>
              </div>

              {/* Right Fare & Action buttons (3 cols) */}
              <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 gap-2">
                <div className="lg:text-right">
                  <div className="text-[10px] text-slate-400">Total Paid</div>
                  <div className="text-xl font-extrabold text-blue-600 font-mono">
                    {formatPrice(b.totalAmount)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewTicket(b)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Ticket</span>
                  </button>

                  {b.bookingStatus === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => handleCancelClick(b)}
                      disabled={cancellingId === b.id}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                      title="Cancel Booking & Refund"
                    >
                      {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
