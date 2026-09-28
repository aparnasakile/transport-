import React from 'react';
import { HeroSearch } from './HeroSearch.tsx';
import { POPULAR_DESTINATIONS, AVAILABLE_COUPONS, SAMPLE_REVIEWS } from '../data/mockData.ts';
import { useTravel } from '../context/TravelContext.tsx';
import {
  Compass,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  Tag,
  Clock,
  Bus,
  CheckCircle2,
  Heart,
  Quote
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { executeSearch, setCurrentView, formatPrice } = useTravel();

  return (
    <div className="space-y-12 pb-12">
      
      {/* 1. Large Hero Section */}
      <HeroSearch />

      {/* 2. Popular & Trending Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Trending Destinations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Top Vacation & Weekend Getaways
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('planner')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>Plan with AI Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Weather Badge */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Weather Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                    <span>{dest.weatherTemp}</span>
                    <span className="text-slate-300 font-normal">· {dest.weatherCondition.split('&')[0]}</span>
                  </div>

                  {/* Destination Name on image bottom */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-xl font-extrabold leading-tight">{dest.name}</h3>
                    <div className="text-xs text-slate-300">{dest.stateOrCountry}</div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Key Highlights
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {dest.topAttractions.slice(0, 3).map((attr, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Starting Bus Fare</span>
                  <div className="text-lg font-black text-blue-600 font-mono">
                    {formatPrice(dest.startingFare)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => executeSearch('Delhi', dest.name, '2026-10-05', 'bus')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>Book Trips</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Best Bus Routes & Cheapest Travel Strip */}
      <section className="bg-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Punctual High-Frequency Corridors
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Most Popular Intercity Bus Routes
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { from: 'Delhi', to: 'Manali', time: '13h', price: 949, bus: 'Volvo Multi-Axle' },
              { from: 'Mumbai', to: 'Goa', time: '13h 30m', price: 1450, bus: 'Mercedes Benz Sleeper' },
              { from: 'Bangalore', to: 'Goa', time: '11h 45m', price: 1150, bus: 'Volvo AC Sleeper' },
              { from: 'Delhi', to: 'Jaipur', time: '5h 15m', price: 520, bus: 'Superfast AC Seater' },
            ].map((route, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>{route.bus}</span>
                    <span className="font-mono">{route.time}</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">
                    {route.from} ➔ {route.to}
                  </h4>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Daily 12+ Departures
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400">From</span>
                    <div className="font-bold font-mono text-blue-600 text-sm">{formatPrice(route.price)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => executeSearch(route.from, route.to, '2026-10-05', 'bus')}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-lg text-xs font-bold transition-all"
                  >
                    View Buses
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Travel Offers & Coupon Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Exclusive Welcome Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Get Flat 15% OFF up to ₹250 on your very first booking
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Use promo coupon <strong className="font-mono bg-white/20 px-2 py-0.5 rounded text-white">TRIPGOFIRST</strong> at checkout. Valid on all sleeper, seater, and outstation bus operators.
            </p>
          </div>

          <div className="z-10 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('offers')}
              className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-lg transition-colors"
            >
              Browse All Coupons
            </button>
          </div>
        </div>
      </section>

      {/* 5. Verified Traveler Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Real Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Trusted by 50,000+ Happy Travelers
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Genuine verified passenger ratings from journeys across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  {rev.verifiedBooking && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Booking</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{rev.userName}</div>
                  <div className="text-[11px] text-slate-400">{rev.userCity} · {rev.targetName}</div>
                </div>
                <div className="text-[10px] text-slate-400">{rev.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
