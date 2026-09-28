import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import { TransportMode } from '../types/travel.ts';
import {
  Bus,
  Train,
  Plane,
  Car,
  Compass,
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingDown
} from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const { searchState, updateSearch, executeSearch, setCurrentView, isLiveSimulation } = useTravel();

  const [fromInput, setFromInput] = useState(searchState.source);
  const [toInput, setToInput] = useState(searchState.destination);
  const [dateInput, setDateInput] = useState(searchState.departureDate);
  const [returnDateInput, setReturnDateInput] = useState(searchState.returnDate || '');
  const [passengers, setPassengers] = useState(searchState.passengersCount);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>(searchState.tripType);
  const [selectedMode, setSelectedMode] = useState<TransportMode>(searchState.transportMode);

  const [validationError, setValidationError] = useState<string | null>(null);

  const swapLocations = () => {
    const temp = fromInput;
    setFromInput(toInput);
    setToInput(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromInput.trim() || !toInput.trim()) {
      setValidationError('Please specify both source and destination cities.');
      return;
    }
    if (fromInput.trim().toLowerCase() === toInput.trim().toLowerCase()) {
      setValidationError('Source and destination cannot be the same city.');
      return;
    }
    setValidationError(null);

    updateSearch({
      source: fromInput.trim(),
      destination: toInput.trim(),
      departureDate: dateInput,
      returnDate: returnDateInput,
      passengersCount: passengers,
      tripType,
      transportMode: selectedMode
    });

    executeSearch(fromInput.trim(), toInput.trim(), dateInput, selectedMode);
  };

  const transportTabs: Array<{ id: TransportMode; label: string; icon: any }> = [
    { id: 'bus', label: 'Buses', icon: Bus },
    { id: 'train', label: 'Trains', icon: Train },
    { id: 'flight', label: 'Flights', icon: Plane },
    { id: 'cab', label: 'Cabs', icon: Car },
    { id: 'car_rental', label: 'Rentals', icon: Compass },
    { id: 'local_transport', label: 'Local Transit', icon: Sparkles },
  ];

  const quickRoutes = [
    { from: 'Delhi', to: 'Manali', price: '₹949' },
    { from: 'Mumbai', to: 'Goa', price: '₹1,450' },
    { from: 'Bangalore', to: 'Goa', price: '₹1,150' },
    { from: 'Delhi', to: 'Jaipur', price: '₹520' },
  ];

  return (
    <div className="relative pt-6 pb-12 overflow-hidden bg-slate-900 text-white">
      {/* Background Hero Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_travel_scenic_1790610330714.jpg"
          alt="Scenic travel highway with luxury bus and high-speed train"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Subtitle & Headline */}
        <div className="text-center max-w-3xl mx-auto pt-6 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>All-In-One Intercity & Multi-Modal Booking Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans text-balance">
            Where do you want to go next?
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Search, compare, and book verified buses, trains, flights, outstation cabs, and complete trip plans with zero convenience surprise fees.
          </p>
        </div>

        {/* Search Panel Box */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-4 sm:p-6 text-slate-900">
          
          {/* Mode Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-3 border-b border-slate-200 no-scrollbar">
            {transportTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedMode(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Trip Type Selector & Simulation Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 pb-3">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  checked={tripType === 'one-way'}
                  onChange={() => setTripType('one-way')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>One-Way</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  checked={tripType === 'round-trip'}
                  onChange={() => setTripType('round-trip')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>Round-Trip</span>
              </label>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Operator Direct Inventory</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">Free Cancellation Guaranteed</span>
            </div>
          </div>

          {/* Validation Banner if any */}
          {validationError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between">
              <span>{validationError}</span>
              <button
                type="button"
                onClick={() => setValidationError(null)}
                className="text-rose-500 hover:text-rose-800 text-xs underline ml-2"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* From Location */}
            <div className="md:col-span-3 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                From Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fromInput}
                  onChange={(e) => setFromInput(e.target.value)}
                  placeholder="e.g. Delhi, Mumbai, Bangalore"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="hidden md:flex md:col-span-1 items-end justify-center pb-2">
              <button
                type="button"
                onClick={swapLocations}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200 transition-colors shadow-sm"
                title="Swap source and destination"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Location */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                To Destination
              </label>
              <input
                type="text"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                placeholder="e.g. Manali, Goa, Jaipur, Ooty"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Dates (Departure + Return) */}
            <div className="md:col-span-3 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Depart Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Return (Opt)
                </label>
                <input
                  type="date"
                  disabled={tripType === 'one-way'}
                  value={returnDateInput}
                  onChange={(e) => setReturnDateInput(e.target.value)}
                  className={`w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors ${
                    tripType === 'one-way' ? 'opacity-40 cursor-not-allowed bg-slate-100' : ''
                  }`}
                />
              </div>
            </div>

            {/* Passenger Count & Search CTA */}
            <div className="md:col-span-2 flex flex-col justify-end">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Travelers
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-20 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Seat' : 'Seats'}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>

          </form>

          {/* Quick Popular Routes Strip */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
              <span>Trending Routes:</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {quickRoutes.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFromInput(r.from);
                    setToInput(r.to);
                    executeSearch(r.from, r.to, dateInput, 'bus');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors flex items-center gap-1"
                >
                  <span>{r.from} → {r.to}</span>
                  <span className="text-slate-400 font-normal">from</span>
                  <span className="font-bold text-slate-900">{r.price}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
