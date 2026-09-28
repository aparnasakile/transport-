import React, { useState } from 'react';
import { AVAILABLE_COUPONS } from '../data/mockData.ts';
import { useTravel } from '../context/TravelContext.tsx';
import {
  Tag,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Percent,
  Gift,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { setCurrentView, formatPrice } = useTravel();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                Exclusive Travel Coupons & Promo Discounts
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Apply guaranteed discount codes during booking checkout for buses, cabs, and intercity trips
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Instant Discount Deduction at Checkout</span>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_COUPONS.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between relative"
          >
            {/* Top decorative color strip */}
            <div className="h-2 bg-gradient-to-r from-blue-600 via-teal-500 to-orange-500" />

            <div className="p-6 space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `FLAT ₹${coupon.discountValue} OFF`}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Valid till: {coupon.validUntil}</span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">{coupon.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{coupon.description}</p>
              </div>

              {/* Coupon Code Copy Box */}
              <div className="p-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Promo Code</div>
                  <div className="text-sm font-black font-mono tracking-wider text-slate-900">{coupon.code}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(coupon.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    copiedCode === coupon.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Terms breakdown */}
              <div className="space-y-1 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                <div>• Min. booking required: <strong className="text-slate-700">{formatPrice(coupon.minBookingAmount)}</strong></div>
                {coupon.maxDiscount && <div>• Max discount cap: <strong className="text-slate-700">{formatPrice(coupon.maxDiscount)}</strong></div>}
                <div>• Applicable for: <span className="capitalize">{coupon.applicableModes.join(', ')}</span></div>
              </div>

            </div>

            {/* Quick Action Button */}
            <div className="p-5 pt-0 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => setCurrentView('buses')}
                className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Use on Bus Booking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
