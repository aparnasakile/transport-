import React, { useState, useMemo } from 'react';
import { TIMETABLE_DATA } from '../data/mockData.ts';
import { useTravel } from '../context/TravelContext.tsx';
import {
  Calendar,
  Search,
  Filter,
  Clock,
  ArrowRight,
  Bus,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const { executeSearch, formatPrice } = useTravel();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');

  const operators = useMemo(() => {
    const set = new Set<string>();
    TIMETABLE_DATA.forEach((t) => set.add(t.operator));
    return Array.from(set);
  }, []);

  const filteredTimetable = useMemo(() => {
    return TIMETABLE_DATA.filter((item) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.route.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.destination.toLowerCase().includes(q) ||
          item.busNumber.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Operator filter
      if (selectedOperator !== 'all' && item.operator !== selectedOperator) {
        return false;
      }

      // Day of operation
      if (selectedDay !== 'all' && !item.daysOfOperation.includes(selectedDay)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedOperator, selectedDay]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                Intercity Bus Schedules & Timetable
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Official daily departure tables, intermediate stops, frequencies, and real-time seat availability
              </p>
            </div>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search route, city, or bus number..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-700">Filter Schedule:</span>
        </div>

        {/* Operator Dropdown */}
        <select
          value={selectedOperator}
          onChange={(e) => setSelectedOperator(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
        >
          <option value="all">All Operators ({operators.length})</option>
          {operators.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>

        {/* Day of Week */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {['all', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3 px-4">Bus & Operator</th>
                <th className="py-3 px-4">Route & Stops</th>
                <th className="py-3 px-4">Departure / Arrival</th>
                <th className="py-3 px-4">Duration & Frequency</th>
                <th className="py-3 px-4">Days Operating</th>
                <th className="py-3 px-4">Live Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTimetable.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No timetable records matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTimetable.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Operator & Bus Number */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{row.operator}</div>
                      <div className="flex items-center gap-1 mt-0.5 font-mono text-[10px] text-slate-500">
                        <Bus className="w-3 h-3 text-blue-600" />
                        <span>{row.busNumber}</span>
                        <span>·</span>
                        <span>{row.busType}</span>
                      </div>
                    </td>

                    {/* Route & Intermediate Stops */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>{row.source}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span>{row.destination}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5" title={row.stops.join(' → ')}>
                        Stops: {row.stops.join(', ')}
                      </div>
                    </td>

                    {/* Departure / Arrival Times */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 font-mono text-xs">
                        {row.departureTime} → {row.arrivalTime}
                      </div>
                      <div className="text-[10px] text-slate-400">Regular Scheduled</div>
                    </td>

                    {/* Duration & Frequency */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-700">{row.duration}</div>
                      <div className="text-[11px] text-blue-600 font-medium">{row.frequency}</div>
                    </td>

                    {/* Operating Days */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {row.daysOfOperation.map((d) => (
                          <span
                            key={d}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Availability Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.currentAvailability === 'Available'
                            ? 'bg-emerald-50 text-emerald-700'
                            : row.currentAvailability === 'Filling Fast'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{row.currentAvailability}</span>
                      </span>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        from {formatPrice(row.baseFare)}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => executeSearch(row.source, row.destination, '2026-10-05', 'bus')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        Book
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
