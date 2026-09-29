import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  SAMPLE_BUSES,
  POPULAR_DESTINATIONS,
  TIMETABLE_DATA,
  TRANSPORT_COMPARISON_DATA,
  SAMPLE_HOTELS,
  LOCAL_TRANSPORT_OPTIONS,
  AVAILABLE_COUPONS,
  SAMPLE_REVIEWS
} from './src/data/mockData.ts';
import { Booking, Bus, DayItinerary, NotificationItem, UserReview } from './src/types/travel.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory persistent state during server runtime
let busesState: Bus[] = JSON.parse(JSON.stringify(SAMPLE_BUSES));
let bookingsState: Booking[] = [
  {
    id: 'TG-BK-9281',
    tripType: 'one-way',
    busId: 'bus-101',
    busOperator: 'IntrCity SmartBus Premium',
    busNumber: 'TG-7782-LX',
    source: 'Delhi',
    destination: 'Manali',
    departureDate: '2026-10-05',
    departureTime: '19:30',
    arrivalTime: '08:30',
    duration: '13h 00m',
    boardingPoint: { id: 'bp-1', name: 'ISBT Kashmiri Gate, Pillar 42', time: '19:30', landmark: 'Metro Gate 1' },
    droppingPoint: { id: 'dp-2', name: 'Private Bus Stand Manali', time: '08:30', landmark: 'Mall Road Entrance' },
    passengers: [
      { name: 'Aparna Sakile', age: 28, gender: 'female', seatNumber: 'L1A' },
      { name: 'Rahul Sharma', age: 30, gender: 'male', seatNumber: 'L1B' }
    ],
    selectedSeatNumbers: ['L1A', 'L1B'],
    contactEmail: 'aparnasakile@gmail.com',
    contactPhone: '+91 9876543210',
    baseFare: 2598,
    taxAmount: 130,
    serviceFee: 50,
    discountAmount: 250,
    totalAmount: 2528,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    bookingDate: '2026-09-28',
    couponCode: 'TRIPGOFIRST'
  }
];

let notificationsState: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Booking Confirmed!',
    message: 'Your journey from Delhi to Manali (Bus TG-7782-LX) on Oct 5 is confirmed. Seats: L1A, L1B.',
    type: 'booking',
    timestamp: '2026-09-28 08:30',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'TripGo Festival Bonus',
    message: 'Use code FESTIVE25 for 20% off on all weekend getaways to Goa & Manali.',
    type: 'offer',
    timestamp: '2026-09-27 14:00',
    isRead: true
  }
];

let reviewsState: UserReview[] = [...SAMPLE_REVIEWS];

// n8n Cloud Workflow & Webhook Integration State
interface N8nConfig {
  workflowUrl: string;
  webhookUrl: string;
  enabled: boolean;
  lastDispatchedAt?: string;
  lastStatus?: string;
}

let n8nConfigState: N8nConfig = {
  workflowUrl: 'https://aparna2007.app.n8n.cloud/workflow/3RYEQh9b0QP3I1yB?projectId=SFPp4mx1CCaHHzIB',
  webhookUrl: 'https://aparna2007.app.n8n.cloud/webhook/tripgo-events',
  enabled: true,
  lastDispatchedAt: undefined,
  lastStatus: 'Configured & Ready'
};

async function dispatchToN8n(event: string, data: any) {
  if (!n8nConfigState.enabled || !n8nConfigState.webhookUrl) return;
  try {
    const payload = {
      event,
      timestamp: new Date().toISOString(),
      source: 'TripGo Travel Platform',
      workflowRef: n8nConfigState.workflowUrl,
      data
    };
    const response = await fetch(n8nConfigState.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    n8nConfigState.lastDispatchedAt = new Date().toISOString();
    n8nConfigState.lastStatus = `HTTP ${response.status} (${response.ok ? 'Delivered' : 'Failed'})`;
  } catch (error: any) {
    n8nConfigState.lastDispatchedAt = new Date().toISOString();
    n8nConfigState.lastStatus = `Delivery error: ${error.message || 'Network error'}`;
  }
}

// --- REST API ENDPOINTS ---

// 1. Buses Search
app.get('/api/buses', (req: Request, res: Response) => {
  const { from, to, date, seatType, acOnly, operator, sortBy } = req.query;

  let results = [...busesState];

  if (from && typeof from === 'string' && from.trim() !== '') {
    results = results.filter(b => b.source.toLowerCase().includes(from.toLowerCase()));
  }
  if (to && typeof to === 'string' && to.trim() !== '') {
    results = results.filter(b => b.destination.toLowerCase().includes(to.toLowerCase()));
  }
  if (seatType && typeof seatType === 'string' && seatType !== 'all') {
    results = results.filter(b => b.seatType.toLowerCase() === seatType.toLowerCase());
  }
  if (acOnly === 'true') {
    results = results.filter(b => b.isAC);
  }
  if (operator && typeof operator === 'string' && operator !== 'all') {
    results = results.filter(b => b.operator.toLowerCase().includes(operator.toLowerCase()));
  }

  // Sorting
  if (sortBy === 'cheapest') {
    results.sort((a, b) => a.startingPrice - b.startingPrice);
  } else if (sortBy === 'fastest') {
    results.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
  } else if (sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'departure') {
    results.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }

  res.json({
    total: results.length,
    buses: results,
    searchParams: { from, to, date, seatType, acOnly, sortBy }
  });
});

// 2. Single Bus Details
app.get('/api/buses/:id', (req: Request, res: Response) => {
  const bus = busesState.find(b => b.id === req.params.id);
  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }
  res.json(bus);
});

// 3. Create Booking with Double-Booking Prevention
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    busId,
    tripType,
    departureDate,
    boardingPoint,
    droppingPoint,
    passengers,
    contactEmail,
    contactPhone,
    paymentMethod,
    couponCode
  } = req.body;

  if (!busId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({ error: 'Missing required booking information' });
  }

  const bus = busesState.find(b => b.id === busId);
  if (!bus) {
    return res.status(404).json({ error: 'Selected bus not found' });
  }

  const requestedSeatNumbers: string[] = passengers.map(p => p.seatNumber);

  // Check seat availability to prevent double-booking
  const conflictedSeats: string[] = [];
  requestedSeatNumbers.forEach(sNum => {
    const seatObj = bus.seats.find(s => s.number === sNum);
    if (!seatObj || seatObj.status === 'occupied') {
      conflictedSeats.push(sNum);
    }
  });

  if (conflictedSeats.length > 0) {
    return res.status(409).json({
      error: `Seats ${conflictedSeats.join(', ')} were already booked by another traveler. Please select other seats.`,
      conflictedSeats
    });
  }

  // Calculate pricing
  let baseFare = 0;
  requestedSeatNumbers.forEach(sNum => {
    const seatObj = bus.seats.find(s => s.number === sNum);
    baseFare += seatObj ? seatObj.price : bus.startingPrice;
  });

  const taxAmount = Math.round(baseFare * 0.05); // 5% GST
  const serviceFee = 40;
  let discountAmount = 0;

  if (couponCode) {
    const coupon = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon && baseFare >= coupon.minBookingAmount) {
      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round((baseFare * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = coupon.discountValue;
      }
    }
  }

  const totalAmount = Math.max(0, baseFare + taxAmount + serviceFee - discountAmount);
  const bookingId = `TG-BK-${Math.floor(1000 + Math.random() * 9000)}`;

  // Mark seats as occupied (Atomic commit)
  bus.seats.forEach(s => {
    if (requestedSeatNumbers.includes(s.number)) {
      s.status = 'occupied';
    }
  });
  bus.availableSeatsCount = Math.max(0, bus.availableSeatsCount - requestedSeatNumbers.length);

  const newBooking: Booking = {
    id: bookingId,
    tripType: tripType || 'one-way',
    busId: bus.id,
    busOperator: bus.operator,
    busNumber: bus.busNumber,
    source: bus.source,
    destination: bus.destination,
    departureDate: departureDate || new Date().toISOString().split('T')[0],
    departureTime: bus.departureTime,
    arrivalTime: bus.arrivalTime,
    duration: bus.duration,
    boardingPoint: boardingPoint || bus.boardingPoints[0],
    droppingPoint: droppingPoint || bus.droppingPoints[0],
    passengers,
    selectedSeatNumbers: requestedSeatNumbers,
    contactEmail: contactEmail || 'traveler@tripgo.com',
    contactPhone: contactPhone || '+91 9999999999',
    baseFare,
    taxAmount,
    serviceFee,
    discountAmount,
    totalAmount,
    paymentMethod: paymentMethod || 'upi',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    bookingDate: new Date().toISOString().split('T')[0],
    couponCode: couponCode || undefined
  };

  bookingsState.unshift(newBooking);

  // Dispatch live event to connected n8n workflow
  dispatchToN8n('booking.confirmed', newBooking);

  // Add confirmation notification
  notificationsState.unshift({
    id: `notif-${Date.now()}`,
    title: `Ticket Confirmed #${bookingId}`,
    message: `Your booking for ${bus.operator} (${bus.source} → ${bus.destination}) is confirmed. Total paid: ₹${totalAmount}`,
    type: 'booking',
    timestamp: 'Just now',
    isRead: false
  });

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking: newBooking
  });
});

// 4. List User Bookings
app.get('/api/bookings', (req: Request, res: Response) => {
  res.json({
    total: bookingsState.length,
    bookings: bookingsState
  });
});

// 5. Cancel Booking & Compute Refund
app.post('/api/bookings/:id/cancel', (req: Request, res: Response) => {
  const booking = bookingsState.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (booking.bookingStatus === 'cancelled') {
    return res.status(400).json({ error: 'This booking is already cancelled' });
  }

  const bus = busesState.find(b => b.id === booking.busId);
  const refundPercentage = bus?.cancellationPolicy?.refundPercentage || 80;
  const refundAmount = Math.round((booking.totalAmount * refundPercentage) / 100);

  booking.bookingStatus = 'cancelled';
  booking.paymentStatus = 'refunded';

  // Dispatch cancellation to n8n
  dispatchToN8n('booking.cancelled', {
    bookingId: booking.id,
    refundAmount,
    refundPercentage,
    booking
  });

  // Free up the seats
  if (bus) {
    bus.seats.forEach(s => {
      if (booking.selectedSeatNumbers.includes(s.number)) {
        s.status = 'available';
      }
    });
    bus.availableSeatsCount = Math.min(bus.totalSeatsCount, bus.availableSeatsCount + booking.selectedSeatNumbers.length);
  }

  // Create refund notification
  notificationsState.unshift({
    id: `notif-${Date.now()}`,
    title: `Booking Cancelled & Refund Initiated`,
    message: `Booking #${booking.id} cancelled. Refund of ₹${refundAmount} (${refundPercentage}%) credited back to original payment mode.`,
    type: 'schedule',
    timestamp: 'Just now',
    isRead: false
  });

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    refundAmount,
    refundPercentage,
    booking
  });
});

// 6. Timetable
app.get('/api/timetable', (req: Request, res: Response) => {
  const { search, operator } = req.query;
  let list = [...TIMETABLE_DATA];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(item =>
      item.route.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q) ||
      item.destination.toLowerCase().includes(q) ||
      item.busNumber.toLowerCase().includes(q)
    );
  }
  if (operator && typeof operator === 'string' && operator !== 'all') {
    list = list.filter(item => item.operator.toLowerCase().includes(operator.toLowerCase()));
  }

  res.json(list);
});

// 7. Transport Comparison Matrix
app.get('/api/transport/compare', (req: Request, res: Response) => {
  res.json(TRANSPORT_COMPARISON_DATA);
});

// 8. Hotels
app.get('/api/hotels', (req: Request, res: Response) => {
  const { city } = req.query;
  let hotels = [...SAMPLE_HOTELS];
  if (city && typeof city === 'string' && city !== 'all') {
    hotels = hotels.filter(h => h.city.toLowerCase().includes(city.toLowerCase()));
  }
  res.json(hotels);
});

// 9. Destinations
app.get('/api/destinations', (req: Request, res: Response) => {
  res.json(POPULAR_DESTINATIONS);
});

// 10. Local Transport
app.get('/api/local-transport', (req: Request, res: Response) => {
  res.json(LOCAL_TRANSPORT_OPTIONS);
});

// 11. Coupons & Validation
app.get('/api/coupons', (req: Request, res: Response) => {
  res.json(AVAILABLE_COUPONS);
});

app.post('/api/coupons/apply', (req: Request, res: Response) => {
  const { code, amount } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, message: 'Please enter a coupon code' });
  }

  const coupon = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!coupon) {
    return res.status(404).json({ valid: false, message: 'Invalid promo code. Please check and retry.' });
  }

  const baseAmt = Number(amount) || 0;
  if (baseAmt < coupon.minBookingAmount) {
    return res.status(400).json({
      valid: false,
      message: `Minimum booking value of ₹${coupon.minBookingAmount} required for this coupon.`
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((baseAmt * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    valid: true,
    code: coupon.code,
    title: coupon.title,
    discountAmount: discount,
    message: `Coupon ${coupon.code} applied! Saved ₹${discount}.`
  });
});

// 12. Intelligent Trip Planner
app.post('/api/itinerary/generate', (req: Request, res: Response) => {
  const { destination = 'Manali', days = 3, budget = 15000, travelers = 2, preferences = [] } = req.body;

  const destLower = String(destination).toLowerCase();
  const dayCount = Math.min(7, Math.max(1, Number(days) || 3));

  const sampleActivitiesMap: Record<string, Array<{ title: string; cost: number; trans: string; dur: string; desc: string; cafe: string }>> = {
    manali: [
      { title: 'Morning Walk at Old Manali Pine Forest & Hadimba Temple', cost: 150, trans: 'Auto / Local Walking', dur: '2.5 hrs', desc: 'Ancient cedar woods and historic 16th century wooden pagoda temple.', cafe: 'Cafe 1947 by the river' },
      { title: 'Solang Valley Adventure & Paragliding', cost: 2200, trans: 'Shared Taxi / Cab', dur: '4.5 hrs', desc: 'Snow slopes, cable car ropeway, paragliding, and scenic Himalayan viewpoints.', cafe: 'Solang Mountain View Cafe' },
      { title: 'Jogini Waterfall Trek & Vashisht Hot Springs', cost: 100, trans: 'Footpath Hike', dur: '3.0 hrs', desc: 'Scenic mountain cascading fall with panoramic river valley views.', cafe: 'Rohan Rooftop Cafe' },
      { title: 'Rohtang Pass Snow Vista & Mountain Highway', cost: 3500, trans: 'Outstation 4x4 Cab', dur: '6.0 hrs', desc: 'Epic high-altitude mountain pass with panoramic snow glaciers.', cafe: 'Marhi Highway Dhaba' },
      { title: 'Naggar Castle & Heritage Art Gallery', cost: 300, trans: 'Local Bus / Cab', dur: '3.5 hrs', desc: 'Medieval timber castle with dramatic valley balconies and Roerich paintings.', cafe: 'Castle View Courtyard' }
    ],
    goa: [
      { title: 'Sunrise Beach Walk & Calangute Water Sports', cost: 1500, trans: 'Scooter Rental', dur: '3.0 hrs', desc: 'Jet ski, parasailing, and pristine ocean breezes along the coast.', cafe: 'Britto’s Beach Shack' },
      { title: 'Historic Fort Aguada & Sinquerim Lighthouse', cost: 200, trans: 'Rented Bike / Cab', dur: '2.5 hrs', desc: '17th-century Portuguese fortress overlooking Arabian Sea horizons.', cafe: 'Cohiba Bar & Kitchen' },
      { title: 'Fontainhas Latin Quarter Walking Tour', cost: 400, trans: 'Walking / Taxi', dur: '3.0 hrs', desc: 'Heritage pastel houses, terracotta tiled roofs, and cozy Portuguese bakeries.', cafe: 'Confeitaria 31 de Janeiro' },
      { title: 'Dudhsagar Waterfalls Safari & Spice Plantation', cost: 2200, trans: 'Jeep Safari', dur: '5.0 hrs', desc: 'Tiered waterfall inside Mollem National Park with traditional buffet lunch.', cafe: 'Tropical Spice Plantation Feast' },
      { title: 'Anjuna Flea Market & Sunset Cliffs', cost: 350, trans: 'Scooter', dur: '3.0 hrs', desc: 'Bohemian crafts, live acoustic music, and dramatic sunset over rocky cliffs.', cafe: 'Curlies Sunset Lounge' }
    ],
    jaipur: [
      { title: 'Amber Fort Elephant Rampart & Sheesh Mahal', cost: 600, trans: 'Cab / Auto', dur: '3.5 hrs', desc: 'Majestic hilltop fortress with dazzling mirrored halls and royal courtyards.', cafe: '1135 AD Fine Dining' },
      { title: 'City Palace Royal Heritage & Jantar Mantar', cost: 500, trans: 'E-Rickshaw', dur: '3.0 hrs', desc: 'Royal state museum, armory, and UNESCO astronomical stone observatory.', cafe: 'The Palace Cafe' },
      { title: 'Hawa Mahal Photo Walk & Johari Bazaar Gems', cost: 200, trans: 'Walking / Metro', dur: '2.5 hrs', desc: 'Iconic 953 honeycombed windows and bustling handicraft bazaars.', cafe: 'Wind View Cafe Rooftop' },
      { title: 'Nahargarh Fort Sunset Skyline View', cost: 300, trans: 'Cab', dur: '3.0 hrs', desc: 'Panoramic evening vista of the entire illuminated Pink City below.', cafe: 'Padao Open Air Restaurant' }
    ]
  };

  const pool = sampleActivitiesMap[destLower] || sampleActivitiesMap.manali;
  const itineraries: DayItinerary[] = [];

  for (let d = 1; d <= dayCount; d++) {
    const act1 = pool[(d * 2 - 2) % pool.length];
    const act2 = pool[(d * 2 - 1) % pool.length];

    const dayItems = [
      {
        id: `item-${d}-1`,
        timeOfDay: 'Morning' as const,
        activityTitle: act1.title,
        location: destination,
        estimatedTravelTime: act1.dur,
        transportOption: act1.trans,
        estimatedCost: act1.cost,
        recommendedRestaurant: act1.cafe,
        description: act1.desc
      },
      {
        id: `item-${d}-2`,
        timeOfDay: 'Afternoon' as const,
        activityTitle: act2.title,
        location: destination,
        estimatedTravelTime: act2.dur,
        transportOption: act2.trans,
        estimatedCost: act2.cost,
        recommendedRestaurant: act2.cafe,
        description: act2.desc
      },
      {
        id: `item-${d}-3`,
        timeOfDay: 'Evening' as const,
        activityTitle: `Local Evening Bazaar & Cultural Exploration`,
        location: `${destination} Central Hub`,
        estimatedTravelTime: '1.5 hrs',
        transportOption: 'Local Stroll / Auto',
        estimatedCost: 450,
        recommendedRestaurant: 'Local Street Delicacies & Sweets',
        description: 'Immerse yourself in authentic neighborhood sights, souvenir shops, and culinary gems.'
      }
    ];

    const dayTotal = dayItems.reduce((acc, it) => acc + it.estimatedCost, 0);

    itineraries.push({
      dayNumber: d,
      theme: d === 1 ? 'City Arrival & Landmark Discovery' : d === 2 ? 'Adventure & Natural Wonders' : d === 3 ? 'Culture, Heritage & Fine Food' : 'Hidden Gems & Leisure Experience',
      items: dayItems,
      suggestedHotel: 'TripGo Partner Deluxe Resort',
      dayEstimatedCost: dayTotal
    });
  }

  res.json({
    destination,
    days: dayCount,
    travelers,
    budget,
    preferences,
    itineraries,
    totalEstimatedExpense: itineraries.reduce((acc, day) => acc + day.dayEstimatedCost, 0) * travelers
  });
});

// 13. Notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json(notificationsState);
});

app.post('/api/notifications/mark-read', (req: Request, res: Response) => {
  notificationsState.forEach(n => { n.isRead = true; });
  res.json({ success: true });
});

// 14. Reviews
app.get('/api/reviews', (req: Request, res: Response) => {
  res.json(reviewsState);
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { userName, userCity, rating, itemType, targetName, comment } = req.body;
  if (!userName || !rating || !comment) {
    return res.status(400).json({ error: 'Name, rating, and review text are required' });
  }

  const newReview: UserReview = {
    id: `rev-${Date.now()}`,
    userName,
    userCity: userCity || 'Traveler',
    rating: Number(rating) || 5,
    date: new Date().toISOString().split('T')[0],
    itemType: itemType || 'bus',
    targetName: targetName || 'TripGo Transport',
    comment,
    verifiedBooking: true
  };

  reviewsState.unshift(newReview);
  res.status(201).json({ success: true, review: newReview });
});

// 15. Admin Statistics
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const totalBookings = bookingsState.length;
  const activeBookings = bookingsState.filter(b => b.bookingStatus === 'confirmed').length;
  const cancelledBookings = bookingsState.filter(b => b.bookingStatus === 'cancelled').length;
  const totalRevenue = bookingsState
    .filter(b => b.bookingStatus === 'confirmed')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  res.json({
    totalUsers: 1420,
    totalBookings,
    activeBookings,
    cancelledBookings,
    totalRevenue,
    popularRoutes: [
      { route: 'Delhi ⇄ Manali', bookingsCount: 480, revenue: 624000 },
      { route: 'Mumbai ⇄ Goa', bookingsCount: 390, revenue: 565500 },
      { route: 'Bangalore ⇄ Goa', bookingsCount: 290, revenue: 333500 },
      { route: 'Delhi ⇄ Jaipur', bookingsCount: 260, revenue: 135200 }
    ],
    busesCount: busesState.length,
    destinationsCount: POPULAR_DESTINATIONS.length,
    recentBookings: bookingsState.slice(0, 5)
  });
});

// Admin Add Bus
app.post('/api/admin/buses', (req: Request, res: Response) => {
  const newBus: Bus = {
    id: `bus-${Date.now()}`,
    operator: req.body.operator || 'TripGo Partner Express',
    busNumber: req.body.busNumber || 'TG-NEW-99',
    source: req.body.source || 'Delhi',
    destination: req.body.destination || 'Shimla',
    departureTime: req.body.departureTime || '21:00',
    arrivalTime: req.body.arrivalTime || '07:00',
    duration: req.body.duration || '10h 00m',
    busType: req.body.busType || 'Volvo Multi-Axle AC Sleeper',
    isAC: req.body.isAC !== false,
    seatType: req.body.seatType || 'Sleeper',
    startingPrice: Number(req.body.startingPrice) || 899,
    rating: 4.8,
    reviewsCount: 1,
    availableSeatsCount: 30,
    totalSeatsCount: 30,
    amenities: ['WiFi', 'Charging Port', 'Blanket', 'Water Bottle'],
    boardingPoints: [{ id: 'bp-1', name: 'Main Terminal', time: req.body.departureTime || '21:00' }],
    droppingPoints: [{ id: 'dp-1', name: 'City Center Hub', time: req.body.arrivalTime || '07:00' }],
    cancellationPolicy: {
      freeCancellationBeforeHours: 12,
      refundPercentage: 85,
      description: 'Standard 85% cancellation refund policy.'
    },
    liveTrackingAvailable: true,
    seats: SAMPLE_BUSES[0].seats
  };

  busesState.unshift(newBus);
  res.status(201).json({ success: true, bus: newBus });
});

// Admin Delete Bus
app.delete('/api/admin/buses/:id', (req: Request, res: Response) => {
  busesState = busesState.filter(b => b.id !== req.params.id);
  res.json({ success: true, message: 'Bus removed' });
});

// 16. n8n Cloud Integration Endpoints
app.get('/api/integrations/n8n', (_req: Request, res: Response) => {
  res.json(n8nConfigState);
});

app.post('/api/integrations/n8n', (req: Request, res: Response) => {
  const { workflowUrl, webhookUrl, enabled } = req.body;
  if (workflowUrl !== undefined) n8nConfigState.workflowUrl = workflowUrl;
  if (webhookUrl !== undefined) n8nConfigState.webhookUrl = webhookUrl;
  if (enabled !== undefined) n8nConfigState.enabled = Boolean(enabled);
  res.json({ success: true, config: n8nConfigState });
});

app.post('/api/integrations/n8n/test', async (req: Request, res: Response) => {
  const targetUrl = req.body.webhookUrl || n8nConfigState.webhookUrl;
  const samplePayload = {
    event: 'booking.confirmed',
    timestamp: new Date().toISOString(),
    source: 'TripGo Travel Platform',
    workflowRef: n8nConfigState.workflowUrl,
    data: {
      id: 'TG-BK-SAMPLE-77',
      tripType: 'one-way',
      busOperator: 'IntrCity SmartBus Premium',
      busNumber: 'TG-7782-LX',
      source: 'Delhi',
      destination: 'Manali',
      departureDate: '2026-10-05',
      departureTime: '19:30',
      arrivalTime: '08:30',
      duration: '13h 00m',
      selectedSeatNumbers: ['L1A', 'L1B'],
      passengers: [
        { name: 'Aparna Sakile', age: 28, gender: 'female', seatNumber: 'L1A' },
        { name: 'Rahul Sharma', age: 30, gender: 'male', seatNumber: 'L1B' }
      ],
      contactEmail: 'aparnasakile@gmail.com',
      contactPhone: '+91 9876543210',
      baseFare: 2598,
      taxAmount: 130,
      serviceFee: 50,
      discountAmount: 250,
      totalAmount: 2528,
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      couponCode: 'TRIPGOFIRST'
    }
  };

  try {
    const fetchResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(samplePayload)
    });

    const statusText = `HTTP ${fetchResponse.status} ${fetchResponse.statusText}`;
    n8nConfigState.lastDispatchedAt = new Date().toISOString();
    n8nConfigState.lastStatus = statusText;

    let responseBody = '';
    try {
      responseBody = await fetchResponse.text();
    } catch {
      responseBody = '';
    }

    res.json({
      success: fetchResponse.ok,
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      deliveredTo: targetUrl,
      responseBody: responseBody.slice(0, 500),
      payloadSent: samplePayload
    });
  } catch (err: any) {
    n8nConfigState.lastDispatchedAt = new Date().toISOString();
    n8nConfigState.lastStatus = `Connection Error: ${err.message}`;

    res.status(502).json({
      success: false,
      error: err.message || 'Could not connect to n8n webhook URL',
      hint: 'Make sure your Webhook node in n8n is activated (Listen for test event or Production active).',
      payloadSent: samplePayload
    });
  }
});

// 17. AI Travel Assistant Chatbot Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const systemInstruction = `You are "TripGo AI Assistant", the official intelligent travel concierge for TripGo (deployed at https://transport-seven-sable.vercel.app).
TripGo enables travelers to search, compare, and book buses, trains, flights, cabs, and rental cars, plan day-by-day itineraries, and check live timetables.

Key Platform Knowledge:
- Production App URL: https://transport-seven-sable.vercel.app
- Connected n8n Workflow: https://aparna2007.app.n8n.cloud/workflow/3RYEQh9b0QP3I1yB?projectId=SFPp4mx1CCaHHzIB
- Available Bus Routes:
  * Delhi ⇄ Manali (Volvo Sleeper 19:30 ₹1,299 / Zingbus 20:45 ₹949, 13h)
  * Mumbai ⇄ Goa (VRL Mercedes Benz Sleeper 18:00 ₹1,450, 13h 30m)
  * Bangalore ⇄ Goa (Orange Travels Volvo Sleeper 21:00 ₹1,150, 11h 45m)
  * Delhi ⇄ Jaipur (RSRTC Superfast AC Seater 06:00 ₹520, 5h 15m)
  * Delhi ⇄ Agra (Greenline Electric Zero-Emission AC Seater 07:30 ₹420, 3h 15m)
- Verified Coupons:
  * TRIPGOFIRST: 15% off up to ₹250 on first booking
  * WEEKEND150: Flat ₹150 off for travel on Friday, Saturday, or Sunday
  * FESTIVE25: 20% off up to ₹500 for groups of 2+ seats
- Cancellation Policy: 80% to 100% refund processed within 2-4 hours if cancelled 6-12+ hours prior.
- Local Commutes: Auto (₹35 base + ₹14/km), Prime Cab (₹90 base + ₹18/km), Scooter Rental (₹350/day), Metro (₹20).
- Emergency numbers: 112 (National Unified Helpline), 1800-420-TRIP (TripGo Roadside).

Provide clear, helpful, and concise responses formatted in markdown with bullet points and emojis. When giving recommendations, invite the traveler to explore or book on https://transport-seven-sable.vercel.app.`;

  try {
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({});
      const contents: any[] = [];
      if (Array.isArray(history)) {
        history.slice(-6).forEach((h: any) => {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text || h.content || '' }]
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI call timeout')), 3500)
      );
      const aiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const response: any = await Promise.race([aiPromise, timeoutPromise]);

      return res.json({
        reply: response.text || "I'm here to help you plan your journey on TripGo!",
        source: 'gemini-3.8-flash',
        liveAppUrl: 'https://transport-seven-sable.vercel.app'
      });
    }
  } catch (err: any) {
    console.error('Gemini API chat error:', err?.message || err);
  }

  // Fallback intelligent domain logic
  const lowerMsg = message.toLowerCase();
  let reply = `Hello! I'm your **TripGo Assistant** for [transport-seven-sable.vercel.app](https://transport-seven-sable.vercel.app).\n\nHere are some things I can help you with:\n• 🚌 **Bus Search**: Direct routes for Delhi, Manali, Goa, Mumbai, Jaipur, and Bangalore.\n• 🎟️ **Promo Coupons**: Use code \`TRIPGOFIRST\` for 15% off or \`WEEKEND150\` for flat ₹150 off.\n• 🗺️ **Trip Planner**: Get custom day-by-day itineraries with attractions and cafes.\n• ⚡ **n8n Automation**: Your booking events can automatically sync to your n8n workflow!`;

  if (lowerMsg.includes('delhi') && lowerMsg.includes('manali')) {
    reply = `🚌 **Delhi ➔ Manali Bus Options on TripGo:**\n\n1. **IntrCity SmartBus Premium** (Volvo 9600 AC Sleeper)\n   • Departs: 19:30 from ISBT Kashmiri Gate | Arrives: 08:30 (13h)\n   • Fare: ₹1,299 | Rating: 4.8 ⭐ | Amenities: WiFi, Blanket, Water\n\n2. **Zingbus Express Lounge** (Scania AC Semi-Sleeper)\n   • Departs: 20:45 from Akshardham | Arrives: 09:45 (13h)\n   • Fare: ₹949 | Rating: 4.6 ⭐ | Amenities: Leg rest, Live GPS\n\n👉 You can select seats and book directly on [transport-seven-sable.vercel.app](https://transport-seven-sable.vercel.app).`;
  } else if (lowerMsg.includes('coupon') || lowerMsg.includes('discount') || lowerMsg.includes('offer')) {
    reply = `🎟️ **Active Promo Coupons on TripGo:**\n\n• **\`TRIPGOFIRST\`**: 15% OFF up to ₹250 on your first booking.\n• **\`WEEKEND150\`**: Flat ₹150 OFF for travel on Fri, Sat, or Sun.\n• **\`FESTIVE25\`**: 20% OFF up to ₹500 for groups of 2+ seats.\n\n*Apply these codes during checkout on [transport-seven-sable.vercel.app](https://transport-seven-sable.vercel.app) for instant savings!*`;
  } else if (lowerMsg.includes('goa')) {
    reply = `🏖️ **Traveling to Goa?**\n\n• **Buses from Mumbai**: VRL Travels Mercedes Benz Sleeper (18:00 - 07:30) from ₹1,450.\n• **Buses from Bangalore**: Orange Travels Volvo Sleeper (21:00 - 08:45) from ₹1,150.\n• **Recommended Hotel**: Baywatch Coastal Palms Resort (Calangute, North Goa) from ₹4,100/night.\n• **Local Transit**: Self-drive scooter rentals available at ₹350/day.`;
  } else if (lowerMsg.includes('n8n') || lowerMsg.includes('workflow')) {
    reply = `⚡ **n8n Workflow Integration Status:**\n\nYour n8n workflow at [aparna2007.app.n8n.cloud/workflow/3RYEQh9b0QP3I1yB](https://aparna2007.app.n8n.cloud/workflow/3RYEQh9b0QP3I1yB?projectId=SFPp4mx1CCaHHzIB) is integrated!\n\nEvery booking, cancellation, and trip plan event on [transport-seven-sable.vercel.app](https://transport-seven-sable.vercel.app) automatically triggers your n8n webhook.`;
  } else if (lowerMsg.includes('cancel') || lowerMsg.includes('refund')) {
    reply = `🛡️ **TripGo Cancellation & Refund Policy:**\n\n• **12+ hours prior**: 80% to 100% refund guaranteed.\n• **6 to 12 hours prior**: 50% to 80% refund depending on operator.\n• **Auto-Refund turnaround**: Credits back to your UPI/Card within 2 to 4 hours.\n\nYou can manage and cancel any ticket directly in the **My Trips** tab on [transport-seven-sable.vercel.app](https://transport-seven-sable.vercel.app).`;
  }

  res.json({
    reply,
    source: 'knowledge-base',
    liveAppUrl: 'https://transport-seven-sable.vercel.app'
  });
});

// --- VITE MIDDLEWARE IN DEV OR STATIC IN PROD ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`TripGo server running at http://localhost:${PORT}`);
  });
}

startServer();
