import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import { Bus, Booking } from '../types/travel.ts';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Bus as BusIcon,
  XCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { buses, bookings, refreshBuses, formatPrice } = useTravel();

  const [activeTab, setActiveTab] = useState<'analytics' | 'buses' | 'bookings' | 'routes'>('analytics');
  const [stats, setStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New Bus form state
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [newOperator, setNewOperator] = useState('');
  const [newBusNumber, setNewBusNumber] = useState('');
  const [newSource, setNewSource] = useState('Delhi');
  const [newDest, setNewDest] = useState('Shimla');
  const [newDepTime, setNewDepTime] = useState('21:00');
  const [newArrTime, setNewArrTime] = useState('07:00');
  const [newPrice, setNewPrice] = useState(899);
  const [newSeatType, setNewSeatType] = useState<'Sleeper' | 'Seater' | 'Semi-Sleeper'>('Sleeper');

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // Fallback stats computation
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [bookings.length, buses.length]);

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOperator || !newBusNumber) return;

    try {
      const res = await fetch('/api/admin/buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operator: newOperator,
          busNumber: newBusNumber,
          source: newSource,
          destination: newDest,
          departureTime: newDepTime,
          arrivalTime: newArrTime,
          startingPrice: newPrice,
          seatType: newSeatType,
          isAC: true,
        }),
      });

      if (res.ok) {
        alert('New bus route successfully added to the live fleet!');
        setShowAddBusModal(false);
        refreshBuses();
        fetchStats();
      }
    } catch (err) {
      alert('Error creating bus');
    }
  };

  const handleDeleteBus = async (busId: string) => {
    if (!window.confirm('Are you sure you want to remove this bus service?')) return;
    try {
      await fetch(`/api/admin/buses/${busId}`, { method: 'DELETE' });
      refreshBuses();
      fetchStats();
    } catch {
      // ignore
    }
  };

  const totalRevenue = stats?.totalRevenue ?? bookings.reduce((a, b) => (b.bookingStatus === 'confirmed' ? a + b.totalAmount : a), 0);
  const totalBookingsCount = stats?.totalBookings ?? bookings.length;
  const activeBookingsCount = stats?.activeBookings ?? bookings.filter((b) => b.bookingStatus === 'confirmed').length;
  const cancelledCount = stats?.cancelledBookings ?? bookings.filter((b) => b.bookingStatus === 'cancelled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-sans">TripGo Operator & Admin Control Panel</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  LIVE SECURE ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized fleet management, seat price adjustments, transaction logs, and cancellation analytics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchStats}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddBusModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Bus</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400">Gross Ticket Revenue</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {formatPrice(totalRevenue)}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">+14.2% vs last week</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400">Total Bookings</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {totalBookingsCount}
            </div>
            <div className="text-[11px] text-blue-600 font-semibold mt-0.5">{activeBookingsCount} confirmed active</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400">Active Bus Fleet</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {buses.length} Buses
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">Across 8 states</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BusIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400">Cancellations & Refunds</div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">
              {cancelledCount}
            </div>
            <div className="text-[11px] text-rose-600 font-semibold mt-0.5">Automated refund processed</div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'analytics', label: 'Route Trends & Metrics' },
          { id: 'buses', label: `Fleet Management (${buses.length})` },
          { id: 'bookings', label: `Transaction Bookings (${bookings.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Route Trends & Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Top Booked Travel Corridors
            </h3>
            <div className="space-y-3">
              {[
                { route: 'Delhi ⇄ Manali', bookings: 480, rev: 624000, share: 75 },
                { route: 'Mumbai ⇄ Goa', bookings: 390, rev: 565500, share: 62 },
                { route: 'Bangalore ⇄ Goa', bookings: 290, rev: 333500, share: 48 },
                { route: 'Delhi ⇄ Jaipur', bookings: 260, rev: 135200, share: 38 },
              ].map((r, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800">{r.route}</span>
                    <span className="font-mono text-blue-600 font-bold">{formatPrice(r.rev)} ({r.bookings} tickets)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${r.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Operator Performance & Rating Breakdown
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                { name: 'IntrCity SmartBus Premium', onTime: '98%', rating: 4.8, status: 'Super Operator' },
                { name: 'VRL Travels Goldline', onTime: '96%', rating: 4.9, status: 'Top Rated' },
                { name: 'Zingbus Express Lounge', onTime: '94%', rating: 4.6, status: 'Verified' },
                { name: 'Orange Travels Royal', onTime: '95%', rating: 4.7, status: 'Verified' },
              ].map((op, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{op.name}</div>
                    <div className="text-[11px] text-slate-500">Punctuality Score: {op.onTime} · ⭐ {op.rating}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {op.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Fleet Management Table */}
      {activeTab === 'buses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3 px-4">Operator & Vehicle</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Timings</th>
                  <th className="py-3 px-4">Seats / Type</th>
                  <th className="py-3 px-4">Starting Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {buses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{bus.operator}</div>
                      <div className="text-[10px] font-mono text-slate-500">{bus.busNumber}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {bus.source} ➔ {bus.destination}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {bus.departureTime} - {bus.arrivalTime} ({bus.duration})
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold">{bus.availableSeatsCount}/{bus.totalSeatsCount} available</span>
                      <div className="text-[10px] text-slate-400">{bus.seatType} · {bus.isAC ? 'AC' : 'Non-AC'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {formatPrice(bus.startingPrice)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteBus(bus.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Bus Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Bookings Transaction Log */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Traveler & Contact</th>
                  <th className="py-3 px-4">Journey</th>
                  <th className="py-3 px-4">Date & Seats</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      #{b.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{b.passengers[0]?.name || 'Traveler'}</div>
                      <div className="text-[10px] text-slate-400">{b.contactEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{b.source} ➔ {b.destination}</div>
                      <div className="text-[10px] text-slate-400">{b.busOperator}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono">{b.departureDate}</div>
                      <div className="text-[10px] font-bold text-blue-600">Seats: {b.selectedSeatNumbers.join(', ')}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {formatPrice(b.totalAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Bus Modal */}
      {showAddBusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Add New Bus Route to Fleet</h3>
            <form onSubmit={handleCreateBus} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Operator Name</label>
                  <input
                    type="text"
                    required
                    value={newOperator}
                    onChange={(e) => setNewOperator(e.target.value)}
                    placeholder="e.g. Royal Travels Express"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Bus Number</label>
                  <input
                    type="text"
                    required
                    value={newBusNumber}
                    onChange={(e) => setNewBusNumber(e.target.value)}
                    placeholder="e.g. TG-9901-AC"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Source</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Destination</label>
                  <input
                    type="text"
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Departure Time</label>
                  <input
                    type="time"
                    value={newDepTime}
                    onChange={(e) => setNewDepTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Arrival Time</label>
                  <input
                    type="time"
                    value={newArrTime}
                    onChange={(e) => setNewArrTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Seat Layout</label>
                  <select
                    value={newSeatType}
                    onChange={(e) => setNewSeatType(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Sleeper">Sleeper (2+1 Lower/Upper)</option>
                    <option value="Seater">Seater (2+2 Recliner)</option>
                    <option value="Semi-Sleeper">Semi-Sleeper (2+2)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Save Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
