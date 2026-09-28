import React, { useState, useMemo } from 'react';
import { SAMPLE_HOTELS } from '../data/mockData.ts';
import { useTravel } from '../context/TravelContext.tsx';
import {
  Hotel as HotelIcon,
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Check
} from 'lucide-react';

export const HotelsPage: React.FC = () => {
  const { formatPrice } = useTravel();

  const [cityFilter, setCityFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [bookedHotelId, setBookedHotelId] = useState<string | null>(null);

  const filteredHotels = useMemo(() => {
    return SAMPLE_HOTELS.filter((h) => {
      if (cityFilter !== 'all' && h.city.toLowerCase() !== cityFilter.toLowerCase()) {
        return false;
      }
      if (h.pricePerNight > maxPrice) return false;
      if (minRating > 0 && h.rating < minRating) return false;
      return true;
    });
  }, [cityFilter, maxPrice, minRating]);

  const handleBookHotel = (id: string) => {
    setBookedHotelId(id);
    setTimeout(() => {
      alert('Hotel reservation confirmed! Confirmation voucher sent to your registered email.');
      setBookedHotelId(null);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <HotelIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                Verified Hotels & Resorts Discovery
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Carefully inspected boutique stays, luxury resorts, and budget city inns with zero cancellation penalty
              </p>
            </div>
          </div>
        </div>

        {/* City Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'Manali', 'Goa', 'Jaipur'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setCityFilter(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                cityFilter === city
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {city === 'all' ? 'All Destinations' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-700">Filter By Price & Rating:</span>
          
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Max Night:</span>
            <input
              type="range"
              min="2000"
              max="6000"
              step="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-28 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="font-mono font-bold text-blue-600">{formatPrice(maxPrice)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Rating:</span>
          {[0, 4.5, 4.8].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(r)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                minRating === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 0 ? 'All' : `${r}+ ⭐`}
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Hotel Image with Fallback and Badges */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{hotel.rating}</span>
                  <span className="text-slate-400 font-normal">({hotel.reviewsCount})</span>
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase">
                  {hotel.availableRooms} Rooms Left
                </div>
              </div>

              {/* Hotel Details */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{hotel.address}</span>
                  </div>
                  <div className="text-[11px] text-blue-600 font-medium mt-0.5">
                    {hotel.distanceFromStation}
                  </div>
                </div>

                {/* Room Type */}
                <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg font-medium">
                  Room: {hotel.roomType}
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hotel.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Booking Button */}
            <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400">Price per night</span>
                <div className="text-xl font-extrabold text-blue-600 font-mono">
                  {formatPrice(hotel.pricePerNight)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleBookHotel(hotel.id)}
                disabled={bookedHotelId === hotel.id}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                {bookedHotelId === hotel.id ? 'Reserving...' : 'Book Room'}
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
