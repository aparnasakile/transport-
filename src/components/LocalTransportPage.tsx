import React, { useState } from 'react';
import { LOCAL_TRANSPORT_OPTIONS } from '../data/mockData.ts';
import { useTravel } from '../context/TravelContext.tsx';
import {
  Car,
  Navigation,
  Clock,
  Users,
  Compass,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LocalTransportPage: React.FC = () => {
  const { formatPrice, searchState } = useTravel();

  const [distanceKm, setDistanceKm] = useState<number>(18);
  const [bookedOption, setBookedOption] = useState<string | null>(null);

  const handleBookCab = (name: string) => {
    setBookedOption(name);
    setTimeout(() => {
      alert(`Driver assigned for ${name}! Driver details and live tracking link dispatched.`);
      setBookedOption(null);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                Local Cabs, Rentals & Transit Fare Estimator
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                On-demand taxis, auto-rickshaws, bike rentals, airport shuttles, and metro passes with live fare estimates
              </p>
            </div>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col items-end min-w-[200px]">
          <div className="flex items-center justify-between w-full text-xs font-bold text-slate-700 mb-1">
            <span>Trip Distance</span>
            <span className="font-mono text-blue-600">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min="2"
            max="60"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Grid of Local Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LOCAL_TRANSPORT_OPTIONS.map((item) => {
          const estimatedFare = item.basePrice + (item.ratePerKm * distanceKm);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Est. Total Fare</span>
                    <div className="text-xl font-extrabold text-blue-600 font-mono">
                      {formatPrice(estimatedFare)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{item.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">
                    Base: {formatPrice(item.basePrice)} + {item.ratePerKm > 0 ? `${formatPrice(item.ratePerKm)}/km` : 'Flat Daily Rate'}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Pickup Speed:</span>
                    <span className="font-semibold text-slate-800">{item.estimatedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Capacity:</span>
                    <span className="font-medium text-slate-700">{item.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Availability:</span>
                    <span className="text-emerald-700 font-medium">{item.availability}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">Best for: </span>
                  <span>{item.idealFor}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 mt-3">
                <button
                  type="button"
                  onClick={() => handleBookCab(item.name)}
                  disabled={bookedOption === item.name}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{bookedOption === item.name ? 'Assigning Vehicle...' : 'Book Ride Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
