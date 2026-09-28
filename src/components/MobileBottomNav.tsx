import React from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import { Compass, Bus, MapPin, Briefcase, Wrench } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, setActiveModal, setExtraToolTab } = useTravel();

  const items = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'buses', label: 'Buses', icon: Bus },
    { id: 'planner', label: 'Planner', icon: MapPin },
    { id: 'my_trips', label: 'My Trips', icon: Briefcase },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg no-print">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors min-h-[44px] min-w-[56px] ${
              isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
      
      {/* Travel Tools Quick Open */}
      <button
        onClick={() => {
          setExtraToolTab('weather');
          setActiveModal('extra-tools');
        }}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-slate-500 hover:text-slate-900 min-h-[44px] min-w-[56px]"
      >
        <Wrench className="w-5 h-5 text-slate-400" />
        <span className="text-[10px] mt-0.5">Tools</span>
      </button>
    </div>
  );
};
