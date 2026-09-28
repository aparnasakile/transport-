export type TransportMode = 'bus' | 'train' | 'flight' | 'cab' | 'car_rental' | 'local_transport';

export interface BusStop {
  id: string;
  name: string;
  landmark?: string;
  time: string;
}

export interface BusAmenity {
  id: string;
  name: string;
  icon: string;
}

export interface Seat {
  id: string;
  number: string;
  row: number;
  column: number;
  deck: 'lower' | 'upper';
  type: 'seater' | 'sleeper' | 'semi-sleeper';
  price: number;
  status: 'available' | 'selected' | 'occupied' | 'female_reserved' | 'male_reserved';
}

export interface Bus {
  id: string;
  operator: string;
  busNumber: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  busType: string; // e.g. "Scania Multi-Axle AC Sleeper (2+1)"
  isAC: boolean;
  seatType: 'Sleeper' | 'Seater' | 'Semi-Sleeper';
  startingPrice: number;
  rating: number;
  reviewsCount: number;
  availableSeatsCount: number;
  totalSeatsCount: number;
  amenities: string[];
  boardingPoints: BusStop[];
  droppingPoints: BusStop[];
  cancellationPolicy: {
    freeCancellationBeforeHours: number;
    refundPercentage: number;
    description: string;
  };
  liveTrackingAvailable: boolean;
  seats: Seat[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber: string;
}

export interface Booking {
  id: string;
  tripType: 'one-way' | 'round-trip';
  busId: string;
  busOperator: string;
  busNumber: string;
  source: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  boardingPoint: BusStop;
  droppingPoint: BusStop;
  passengers: Passenger[];
  selectedSeatNumbers: string[];
  contactEmail: string;
  contactPhone: string;
  baseFare: number;
  taxAmount: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  paymentStatus: 'paid' | 'refunded' | 'pending';
  bookingStatus: 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  couponCode?: string;
  qrCodeUrl?: string;
}

export interface TimetableEntry {
  id: string;
  busNumber: string;
  operator: string;
  route: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  stops: string[];
  duration: string;
  frequency: string;
  daysOfOperation: string[];
  busType: string;
  currentAvailability: 'Available' | 'Filling Fast' | 'Sold Out';
  baseFare: number;
}

export interface TransportComparison {
  mode: TransportMode;
  title: string;
  operatorExample: string;
  averagePrice: number;
  duration: string;
  comfortRating: number;
  frequency: string;
  stops: string;
  cancellation: string;
  luggagePolicy: string;
  carbonFootprint: string;
  recommendedFor: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  imageUrl: string;
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  distanceFromStation: string;
  roomType: string;
  availableRooms: number;
  address: string;
}

export interface LocalTransportOption {
  id: string;
  name: string;
  category: 'taxi' | 'auto' | 'rental_car' | 'bike_rental' | 'metro' | 'airport_transfer' | 'shuttle';
  basePrice: number;
  ratePerKm: number;
  estimatedTime: string;
  availability: string;
  capacity: string;
  idealFor: string;
}

export interface ItineraryItem {
  id: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  activityTitle: string;
  location: string;
  estimatedTravelTime: string;
  transportOption: string;
  estimatedCost: number;
  recommendedRestaurant?: string;
  description: string;
}

export interface DayItinerary {
  dayNumber: number;
  dateStr?: string;
  theme: string;
  items: ItineraryItem[];
  suggestedHotel?: string;
  dayEstimatedCost: number;
}

export interface Destination {
  id: string;
  name: string;
  stateOrCountry: string;
  category: 'popular' | 'weekend' | 'beach' | 'heritage' | 'mountain';
  imageUrl: string;
  startingFare: number;
  bestTimeToVisit: string;
  weatherTemp: string;
  weatherCondition: string;
  topAttractions: string[];
  description: string;
}

export interface Coupon {
  code: string;
  title: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minBookingAmount: number;
  maxDiscount?: number;
  validUntil: string;
  description: string;
  applicableModes: TransportMode[];
}

export interface UserReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  itemType: 'bus' | 'hotel' | 'driver' | 'destination';
  targetName: string;
  comment: string;
  verifiedBooking: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'departure' | 'schedule' | 'offer';
  timestamp: string;
  isRead: boolean;
}
