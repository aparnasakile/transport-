import React from 'react';
import { TRANSPORT_COMPARISON_DATA } from '../data/mockData.ts';
import { useTravel } from '../context/TravelContext.tsx';
import {
  Layers,
  Bus,
  Train,
  Plane,
  Car,
  Compass,
  Star,
  Clock,
  Luggage,
  Leaf,
  ShieldCheck,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { TransportMode } from '../types/travel.ts';

export const TransportComparisonPage: React.FC = () => {
  const { executeSearch, searchState, formatPrice } = useTravel();

  const getModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'bus':
        return Bus;
      case 'train':
        return Train;
      case 'flight':
        return Plane;
      case 'cab':
        return Car;
      case 'car_rental':
        return Compass;
      default:
        return Bus;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
              Intercity Multi-Modal Transportation Comparison
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Unbiased side-by-side analysis for route: <strong className="text-slate-800">{searchState.source} ⇄ {searchState.destination}</strong>. Compare cost, transit hours, comfort, baggage, and carbon emissions.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRANSPORT_COMPARISON_DATA.map((item) => {
          const Icon = getModeIcon(item.mode);
          return (
            <div
              key={item.mode}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Est. Average</span>
                    <div className="text-xl font-extrabold text-blue-600 font-mono">
                      {formatPrice(item.averagePrice)}
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 mt-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  e.g. {item.operatorExample}
                </p>
              </div>

              {/* Attributes Matrix */}
              <div className="p-5 space-y-3 text-xs divide-y divide-slate-100 flex-1">
                
                {/* Duration */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Travel Duration</span>
                  </span>
                  <span className="font-bold text-slate-800">{item.duration}</span>
                </div>

                {/* Comfort Rating */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Comfort Score</span>
                  </span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <span>{item.comfortRating}</span>
                    <span className="text-slate-400 font-normal">/ 5.0</span>
                  </span>
                </div>

                {/* Frequency & Stops */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500">Frequency & Stops</span>
                  <span className="font-medium text-slate-700 text-right">{item.frequency}</span>
                </div>

                {/* Luggage Policy */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-slate-400" />
                    <span>Baggage</span>
                  </span>
                  <span className="font-medium text-slate-700 text-right">{item.luggagePolicy}</span>
                </div>

                {/* Eco / Carbon Footprint */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Carbon Impact</span>
                  </span>
                  <span className="font-semibold text-emerald-700 text-right">{item.carbonFootprint}</span>
                </div>

                {/* Cancellation Policy */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cancellation</span>
                  </span>
                  <span className="font-medium text-slate-700 text-right max-w-[180px] leading-tight">
                    {item.cancellation}
                  </span>
                </div>

                {/* Recommended For */}
                <div className="pt-2 text-[11px] bg-slate-50 p-2.5 rounded-xl text-slate-600">
                  <span className="font-bold text-slate-800">Ideal For: </span>
                  <span>{item.recommendedFor}</span>
                </div>

              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => executeSearch(searchState.source, searchState.destination, '2026-10-05', item.mode)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Explore {item.title.split('(')[0]}</span>
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
