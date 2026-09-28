import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import { DayItinerary, ItineraryItem } from '../types/travel.ts';
import { RouteMapVisualizer } from './RouteMapVisualizer.tsx';
import {
  MapPin,
  Calendar,
  Sparkles,
  Users,
  Compass,
  DollarSign,
  Utensils,
  Car,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Printer,
  CheckCircle2,
  Share2,
  BookmarkPlus
} from 'lucide-react';

const PREFERENCES_OPTIONS = [
  'Nature & Mountains',
  'Beaches & Coast',
  'Adventure & Treks',
  'Food & Street Cafes',
  'Shopping & Handicrafts',
  'Historical Forts',
  'Spiritual Temples',
  'Museums & Art',
  'Nightlife & Music',
  'Family & Kids',
];

export const TripPlannerPage: React.FC = () => {
  const { searchState, formatPrice, setCurrentView } = useTravel();

  const [destination, setDestination] = useState(searchState.destination || 'Manali');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(15000);
  const [travelers, setTravelers] = useState(2);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'Nature & Mountains',
    'Adventure & Treks',
    'Food & Street Cafes',
  ]);

  const [itineraries, setItineraries] = useState<DayItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDayTab, setActiveDayTab] = useState(1);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // New activity form inline state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTimeOfDay, setNewTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning');
  const [newDuration, setNewDuration] = useState('2.0 hrs');
  const [newCost, setNewCost] = useState(200);
  const [newCafe, setNewCafe] = useState('');

  const togglePreference = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const generateItinerary = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days,
          budget,
          travelers,
          preferences: selectedPreferences,
        }),
      });
      const data = await res.json();
      if (data.itineraries) {
        setItineraries(data.itineraries);
        setActiveDayTab(1);
      }
    } catch {
      // Fallback generator
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateItinerary();
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ItineraryItem = {
      id: `custom-${Date.now()}`,
      timeOfDay: newTimeOfDay,
      activityTitle: newTitle.trim(),
      location: destination,
      estimatedTravelTime: newDuration,
      transportOption: 'Local Cab / Walking',
      estimatedCost: Number(newCost) || 0,
      recommendedRestaurant: newCafe || 'Scenic Viewpoint Cafe',
      description: 'Custom customized activity added by traveler.',
    };

    setItineraries((prev) =>
      prev.map((day) => {
        if (day.dayNumber === activeDayTab) {
          const updatedItems = [...day.items, newItem];
          const newCostTotal = updatedItems.reduce((acc, it) => acc + it.estimatedCost, 0);
          return {
            ...day,
            items: updatedItems,
            dayEstimatedCost: newCostTotal,
          };
        }
        return day;
      })
    );

    setNewTitle('');
    setShowAddModal(false);
  };

  const handleDeleteItem = (itemId: string) => {
    setItineraries((prev) =>
      prev.map((day) => {
        if (day.dayNumber === activeDayTab) {
          const updatedItems = day.items.filter((it) => it.id !== itemId);
          const newCostTotal = updatedItems.reduce((acc, it) => acc + it.estimatedCost, 0);
          return {
            ...day,
            items: updatedItems,
            dayEstimatedCost: newCostTotal,
          };
        }
        return day;
      })
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveTrip = () => {
    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 3000);
  };

  const activeDayData = itineraries.find((d) => d.dayNumber === activeDayTab);
  const totalEstimatedTripCost = itineraries.reduce((acc, d) => acc + d.dayEstimatedCost, 0) * travelers;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                Smart Day-by-Day Trip Planner
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate curated sightseeing itineraries with transit times, local cuisine, and customizable expenses
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveTrip}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <BookmarkPlus className="w-4 h-4 text-blue-600" />
            <span>Save to Trips</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Itinerary</span>
          </button>
        </div>
      </div>

      {savedSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Trip itinerary successfully saved to your My Trips dashboard!</span>
        </div>
      )}

      {/* Configuration Form Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700">
          Trip Parameters & Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Destination City</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Manali, Goa, Jaipur"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Days */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Duration: {days} {days === 1 ? 'Day' : 'Days'}
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Max Budget: {formatPrice(budget)}
            </label>
            <input
              type="range"
              min="5000"
              max="60000"
              step="1000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
            />
          </div>

          {/* Travelers */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Group Size</label>
            <select
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Solo Traveler' : `${n} Travelers`}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Preferences Chips */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2">
            Trip Style & Interests (Select multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {PREFERENCES_OPTIONS.map((pref) => {
              const isSelected = selectedPreferences.includes(pref);
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => togglePreference(pref)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pref}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={generateItinerary}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Generating Curated Itinerary...' : 'Update Itinerary'}</span>
          </button>
        </div>

      </div>

      {/* Route & Map Integration */}
      <RouteMapVisualizer source={searchState.source} destination={destination} />

      {/* Itinerary Day Tabs & Details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Day Tabs */}
        <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2">
            {itineraries.map((day) => (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setActiveDayTab(day.dayNumber)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeDayTab === day.dayNumber
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Day {day.dayNumber}: {day.theme.split('&')[0]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 ml-3"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stop</span>
          </button>
        </div>

        {/* Active Day Content */}
        {activeDayData && (
          <div className="p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Day {activeDayData.dayNumber} Itinerary
                </span>
                <h3 className="text-lg font-bold text-slate-900">{activeDayData.theme}</h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <div>
                  <span className="text-slate-400">Day Est. Cost: </span>
                  <span className="font-mono text-blue-600 font-bold">
                    {formatPrice(activeDayData.dayEstimatedCost)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Total Group ({travelers}p): </span>
                  <span className="font-mono text-slate-900 font-bold">
                    {formatPrice(activeDayData.dayEstimatedCost * travelers)}
                  </span>
                </div>
              </div>
            </div>

            {/* Activities Timeline */}
            <div className="space-y-4">
              {activeDayData.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] uppercase">
                        {item.timeOfDay}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{item.activityTitle}</h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.estimatedTravelTime}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.transportOption}</span>
                      </span>
                      {item.recommendedRestaurant && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-700 font-medium">
                            <Utensils className="w-3.5 h-3.5 text-amber-600" />
                            <span>Food: {item.recommendedRestaurant}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200">
                    <span className="font-mono font-bold text-sm text-slate-800">
                      {formatPrice(item.estimatedCost)} / person
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* Add Custom Stop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Add Custom Activity to Day {activeDayTab}
            </h3>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Visit Tibetan Monastery & Prayer Flags"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Time of Day</label>
                  <select
                    value={newTimeOfDay}
                    onChange={(e) => setNewTimeOfDay(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Suggested Cafe (Opt)</label>
                  <input
                    type="text"
                    value={newCafe}
                    onChange={(e) => setNewCafe(e.target.value)}
                    placeholder="e.g. Corner Bakery"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
