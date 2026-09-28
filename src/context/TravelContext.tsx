import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Booking,
  Bus,
  BusStop,
  NotificationItem,
  Passenger,
  TransportMode
} from '../types/travel.ts';
import { SAMPLE_BUSES } from '../data/mockData.ts';
import confetti from 'canvas-confetti';

export type CurrencyType = 'INR' | 'USD' | 'EUR' | 'GBP';

interface SearchState {
  source: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengersCount: number;
  tripType: 'one-way' | 'round-trip';
  transportMode: TransportMode;
}

interface TravelContextType {
  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;

  // Search State
  searchState: SearchState;
  updateSearch: (partial: Partial<SearchState>) => void;
  executeSearch: (source: string, destination: string, date: string, mode?: TransportMode) => void;

  // Buses
  buses: Bus[];
  isLoadingBuses: boolean;
  selectedBus: Bus | null;
  setSelectedBus: (bus: Bus | null) => void;
  refreshBuses: () => Promise<void>;

  // Seat Selection & Booking
  selectedSeats: string[];
  toggleSeat: (seatNumber: string) => void;
  clearSeats: () => void;
  selectedBoardingPoint: BusStop | null;
  setSelectedBoardingPoint: (stop: BusStop | null) => void;
  selectedDroppingPoint: BusStop | null;
  setSelectedDroppingPoint: (stop: BusStop | null) => void;
  passengers: Passenger[];
  updatePassenger: (index: number, p: Partial<Passenger>) => void;

  // Pricing & Coupon
  appliedCoupon: { code: string; discountAmount: number; title: string } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  calculateFareBreakdown: () => {
    baseFare: number;
    taxes: number;
    serviceFee: number;
    discount: number;
    total: number;
  };

  // Modals & Flow
  activeModal: 'seats' | 'checkout' | 'ticket' | 'extra-tools' | null;
  setActiveModal: (modal: 'seats' | 'checkout' | 'ticket' | 'extra-tools' | null) => void;
  activeTicket: Booking | null;
  setActiveTicket: (ticket: Booking | null) => void;

  // Actions
  startBookingForBus: (bus: Bus) => void;
  confirmBooking: (paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet', contactEmail: string, contactPhone: string) => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; refundAmount?: number; error?: string }>;

  // Bookings list & Notifications
  bookings: Booking[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationsAsRead: () => void;

  // Currency & Formats
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  formatPrice: (inrAmount: number) => string;

  // Live simulation mode
  isLiveSimulation: boolean;
  toggleLiveSimulation: () => void;

  // Extra tools
  extraToolTab: 'weather' | 'packing' | 'currency' | 'emergency' | 'language' | 'splitter';
  setExtraToolTab: (tab: 'weather' | 'packing' | 'currency' | 'emergency' | 'language' | 'splitter') => void;
}

const CURRENCY_RATES: Record<CurrencyType, { symbol: string; rate: number }> = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  EUR: { symbol: '€', rate: 0.011 },
  GBP: { symbol: '£', rate: 0.0095 },
};

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('home');

  // Search State
  const [searchState, setSearchState] = useState<SearchState>({
    source: 'Delhi',
    destination: 'Manali',
    departureDate: '2026-10-05',
    returnDate: '2026-10-10',
    passengersCount: 2,
    tripType: 'one-way',
    transportMode: 'bus'
  });

  const [buses, setBuses] = useState<Bus[]>(SAMPLE_BUSES);
  const [isLoadingBuses, setIsLoadingBuses] = useState<boolean>(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  // Seat & Booking
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<BusStop | null>(null);
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<BusStop | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: 'Traveler 1', age: 28, gender: 'male', seatNumber: '' },
    { name: 'Traveler 2', age: 26, gender: 'female', seatNumber: '' },
  ]);

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; title: string } | null>(null);
  const [activeModal, setActiveModal] = useState<'seats' | 'checkout' | 'ticket' | 'extra-tools' | null>(null);
  const [activeTicket, setActiveTicket] = useState<Booking | null>(null);

  // User bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currency, setCurrency] = useState<CurrencyType>('INR');
  const [isLiveSimulation, setIsLiveSimulation] = useState<boolean>(true);
  const [extraToolTab, setExtraToolTab] = useState<'weather' | 'packing' | 'currency' | 'emergency' | 'language' | 'splitter'>('weather');

  // Load initial data from backend API
  const refreshBuses = async () => {
    setIsLoadingBuses(true);
    try {
      const q = new URLSearchParams({
        from: searchState.source,
        to: searchState.destination,
        date: searchState.departureDate
      });
      const res = await fetch(`/api/buses?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBuses(data.buses || []);
      }
    } catch {
      // Fallback to local sample buses
      setBuses(SAMPLE_BUSES);
    } finally {
      setIsLoadingBuses(false);
    }
  };

  const loadBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {
      // silent fallback
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
      }
    } catch {
      // silent fallback
    }
  };

  useEffect(() => {
    refreshBuses();
    loadBookings();
    loadNotifications();
  }, []);

  const updateSearch = (partial: Partial<SearchState>) => {
    setSearchState(prev => {
      const next = { ...prev, ...partial };
      // Keep passenger count synced
      if (partial.passengersCount !== undefined) {
        const count = partial.passengersCount;
        setPassengers(old => {
          const arr = [...old];
          if (arr.length < count) {
            for (let i = arr.length; i < count; i++) {
              arr.push({ name: `Traveler ${i + 1}`, age: 25, gender: 'other', seatNumber: '' });
            }
          } else if (arr.length > count) {
            arr.splice(count);
          }
          return arr;
        });
      }
      return next;
    });
  };

  const executeSearch = (source: string, destination: string, date: string, mode?: TransportMode) => {
    updateSearch({
      source,
      destination,
      departureDate: date,
      ...(mode ? { transportMode: mode } : {})
    });

    if (mode === 'train' || mode === 'flight' || mode === 'cab' || mode === 'car_rental') {
      setCurrentView('compare');
    } else {
      setCurrentView('buses');
      setTimeout(() => {
        refreshBuses();
      }, 50);
    }
  };

  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats(prev => {
      let next: string[];
      if (prev.includes(seatNumber)) {
        next = prev.filter(s => s !== seatNumber);
      } else {
        if (prev.length >= searchState.passengersCount) {
          // Replace the earliest selection or cap to passengersCount
          next = [...prev.slice(1), seatNumber];
        } else {
          next = [...prev, seatNumber];
        }
      }

      // Sync seats with passengers
      setPassengers(pList =>
        pList.map((p, idx) => ({
          ...p,
          seatNumber: next[idx] || ''
        }))
      );

      return next;
    });
  };

  const clearSeats = () => {
    setSelectedSeats([]);
    setPassengers(pList => pList.map(p => ({ ...p, seatNumber: '' })));
  };

  const updatePassenger = (index: number, partial: Partial<Passenger>) => {
    setPassengers(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], ...partial };
      }
      return next;
    });
  };

  const startBookingForBus = (bus: Bus) => {
    setSelectedBus(bus);
    setSelectedBoardingPoint(bus.boardingPoints[0] || null);
    setSelectedDroppingPoint(bus.droppingPoints[0] || null);
    setSelectedSeats([]);
    setActiveModal('seats');
  };

  const calculateFareBreakdown = () => {
    if (!selectedBus) {
      return { baseFare: 0, taxes: 0, serviceFee: 0, discount: 0, total: 0 };
    }

    let baseFare = 0;
    selectedSeats.forEach(sNum => {
      const seat = selectedBus.seats.find(s => s.number === sNum);
      baseFare += seat ? seat.price : selectedBus.startingPrice;
    });

    // If no seats chosen yet, calculate estimate for passenger count
    if (baseFare === 0) {
      baseFare = selectedBus.startingPrice * searchState.passengersCount;
    }

    const taxes = Math.round(baseFare * 0.05); // 5% GST
    const serviceFee = 40;
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const total = Math.max(0, baseFare + taxes + serviceFee - discount);

    return { baseFare, taxes, serviceFee, discount, total };
  };

  const applyCoupon = async (code: string) => {
    const { baseFare } = calculateFareBreakdown();
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount: baseFare })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          title: data.title
        });
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Coupon could not be applied' };
      }
    } catch {
      // Local fallback
      if (code.toUpperCase() === 'TRIPGOFIRST') {
        const disc = Math.min(250, Math.round(baseFare * 0.15));
        setAppliedCoupon({ code: 'TRIPGOFIRST', discountAmount: disc, title: 'First Trip Offer' });
        return { success: true, message: `Coupon TRIPGOFIRST applied! Saved ₹${disc}` };
      }
      return { success: false, message: 'Invalid coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const confirmBooking = async (
    paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet',
    contactEmail: string,
    contactPhone: string
  ) => {
    if (!selectedBus) return { success: false, error: 'No bus selected' };
    if (selectedSeats.length === 0) return { success: false, error: 'Please choose at least 1 seat' };

    // Format passengers with their assigned seats
    const finalPassengers = passengers.map((p, idx) => ({
      name: p.name.trim() || `Passenger ${idx + 1}`,
      age: Number(p.age) || 25,
      gender: p.gender || 'other',
      seatNumber: selectedSeats[idx] || selectedSeats[0]
    }));

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: selectedBus.id,
          tripType: searchState.tripType,
          departureDate: searchState.departureDate,
          boardingPoint: selectedBoardingPoint,
          droppingPoint: selectedDroppingPoint,
          passengers: finalPassengers,
          contactEmail,
          contactPhone,
          paymentMethod,
          couponCode: appliedCoupon?.code
        })
      });

      const data = await res.json();
      if (res.ok && data.booking) {
        setBookings(prev => [data.booking, ...prev]);
        setActiveTicket(data.booking);
        setActiveModal('ticket');

        // Confetti celebration!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Refresh buses state to reflect booked seats
        refreshBuses();
        loadNotifications();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Booking failed' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during booking' };
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(prev =>
          prev.map(b => (b.id === bookingId ? { ...b, bookingStatus: 'cancelled', paymentStatus: 'refunded' } : b))
        );
        refreshBuses();
        loadNotifications();
        return { success: true, refundAmount: data.refundAmount };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Error cancelling booking' };
    }
  };

  const markNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await fetch('/api/notifications/mark-read', { method: 'POST' });
    } catch {
      // ignore
    }
  };

  const formatPrice = (inrAmount: number) => {
    const config = CURRENCY_RATES[currency];
    const converted = Math.round(inrAmount * config.rate);
    return `${config.symbol}${converted.toLocaleString()}`;
  };

  const toggleLiveSimulation = () => {
    setIsLiveSimulation(prev => !prev);
  };

  return (
    <TravelContext.Provider
      value={{
        currentView,
        setCurrentView,
        searchState,
        updateSearch,
        executeSearch,
        buses,
        isLoadingBuses,
        selectedBus,
        setSelectedBus,
        refreshBuses,
        selectedSeats,
        toggleSeat,
        clearSeats,
        selectedBoardingPoint,
        setSelectedBoardingPoint,
        selectedDroppingPoint,
        setSelectedDroppingPoint,
        passengers,
        updatePassenger,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        calculateFareBreakdown,
        activeModal,
        setActiveModal,
        activeTicket,
        setActiveTicket,
        startBookingForBus,
        confirmBooking,
        cancelBooking,
        bookings,
        notifications,
        unreadNotifsCount: notifications.filter(n => !n.isRead).length,
        markNotificationsAsRead,
        currency,
        setCurrency,
        formatPrice,
        isLiveSimulation,
        toggleLiveSimulation,
        extraToolTab,
        setExtraToolTab,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const ctx = useContext(TravelContext);
  if (!ctx) throw new Error('useTravel must be used within TravelProvider');
  return ctx;
};
