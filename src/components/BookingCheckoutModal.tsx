import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  Tag,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  ArrowLeft
} from 'lucide-react';

export const BookingCheckoutModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    selectedBus,
    selectedSeats,
    passengers,
    updatePassenger,
    selectedBoardingPoint,
    selectedDroppingPoint,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    calculateFareBreakdown,
    confirmBooking,
    formatPrice
  } = useTravel();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const [contactEmail, setContactEmail] = useState('aparnasakile@gmail.com');
  const [contactPhone, setContactPhone] = useState('+91 9876543210');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Card form state (mock - never store raw credentials)
  const [cardHolder, setCardHolder] = useState('Aparna Sakile');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('•••');

  // UPI VPA state
  const [upiVpa, setUpiVpa] = useState('aparna@okhdfcbank');

  if (activeModal !== 'checkout' || !selectedBus) return null;

  const { baseFare, taxes, serviceFee, discount, total } = calculateFareBreakdown();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput.trim());
    setCouponFeedback({
      message: res.message,
      isError: !res.success
    });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    // Validate passenger details
    for (let i = 0; i < selectedSeats.length; i++) {
      const p = passengers[i];
      if (!p || !p.name.trim()) {
        setCheckoutError(`Please enter the passenger name for seat ${selectedSeats[i]}.`);
        return;
      }
    }

    if (!contactEmail.includes('@') || contactPhone.trim().length < 8) {
      setCheckoutError('Please provide a valid contact email and mobile number for your ticket delivery.');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await confirmBooking(paymentMethod, contactEmail, contactPhone);
      if (!result.success) {
        setCheckoutError(result.error || 'Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveModal('seats')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Back to Seat Selection"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold text-white">Passenger & Payment Checkout</h2>
              <p className="text-xs text-slate-400">
                {selectedBus.operator} · {selectedBus.source} → {selectedBus.destination} ({selectedSeats.join(', ')})
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Passenger Details & Payment Method (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Error Banner */}
            {checkoutError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            {/* Passenger Information */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Passenger Details ({selectedSeats.length} Travelers)
                </h3>
                <span className="text-[11px] text-slate-500">Government ID Required during travel</span>
              </div>

              <div className="space-y-3">
                {selectedSeats.map((seatNum, idx) => {
                  const p = passengers[idx] || { name: '', age: 25, gender: 'male', seatNumber: seatNum };
                  return (
                    <div key={seatNum} className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600">
                          Seat #{seatNum}
                        </span>
                        <span className="text-[11px] text-slate-400">Traveler {idx + 1}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <div className="sm:col-span-6">
                          <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Full Name</label>
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => updatePassenger(idx, { name: e.target.value })}
                            placeholder="e.g. John Doe"
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Age</label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={p.age}
                            onChange={(e) => updatePassenger(idx, { age: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Gender</label>
                          <select
                            value={p.gender}
                            onChange={(e) => updatePassenger(idx, { gender: e.target.value as any })}
                            className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Ticket Delivery Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Email Address</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Mobile Number</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Select Secure Payment Option
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'card', label: 'Cards', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
                  { id: 'wallet', label: 'Wallets', icon: Wallet },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payment Interface */}
              {paymentMethod === 'upi' && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">UPI ID / VPA</span>
                    <span className="text-[11px] text-emerald-600 font-medium">Instant 0% Fee</span>
                  </div>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="username@bank"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Supports Google Pay, PhonePe, Paytm, BHIM, Cred</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Expiry MM/YY</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(paymentMethod === 'netbanking' || paymentMethod === 'wallet') && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                  <p className="text-slate-600 mb-2">Select your banking provider:</p>
                  <select className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg">
                    <option>HDFC Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Fare Breakdown & Coupon (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              
              {/* Journey Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                  <span className="font-bold text-xs text-slate-900">{selectedBus.operator}</span>
                  <span className="text-[11px] font-mono text-slate-500">{selectedBus.busNumber}</span>
                </div>
                
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">From / Boarding:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {selectedBoardingPoint ? `${selectedBoardingPoint.name} (${selectedBoardingPoint.time})` : selectedBus.source}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">To / Dropping:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {selectedDroppingPoint ? `${selectedDroppingPoint.name} (${selectedDroppingPoint.time})` : selectedBus.destination}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Seats Chosen:</span>
                    <span className="font-mono font-bold text-blue-600">{selectedSeats.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <Tag className="w-3.5 h-3.5 text-orange-500" />
                  <span>Offers & Coupons</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                    <div>
                      <div className="font-bold text-emerald-800">{appliedCoupon.code}</div>
                      <div className="text-[11px] text-emerald-600">{appliedCoupon.title} (-{formatPrice(appliedCoupon.discountAmount)})</div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. TRIPGOFIRST"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <div className={`mt-2 text-[11px] font-medium ${couponFeedback.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {couponFeedback.message}
                  </div>
                )}
              </div>

              {/* Transparent Price Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-slate-600 text-[11px] mb-2">
                  Price Breakdown
                </h4>
                
                <div className="flex items-center justify-between text-slate-600">
                  <span>Base Ticket Fare ({selectedSeats.length} Seats)</span>
                  <span className="font-mono font-medium">{formatPrice(baseFare)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>GST & State Taxes (5%)</span>
                  <span className="font-mono font-medium">{formatPrice(taxes)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Booking & Safety Fee</span>
                  <span className="font-mono font-medium">{formatPrice(serviceFee)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900 text-sm">
                  <span>Final Amount</span>
                  <span className="text-base text-blue-600 font-mono">{formatPrice(total)}</span>
                </div>
              </div>

            </div>

            {/* Bottom Pay CTA */}
            <div className="pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handlePaymentSubmit}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {formatPrice(total)} & Confirm Booking</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>256-Bit SSL Encrypted Gateway · PCI-DSS Compliant</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
