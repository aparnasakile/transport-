import React from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import {
  Compass,
  ShieldCheck,
  Headphones,
  CreditCard,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, executeSearch } = useTravel();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Trust Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Zero Hidden Fees</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Exact ticket fares with itemized GST and complimentary travel insurance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Instant Auto-Refunds</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cancel any booking with 1 click; funds routed back directly within 2-4 hours.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Live GPS Tracking</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Real-time bus arrival ETA updates and boarding landmark guidance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">24x7 Roadside Support</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dedicated round-the-clock helpline for traveler safety and bus connections.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 text-xs">
          
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white font-sans">
                Trip<span className="text-blue-500">Go</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm text-[11px]">
              TripGo is an all-in-one travel and transportation ecosystem built to discover, compare, and book verified buses, trains, outstation taxis, flights, and custom daily itineraries.
            </p>
            <div className="text-[10px] text-slate-500">
              © 2026 TripGo Technologies Inc. All rights reserved.
            </div>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Explore Routes
            </h5>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li><button onClick={() => executeSearch('Delhi', 'Manali', '2026-10-05', 'bus')} className="hover:text-white transition-colors">Delhi to Manali Bus</button></li>
              <li><button onClick={() => executeSearch('Mumbai', 'Goa', '2026-10-05', 'bus')} className="hover:text-white transition-colors">Mumbai to Goa Sleeper</button></li>
              <li><button onClick={() => executeSearch('Bangalore', 'Goa', '2026-10-05', 'bus')} className="hover:text-white transition-colors">Bangalore to Goa Volvo</button></li>
              <li><button onClick={() => executeSearch('Delhi', 'Jaipur', '2026-10-05', 'bus')} className="hover:text-white transition-colors">Delhi to Jaipur Express</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Platform Features
            </h5>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li><button onClick={() => setCurrentView('timetable')} className="hover:text-white transition-colors">Live Timetables</button></li>
              <li><button onClick={() => setCurrentView('compare')} className="hover:text-white transition-colors">Modal Comparison</button></li>
              <li><button onClick={() => setCurrentView('planner')} className="hover:text-white transition-colors">Trip Itinerary AI</button></li>
              <li><button onClick={() => setCurrentView('hotels')} className="hover:text-white transition-colors">Hotels & Stays</button></li>
              <li><button onClick={() => setCurrentView('offers')} className="hover:text-white transition-colors">Promo Coupons</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Help & Support
            </h5>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li><button onClick={() => setCurrentView('my_trips')} className="hover:text-white transition-colors">Cancellation & Refund</button></li>
              <li><span className="text-slate-500">24/7 Helpline: 1800-420-TRIP</span></li>
              <li><span className="text-slate-500">Email: support@tripgo.com</span></li>
              <li><button onClick={() => setCurrentView('admin')} className="hover:text-white transition-colors text-amber-400">Operator Admin Portal</button></li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
};
