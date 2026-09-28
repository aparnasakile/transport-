import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Bus,
  Train,
  Plane,
  Hotel,
  Coffee,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

interface RoutePoint {
  id: string;
  name: string;
  type: 'terminal' | 'station' | 'attraction' | 'hotel' | 'restaurant' | 'waypoint';
  distance: string;
  timeFromStart: string;
  description: string;
  x: number; // percentage on SVG canvas 0-100
  y: number; // percentage on SVG canvas 0-100
}

interface RouteMapVisualizerProps {
  source?: string;
  destination?: string;
}

export const RouteMapVisualizer: React.FC<RouteMapVisualizerProps> = ({
  source = 'Delhi',
  destination = 'Manali'
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'transit' | 'attractions' | 'stays'>('all');
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);

  const routePoints: RoutePoint[] = [
    {
      id: 'pt-1',
      name: `${source} ISBT Kashmiri Gate Terminal`,
      type: 'terminal',
      distance: '0 km',
      timeFromStart: '0h 00m',
      description: 'Major transit departure hub with metro connectivity and VIP departure lounge.',
      x: 15,
      y: 75,
    },
    {
      id: 'pt-2',
      name: 'Panipat Expressway Toll Plaza',
      type: 'waypoint',
      distance: '85 km',
      timeFromStart: '1h 30m',
      description: 'Yamuna Expressway corridor with modern roadside food courts and fuel stations.',
      x: 28,
      y: 65,
    },
    {
      id: 'pt-3',
      name: 'Ambala Cantt Junction Railway Station',
      type: 'station',
      distance: '200 km',
      timeFromStart: '3h 45m',
      description: 'Northern railway junction hub connecting Delhi-Shimla-Chandigarh corridor.',
      x: 42,
      y: 52,
    },
    {
      id: 'pt-4',
      name: 'Haveli Heritage Dhaba & Restaurant',
      type: 'restaurant',
      distance: '215 km',
      timeFromStart: '4h 15m',
      description: 'Iconic traditional North Indian feast & Punjabi hospitality dinner stop.',
      x: 48,
      y: 48,
    },
    {
      id: 'pt-5',
      name: 'Chandigarh Bypass & Airport Link',
      type: 'station',
      distance: '245 km',
      timeFromStart: '5h 00m',
      description: 'Scenic highway interchange heading into Himachal Shivalik foothills.',
      x: 55,
      y: 40,
    },
    {
      id: 'pt-6',
      name: 'Mandi Himalayan Valley & Beas River',
      type: 'attraction',
      distance: '410 km',
      timeFromStart: '9h 15m',
      description: 'Dramatic roaring river gorge, stone temples, and alpine mountain vistas.',
      x: 70,
      y: 28,
    },
    {
      id: 'pt-7',
      name: 'Kullu Trout Valley & Shawl Weavers',
      type: 'attraction',
      distance: '490 km',
      timeFromStart: '11h 30m',
      description: 'Famous apple orchards, river rafting points, and handmade woolen crafts.',
      x: 82,
      y: 20,
    },
    {
      id: 'pt-8',
      name: `${destination} Mall Road Terminal & Pines Resort`,
      type: 'terminal',
      distance: '535 km',
      timeFromStart: '13h 00m',
      description: 'Destination city terminal. Direct walking access to cafes and hotels.',
      x: 90,
      y: 12,
    },
  ];

  const filteredPoints = routePoints.filter((pt) => {
    if (activeFilter === 'transit') return pt.type === 'terminal' || pt.type === 'station' || pt.type === 'waypoint';
    if (activeFilter === 'attractions') return pt.type === 'attraction' || pt.type === 'restaurant';
    if (activeFilter === 'stays') return pt.type === 'hotel' || pt.type === 'terminal';
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Visualizer Top Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-sm text-slate-900">
              Interactive Route Map & Waypoints
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Total Distance: <strong className="text-slate-800">535 km</strong> · Est. Driving Time: <strong className="text-slate-800">12h 45m - 13h 00m</strong>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
          {[
            { id: 'all', label: 'All Stops' },
            { id: 'transit', label: 'Transit Hubs' },
            { id: 'attractions', label: 'Attractions & Food' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-2.5 py-1 font-semibold rounded-lg transition-colors ${
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Visualizer (SVG Canvas with Terrain Grid & Nodes) */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-900 overflow-hidden select-none">
        
        {/* Subtle Map Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Compass Rose */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-center opacity-60 text-slate-400">
          <Compass className="w-7 h-7 text-blue-400" />
          <span className="text-[9px] font-mono mt-0.5">NORTH</span>
        </div>

        {/* SVG Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Glowing Shadow line */}
          <path
            d="M 15 75 Q 35 60 55 40 T 90 12"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeOpacity="0.25"
            vectorEffect="non-scaling-stroke"
          />

          {/* Animated Road Track line */}
          <path
            d="M 15 75 Q 35 60 55 40 T 90 12"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        </svg>

        {/* Interactive Waypoint Pins */}
        {filteredPoints.map((pt) => {
          const isSelected = selectedPoint?.id === pt.id;
          return (
            <button
              key={pt.id}
              type="button"
              onClick={() => setSelectedPoint(pt)}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none transition-transform ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-115'
              }`}
            >
              {/* Outer pulsing ring */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-blue-500 text-white ring-4 ring-blue-400/50 shadow-lg'
                    : 'bg-slate-800 text-slate-200 border-2 border-slate-600 hover:border-blue-400'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
              </div>

              {/* Tooltip Tag */}
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap px-2 py-1 rounded-md text-[10px] font-bold transition-all pointer-events-none ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-700 opacity-0 group-hover:opacity-100'
                }`}
              >
                {pt.name.split(' ')[0]} ({pt.distance})
              </div>
            </button>
          );
        })}

        {/* Selected Point Popover in Map corner */}
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-slate-900/95 border border-slate-700 backdrop-blur-md rounded-xl p-3.5 text-white z-30 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-1.5">
              <span className="font-bold text-xs text-blue-400">{selectedPoint.name}</span>
              <button
                type="button"
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
              {selectedPoint.description}
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Distance: {selectedPoint.distance}</span>
              <span>Transit Time: {selectedPoint.timeFromStart}</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
