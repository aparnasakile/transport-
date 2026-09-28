import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import {
  X,
  CloudSun,
  CheckSquare,
  DollarSign,
  PhoneCall,
  Languages,
  Users,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRightLeft
} from 'lucide-react';

export const ExtraToolsModal: React.FC = () => {
  const { activeModal, setActiveModal, extraToolTab, setExtraToolTab, formatPrice, searchState } = useTravel();

  if (activeModal !== 'extra-tools') return null;

  // Packing list state
  const [packingItems, setPackingItems] = useState([
    { id: 1, text: 'Government Photo ID & E-Tickets', done: true },
    { id: 2, text: 'Universal Mobile Charger & Power Bank', done: true },
    { id: 3, text: 'Warm fleece jacket or windbreaker', done: false },
    { id: 4, text: 'Motion sickness pills & personal medications', done: false },
    { id: 5, text: 'Reusable water bottle with filter', done: false },
    { id: 6, text: 'Sunscreen SPF 50 & polarized sunglasses', done: false },
  ]);
  const [newPackingText, setNewPackingText] = useState('');

  // Currency Converter state
  const [convAmount, setConvAmount] = useState<number>(5000);
  const [fromCurr, setFromCurr] = useState<'INR' | 'USD' | 'EUR' | 'GBP'>('INR');
  const [toCurr, setToCurr] = useState<'INR' | 'USD' | 'EUR' | 'GBP'>('USD');

  // Group Bill Splitter state
  const [splitAmount, setSplitAmount] = useState<number>(12000);
  const [splitPeople, setSplitPeople] = useState<number>(4);

  const exchangeRates: Record<string, number> = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
  };

  const calculateConverted = () => {
    const inINR = convAmount / exchangeRates[fromCurr];
    return (inINR * exchangeRates[toCurr]).toFixed(2);
  };

  const handleAddPackingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackingText.trim()) return;
    setPackingItems((prev) => [
      ...prev,
      { id: Date.now(), text: newPackingText.trim(), done: false },
    ]);
    setNewPackingText('');
  };

  const togglePackingItem = (id: number) => {
    setPackingItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    );
  };

  const deletePackingItem = (id: number) => {
    setPackingItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Traveler Toolbox & Utilities</h2>
            <p className="text-xs text-slate-400">
              Essential smart accessories for hassle-free journey planning
            </p>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'weather', label: 'Weather Forecast', icon: CloudSun },
            { id: 'packing', label: 'Packing Checklist', icon: CheckSquare },
            { id: 'currency', label: 'Currency Converter', icon: DollarSign },
            { id: 'emergency', label: 'Emergency Helplines', icon: PhoneCall },
            { id: 'language', label: 'Local Phrases', icon: Languages },
            { id: 'splitter', label: 'Group Splitter', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = extraToolTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setExtraToolTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs">
          
          {/* 1. Destination Weather */}
          {extraToolTab === 'weather' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm">
                  {searchState.destination} 5-Day Weather Forecast
                </span>
                <span className="text-emerald-700 font-medium">Ideal Travel Weather</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                {[
                  { day: 'Mon', temp: '16°C', cond: 'Sunny', icon: '☀️' },
                  { day: 'Tue', temp: '14°C', cond: 'Partly Cloudy', icon: '⛅' },
                  { day: 'Wed', temp: '12°C', cond: 'Cool Breeze', icon: '🍃' },
                  { day: 'Thu', temp: '15°C', cond: 'Crisp & Clear', icon: '🌤️' },
                  { day: 'Fri', temp: '13°C', cond: 'Light Rain', icon: '🌦️' },
                ].map((w, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-500 text-[11px]">{w.day}</div>
                    <div className="text-2xl my-1">{w.icon}</div>
                    <div className="font-extrabold text-slate-900 font-mono">{w.temp}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{w.cond}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 leading-relaxed">
                <strong>Travel Packing Tip:</strong> Temperatures drop considerably during late evenings in high-altitude hill stations. Layering with a warm jacket is highly recommended.
              </div>
            </div>
          )}

          {/* 2. Packing Checklist */}
          {extraToolTab === 'packing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm">
                  Essential Baggage Checklist ({packingItems.filter(p => p.done).length}/{packingItems.length} packed)
                </span>
              </div>

              <form onSubmit={handleAddPackingItem} className="flex gap-2">
                <input
                  type="text"
                  value={newPackingText}
                  onChange={(e) => setNewPackingText(e.target.value)}
                  placeholder="Add item (e.g. Hiking shoes, Camera lens)..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              <div className="space-y-2">
                {packingItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                      item.done
                        ? 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                        : 'bg-white text-slate-800 border-slate-200 shadow-sm'
                    }`}
                  >
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => togglePackingItem(item.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span>{item.text}</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => deletePackingItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Currency Converter */}
          {extraToolTab === 'currency' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm">Live Currency Estimator</span>
                <span className="text-slate-400 text-[11px]">Real-time Mid-Market Rates</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-slate-500 font-medium">You Pay</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={convAmount}
                      onChange={(e) => setConvAmount(Number(e.target.value))}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                    />
                    <select
                      value={fromCurr}
                      onChange={(e) => setFromCurr(e.target.value as any)}
                      className="px-2 py-2 bg-slate-100 border border-slate-200 rounded-lg font-bold"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center text-slate-400 sm:col-span-1">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-slate-500 font-medium">You Receive</label>
                  <div className="flex gap-1">
                    <div className="w-full px-2.5 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono font-black text-blue-600">
                      {calculateConverted()}
                    </div>
                    <select
                      value={toCurr}
                      onChange={(e) => setToCurr(e.target.value as any)}
                      className="px-2 py-2 bg-slate-100 border border-slate-200 rounded-lg font-bold"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Emergency Contacts */}
          {extraToolTab === 'emergency' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-900 text-sm block pb-2 border-b border-slate-100">
                National Helpline & Rapid Assistance Directory
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'National Emergency Helpline', num: '112', desc: 'Police, Ambulance & Fire unified response' },
                  { name: 'National Tourist Helpline', num: '1363 / 1800-11-1363', desc: '24/7 Multi-lingual tourist advisory' },
                  { name: 'TripGo Roadside Assistance', num: '1800-420-TRIP', desc: 'Emergency bus breakdown & medical escort' },
                  { name: 'Railway / Station Police (GRP)', num: '1512', desc: 'Platform & transit safety' },
                  { name: 'Highway Accident Emergency', num: '1033', desc: 'NHAI ambulance & towing helpline' },
                  { name: 'Women Helpline Desk', num: '1091', desc: 'Dedicated transit safety support' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="font-mono font-black text-blue-600 text-sm">{item.num}</div>
                    <div className="text-[10px] text-slate-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Local Language Cheat Sheet */}
          {extraToolTab === 'language' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-900 text-sm block pb-2 border-b border-slate-100">
                Local Travel Language Phrases (Hindi / Regional)
              </span>

              <div className="divide-y divide-slate-100">
                {[
                  { en: 'Where is the bus stand?', loc: 'Bus stand kahan hai?', note: 'Directions' },
                  { en: 'How much does this cost?', loc: 'Yeh kitne ka hai?', note: 'Bargaining & Markets' },
                  { en: 'Please turn on the AC', loc: 'Kripya AC chalu kar dijiye', note: 'In Bus / Cab' },
                  { en: 'Where is a good vegetarian restaurant?', loc: 'Achha shakahari hotel kahan milega?', note: 'Food' },
                  { en: 'Please wake me up at Manali stop', loc: 'Mujhe Manali aane par bata dena', note: 'Night bus conductor' },
                  { en: 'Thank you very much!', loc: 'Bahut bahut dhanyavaad!', note: 'Politeness' },
                ].map((ph, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">{ph.en}</div>
                      <div className="text-blue-600 font-medium italic mt-0.5">"{ph.loc}"</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                      {ph.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Group Splitter */}
          {extraToolTab === 'splitter' && (
            <div className="space-y-4">
              <span className="font-bold text-slate-900 text-sm block pb-2 border-b border-slate-100">
                Group Trip Bill Splitter
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Total Group Expense (₹)</label>
                  <input
                    type="number"
                    value={splitAmount}
                    onChange={(e) => setSplitAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Number of People</label>
                  <input
                    type="number"
                    min="1"
                    value={splitPeople}
                    onChange={(e) => setSplitPeople(Math.max(1, Number(e.target.value)))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-1">
                <div className="text-slate-600 text-xs font-medium">Each Traveler Owes</div>
                <div className="text-2xl font-black text-blue-700 font-mono">
                  {formatPrice(Math.round(splitAmount / splitPeople))}
                </div>
                <div className="text-[11px] text-slate-400">Divided equally among {splitPeople} travelers</div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
