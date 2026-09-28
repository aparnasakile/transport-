import React, { useState, useMemo } from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import { BusCard } from './BusCard.tsx';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Bus,
  Search,
  Check,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export const BusSearchPage: React.FC = () => {
  const { buses, isLoadingBuses, searchState, updateSearch, refreshBuses, formatPrice } = useTravel();

  // Filters State
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedSeatType, setSelectedSeatType] = useState<string>('all');
  const [acOnly, setAcOnly] = useState<boolean>(false);
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all');
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'rating' | 'departure'>('cheapest');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Available unique operators from bus list
  const availableOperators = useMemo(() => {
    const set = new Set<string>();
    buses.forEach(b => set.add(b.operator));
    return Array.from(set);
  }, [buses]);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const resetFilters = () => {
    setMaxPrice(2000);
    setSelectedSeatType('all');
    setAcOnly(false);
    setTimeFilter('all');
    setSelectedOperator('all');
    setMinRating(0);
    setSelectedAmenities([]);
    setSortBy('cheapest');
  };

  // Filter & Sort Logic
  const filteredBuses = useMemo(() => {
    let list = buses.filter(bus => {
      // Price
      if (bus.startingPrice > maxPrice) return false;

      // AC
      if (acOnly && !bus.isAC) return false;

      // Seat Type
      if (selectedSeatType !== 'all' && bus.seatType.toLowerCase() !== selectedSeatType.toLowerCase()) {
        return false;
      }

      // Operator
      if (selectedOperator !== 'all' && bus.operator !== selectedOperator) {
        return false;
      }

      // Rating
      if (minRating > 0 && bus.rating < minRating) return false;

      // Time
      if (timeFilter !== 'all') {
        const hour = parseInt(bus.departureTime.split(':')[0], 10);
        if (timeFilter === 'morning' && (hour < 6 || hour >= 12)) return false;
        if (timeFilter === 'afternoon' && (hour < 12 || hour >= 17)) return false;
        if (timeFilter === 'evening' && (hour < 17 || hour >= 21)) return false;
        if (timeFilter === 'night' && (hour < 21 && hour >= 6)) return false;
      }

      // Amenities
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(req =>
          bus.amenities.some(a => a.toLowerCase().includes(req.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'cheapest') return a.startingPrice - b.startingPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
      if (sortBy === 'fastest') {
        const getDurMinutes = (d: string) => {
          const match = d.match(/(\d+)h\s*(\d+)?m?/);
          if (!match) return 9999;
          const h = parseInt(match[1] || '0', 10);
          const m = parseInt(match[2] || '0', 10);
          return h * 60 + m;
        };
        return getDurMinutes(a.duration) - getDurMinutes(b.duration);
      }
      return 0;
    });

    return list;
  }, [buses, maxPrice, selectedSeatType, acOnly, timeFilter, selectedOperator, minRating, selectedAmenities, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Route Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
              {searchState.source} → {searchState.destination}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
              {filteredBuses.length} Buses Available
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{searchState.departureDate}</span>
            </span>
            <span>·</span>
            <span>{searchState.passengersCount} Traveler(s)</span>
            <span>·</span>
            <span>{searchState.tripType === 'round-trip' ? 'Round-Trip' : 'One-Way'}</span>
          </div>
        </div>

        {/* Mobile Filter Toggle & Desktop Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cheapest">Cheapest First</option>
              <option value="fastest">Fastest Journey</option>
              <option value="rating">Highest Rated</option>
              <option value="departure">Earliest Departure</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Bus Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Filters (Desktop + Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-6 ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filter Buses</span>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Max Price</span>
              <span className="font-mono text-blue-600">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="400"
              max="2500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>₹400</span>
              <span>₹2,500</span>
            </div>
          </div>

          {/* Seat Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Seat Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['all', 'Sleeper', 'Seater'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedSeatType(type)}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all ${
                    selectedSeatType.toLowerCase() === type.toLowerCase()
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* AC / Non-AC Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Air Conditioned (AC) Only</span>
              <input
                type="checkbox"
                checked={acOnly}
                onChange={(e) => setAcOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Departure Timings */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Departure Time
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: 'Any Time' },
                { id: 'morning', label: 'Morning (06:00 - 12:00)' },
                { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
                { id: 'evening', label: 'Evening (17:00 - 21:00)' },
                { id: 'night', label: 'Night (21:00 - 06:00)' },
              ].map((time) => (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => setTimeFilter(time.id as any)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    timeFilter === time.id
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{time.label}</span>
                  {timeFilter === time.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Operators Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Bus Operator
            </label>
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Verified Operators ({availableOperators.length})</option>
              {availableOperators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          {/* Amenities Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Amenities
            </label>
            <div className="space-y-1.5 text-xs">
              {['WiFi', 'Charging', 'Water', 'Blanket', 'Tracking'].map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </aside>

        {/* Bus List Results (9 cols) */}
        <main className="lg:col-span-9 space-y-4">
          
          {/* Status strip */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing {filteredBuses.length} of {buses.length} trips</span>
            <span className="text-emerald-700 font-medium">⚡ Real-time seat lock enabled</span>
          </div>

          {filteredBuses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <Bus className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No buses matching your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, clearing specific amenities, or searching for other nearby dates.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredBuses.map((bus) => <BusCard key={bus.id} bus={bus} />)
          )}

        </main>

      </div>

    </div>
  );
};
