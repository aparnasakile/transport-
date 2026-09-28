import React, { useState } from 'react';
import { Bus as BusType } from '../types/travel.ts';
import { useTravel } from '../context/TravelContext.tsx';
import {
  Star,
  Clock,
  MapPin,
  Wifi,
  Zap,
  Coffee,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Tv,
  Radio
} from 'lucide-react';

interface BusCardProps {
  bus: BusType;
}

export const BusCard: React.FC<BusCardProps> = ({ bus }) => {
  const { startBookingForBus, formatPrice } = useTravel();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'amenities' | 'points' | 'policy'>('points');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      
      {/* Main Card Content */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Column 1: Operator & Bus Type (4 cols) */}
          <div className="lg:col-span-4 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 leading-snug">
                {bus.operator}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {bus.busNumber}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {bus.busType}
            </p>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 text-xs pt-1">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">
                <Star className="w-3 h-3 fill-white" />
                <span>{bus.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">{bus.reviewsCount} reviews</span>
              {bus.liveTrackingAvailable && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-teal-600 font-medium flex items-center gap-1 text-[11px]">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Live GPS</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Column 2: Departure, Duration, Arrival (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-2 items-center text-center">
            
            {/* Departure */}
            <div className="text-left">
              <span className="text-lg font-black text-slate-900">{bus.departureTime}</span>
              <div className="text-xs font-semibold text-slate-700 truncate">{bus.source}</div>
              <div className="text-[11px] text-slate-400 truncate">
                {bus.boardingPoints[0]?.name || 'Main Stand'}
              </div>
            </div>

            {/* Duration Indicator */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-500">{bus.duration}</span>
              <div className="w-full flex items-center gap-1 my-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <div className="flex-1 h-[1px] bg-slate-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              </div>
              <span className="text-[10px] text-slate-400">Direct Route</span>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <span className="text-lg font-black text-slate-900">{bus.arrivalTime}</span>
              <div className="text-xs font-semibold text-slate-700 truncate">{bus.destination}</div>
              <div className="text-[11px] text-slate-400 truncate">
                {bus.droppingPoints[0]?.name || 'City Drop'}
              </div>
            </div>

          </div>

          {/* Column 3: Pricing & Action Buttons (3 cols) */}
          <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
            <div>
              <div className="text-[11px] text-slate-400 lg:text-right">Starts from</div>
              <div className="text-2xl font-extrabold text-blue-600 font-mono lg:text-right">
                {formatPrice(bus.startingPrice)}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium lg:text-right">
                {bus.availableSeatsCount} seats left
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => startBookingForBus(bus)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95"
              >
                Select Seats
              </button>
            </div>
          </div>

        </div>

        {/* Quick Amenities Pill Strip & Details Accordion Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 text-slate-500 overflow-x-auto">
            {bus.amenities.slice(0, 4).map((amenity, i) => (
              <span key={i} className="flex items-center gap-1 text-[11px] text-slate-600 whitespace-nowrap">
                <CheckCircle2 className="w-3 h-3 text-teal-600" />
                <span>{amenity}</span>
              </span>
            ))}
            {bus.amenities.length > 4 && (
              <span className="text-[11px] text-slate-400">+{bus.amenities.length - 4} more</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors ml-auto"
          >
            <span>{isExpanded ? 'Hide Details' : 'View Stops & Policy'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Expanded Accordion Details */}
      {isExpanded && (
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 text-xs animate-in fade-in duration-150">
          
          {/* Sub-tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <button
              onClick={() => setActiveTab('points')}
              className={`px-3 py-1 font-semibold rounded-lg transition-colors ${
                activeTab === 'points' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Boarding & Dropping Points
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`px-3 py-1 font-semibold rounded-lg transition-colors ${
                activeTab === 'amenities' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Amenities ({bus.amenities.length})
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`px-3 py-1 font-semibold rounded-lg transition-colors ${
                activeTab === 'policy' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancellation & Refund Policy
            </button>
          </div>

          {activeTab === 'points' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Boarding Points ({bus.source})</span>
                </h4>
                <div className="space-y-1.5">
                  {bus.boardingPoints.map((bp) => (
                    <div key={bp.id} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">{bp.name}</div>
                        <div className="text-[10px] text-slate-400">{bp.landmark}</div>
                      </div>
                      <div className="font-mono font-bold text-blue-600">{bp.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>Dropping Points ({bus.destination})</span>
                </h4>
                <div className="space-y-1.5">
                  {bus.droppingPoints.map((dp) => (
                    <div key={dp.id} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-800">{dp.name}</div>
                        <div className="text-[10px] text-slate-400">{dp.landmark}</div>
                      </div>
                      <div className="font-mono font-bold text-teal-600">{dp.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {bus.amenities.map((item, idx) => (
                <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{bus.cancellationPolicy.refundPercentage}% Refund Guaranteed</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {bus.cancellationPolicy.description}
              </p>
              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                Cancellation cutoff: {bus.cancellationPolicy.freeCancellationBeforeHours} hours prior to departure. Refunds are directly processed to your original payment method within 2-4 hours.
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
