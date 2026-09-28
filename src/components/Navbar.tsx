import React, { useState } from 'react';
import { useTravel, CurrencyType } from '../context/TravelContext.tsx';
import {
  Compass,
  Bus,
  Calendar,
  Layers,
  MapPin,
  Hotel,
  Car,
  Tag,
  Briefcase,
  ShieldCheck,
  Bell,
  Wrench,
  Globe,
  Radio,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currency,
    setCurrency,
    notifications,
    unreadNotifsCount,
    markNotificationsAsRead,
    isLiveSimulation,
    toggleLiveSimulation,
    setActiveModal,
    setExtraToolTab
  } = useTravel();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const navItems = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'buses', label: 'Buses', icon: Bus },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'compare', label: 'Comparison', icon: Layers },
    { id: 'planner', label: 'Trip Planner', icon: MapPin },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'local_transport', label: 'Cabs & Local', icon: Car },
    { id: 'offers', label: 'Offers', icon: Tag },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Brand Wordmark) - Zone 2 (4-6 Clean Nav Links) - Zone 3 (Primary Actions) */}
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                Trip<span className="text-blue-600">Go</span>
              </span>
            </button>

            {/* Live Data Simulation Switcher */}
            <button
              onClick={toggleLiveSimulation}
              title="Click to toggle live schedule simulation"
              className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors border ${
                isLiveSimulation
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Radio className={`w-3 h-3 ${isLiveSimulation ? 'animate-pulse text-emerald-600' : ''}`} />
              <span>{isLiveSimulation ? 'Live Sync Active' : 'Static Mode'}</span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Tools, Notifications, My Trips, Admin) */}
          <div className="flex items-center gap-2">
            
            {/* Travel Tools Button */}
            <button
              onClick={() => {
                setExtraToolTab('weather');
                setActiveModal('extra-tools');
              }}
              title="Travel Tools (Weather, Packing, Currency)"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <Wrench className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Tools</span>
            </button>

            {/* Currency Picker */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{currency}</span>
              </button>
              {showCurrencyDropdown && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-slate-200 shadow-xl rounded-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyType[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                        currency === curr ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{curr}</span>
                      {currency === curr && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  if (!showNotifDropdown && unreadNotifsCount > 0) {
                    markNotificationsAsRead();
                  }
                }}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                )}
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Alerts & Updates</span>
                    <span className="text-[11px] text-slate-400">{notifications.length} total</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* My Trips */}
            <button
              onClick={() => setCurrentView('my_trips')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currentView === 'my_trips'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>My Trips</span>
            </button>

            {/* Admin Portal Toggle */}
            <button
              onClick={() => setCurrentView('admin')}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
