import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import { BusStop, Seat } from '../types/travel.ts';
import {
  X,
  CircleDot,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

export const SeatSelectionModal: React.FC = () => {
  const {
    selectedBus,
    activeModal,
    setActiveModal,
    selectedSeats,
    toggleSeat,
    clearSeats,
    selectedBoardingPoint,
    setSelectedBoardingPoint,
    selectedDroppingPoint,
    setSelectedDroppingPoint,
    searchState,
    calculateFareBreakdown,
    formatPrice
  } = useTravel();

  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');

  if (activeModal !== 'seats' || !selectedBus) return null;

  const isSleeper = selectedBus.seatType === 'Sleeper';
  const seatsToDisplay = isSleeper
    ? selectedBus.seats.filter((s) => s.deck === activeDeck)
    : selectedBus.seats;

  const { baseFare, taxes, serviceFee, total } = calculateFareBreakdown();

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least 1 seat to proceed with booking.');
      return;
    }
    setActiveModal('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">{selectedBus.operator}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                {selectedBus.busNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedBus.source} → {selectedBus.destination} · {selectedBus.busType}
            </p>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive Seat Grid */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Sleeper Deck Selector Tabs */}
            {isSleeper && (
              <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-4 w-full max-w-xs justify-center">
                <button
                  type="button"
                  onClick={() => setActiveDeck('lower')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeDeck === 'lower'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Lower Deck (Berths)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDeck('upper')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeDeck === 'upper'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Upper Deck (Berths)
                </button>
              </div>
            )}

            {/* Seat Map Enclosure */}
            <div className="w-full max-w-sm bg-slate-50 border-2 border-slate-300 rounded-3xl p-4 shadow-inner relative">
              
              {/* Bus Front Driver Cabin */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-dashed border-slate-300 px-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  </div>
                  <span>Front / Driver</span>
                </div>
                <div className="text-[11px] font-medium text-slate-500">
                  Entrance Door ↗
                </div>
              </div>

              {/* Grid of Seats */}
              {isSleeper ? (
                /* 2+1 Sleeper Berths Layout */
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((rowNum) => {
                    const rowSeats = seatsToDisplay.filter((s) => s.row === rowNum);
                    const seatA = rowSeats.find((s) => s.column === 1);
                    const seatB = rowSeats.find((s) => s.column === 2);
                    const seatC = rowSeats.find((s) => s.column === 3);

                    return (
                      <div key={rowNum} className="flex items-center justify-between gap-3">
                        {/* Left Pair Berths */}
                        <div className="flex items-center gap-2">
                          {seatA && renderSleeperBerth(seatA, selectedSeats, toggleSeat, formatPrice)}
                          {seatB && renderSleeperBerth(seatB, selectedSeats, toggleSeat, formatPrice)}
                        </div>

                        {/* Gangway aisle */}
                        <div className="w-6 text-center text-[10px] text-slate-300 font-mono select-none">
                          | |
                        </div>

                        {/* Right Single Berth */}
                        <div className="flex items-center">
                          {seatC && renderSleeperBerth(seatC, selectedSeats, toggleSeat, formatPrice)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* 2+2 Seater Layout */
                <div className="space-y-2.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((rowNum) => {
                    const rowSeats = seatsToDisplay.filter((s) => s.row === rowNum);
                    const seatA = rowSeats.find((s) => s.column === 1);
                    const seatB = rowSeats.find((s) => s.column === 2);
                    const seatC = rowSeats.find((s) => s.column === 3);
                    const seatD = rowSeats.find((s) => s.column === 4);

                    return (
                      <div key={rowNum} className="flex items-center justify-between gap-2">
                        {/* Left side 2 seats */}
                        <div className="flex items-center gap-2">
                          {seatA && renderStandardSeat(seatA, selectedSeats, toggleSeat, formatPrice)}
                          {seatB && renderStandardSeat(seatB, selectedSeats, toggleSeat, formatPrice)}
                        </div>

                        {/* Center aisle */}
                        <div className="w-5 text-center text-[9px] text-slate-300 select-none">·</div>

                        {/* Right side 2 seats */}
                        <div className="flex items-center gap-2">
                          {seatC && renderStandardSeat(seatC, selectedSeats, toggleSeat, formatPrice)}
                          {seatD && renderStandardSeat(seatD, selectedSeats, toggleSeat, formatPrice)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Rear Marker */}
              <div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-4 pt-2 border-t border-dashed border-slate-300">
                Back of Bus
              </div>
            </div>

            {/* Color Legend (As specified in prompt: Available = Green, Selected = Blue, Occupied = Gray) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs font-medium w-full max-w-sm">
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-blue-50 text-blue-800">
                <span className="w-3.5 h-3.5 rounded bg-blue-600" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-100 text-slate-600">
                <span className="w-3.5 h-3.5 rounded bg-slate-300" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-rose-50 text-rose-800">
                <span className="w-3.5 h-3.5 rounded bg-rose-400" />
                <span>Ladies</span>
              </div>
            </div>

          </div>

          {/* Right Column: Boarding/Dropping & Price Summary */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              
              {/* Boarding Point Dropdown */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Boarding Point ({selectedBus.source})</span>
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedBus.boardingPoints.map((bp) => {
                    const isSelected = selectedBoardingPoint?.id === bp.id;
                    return (
                      <button
                        key={bp.id}
                        type="button"
                        onClick={() => setSelectedBoardingPoint(bp)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{bp.name}</div>
                          <div className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {bp.landmark}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-xs">{bp.time}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dropping Point Dropdown */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>Select Dropping Point ({selectedBus.destination})</span>
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedBus.droppingPoints.map((dp) => {
                    const isSelected = selectedDroppingPoint?.id === dp.id;
                    return (
                      <button
                        key={dp.id}
                        type="button"
                        onClick={() => setSelectedDroppingPoint(dp)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{dp.name}</div>
                          <div className={`text-[11px] ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                            {dp.landmark}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-xs">{dp.time}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Seats Summary Box */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-2">
                  <span>Selected Seats ({selectedSeats.length})</span>
                  {selectedSeats.length > 0 && (
                    <button
                      type="button"
                      onClick={clearSeats}
                      className="text-blue-600 hover:text-blue-800 underline text-[11px]"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {selectedSeats.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    Click available seats on the map to add travelers (Max {searchState.passengersCount} seats).
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((num) => (
                      <span
                        key={num}
                        className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-mono text-xs font-bold shadow-sm flex items-center gap-1"
                      >
                        <span>{num}</span>
                        <button
                          type="button"
                          onClick={() => toggleSeat(num)}
                          className="hover:text-rose-200 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Checkout CTA Strip */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[11px] text-slate-500">Total Price ({selectedSeats.length} Seats)</div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {formatPrice(total)}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <span>Incl. 5% GST & insurance</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceed}
                disabled={selectedSeats.length === 0}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  selectedSeats.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 active:scale-[0.99]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Proceed to Passenger Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

// Helper: render Sleeper Berth
function renderSleeperBerth(
  seat: Seat,
  selectedList: string[],
  onToggle: (num: string) => void,
  formatPrice: (p: number) => string
) {
  const isSelected = selectedList.includes(seat.number);
  const isOccupied = seat.status === 'occupied';
  const isFemale = seat.status === 'female_reserved';

  let bgClass = 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm';
  if (isSelected) {
    bgClass = 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md scale-105';
  } else if (isOccupied) {
    bgClass = 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60';
  } else if (isFemale) {
    bgClass = 'bg-rose-400 text-white hover:bg-rose-500';
  }

  return (
    <button
      type="button"
      disabled={isOccupied}
      onClick={() => onToggle(seat.number)}
      title={`${seat.number} · ${formatPrice(seat.price)} (${seat.status})`}
      className={`w-14 h-24 rounded-lg flex flex-col justify-between p-1.5 text-center transition-all ${bgClass}`}
    >
      <div className="flex items-center justify-between text-[10px] font-bold">
        <span>{seat.number}</span>
        {isFemale && <span className="text-[8px] bg-white/30 px-0.5 rounded">F</span>}
      </div>
      <div className="w-8 h-2 mx-auto rounded-full bg-white/30 my-auto" />
      <div className="text-[9px] font-mono opacity-90">{formatPrice(seat.price)}</div>
    </button>
  );
}

// Helper: render Standard Seater
function renderStandardSeat(
  seat: Seat,
  selectedList: string[],
  onToggle: (num: string) => void,
  formatPrice: (p: number) => string
) {
  const isSelected = selectedList.includes(seat.number);
  const isOccupied = seat.status === 'occupied';
  const isFemale = seat.status === 'female_reserved';

  let bgClass = 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm';
  if (isSelected) {
    bgClass = 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md scale-105';
  } else if (isOccupied) {
    bgClass = 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60';
  } else if (isFemale) {
    bgClass = 'bg-rose-400 text-white hover:bg-rose-500';
  }

  return (
    <button
      type="button"
      disabled={isOccupied}
      onClick={() => onToggle(seat.number)}
      title={`${seat.number} · ${formatPrice(seat.price)}`}
      className={`w-10 h-10 rounded-lg flex flex-col justify-between p-1 text-center transition-all ${bgClass}`}
    >
      <span className="text-[10px] font-bold leading-none">{seat.number}</span>
      <span className="text-[8px] font-mono leading-none opacity-90">
        {formatPrice(seat.price).replace(/[₹$€£]/, '')}
      </span>
    </button>
  );
}
