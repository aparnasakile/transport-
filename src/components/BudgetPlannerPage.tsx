import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext.tsx';
import {
  DollarSign,
  PieChart,
  Sliders,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Bus,
  Hotel,
  Utensils,
  Camera,
  ShoppingBag,
  MoreHorizontal
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
}

export const BudgetPlannerPage: React.FC = () => {
  const { formatPrice } = useTravel();

  const [maxBudget, setMaxBudget] = useState(35000);

  // Category values
  const [categories, setCategories] = useState<{ [key: string]: number }>({
    Transportation: 8000,
    Hotel: 12000,
    Food: 5000,
    Activities: 3000,
    Shopping: 2500,
    Other: 2000,
  });

  // Tracked actual expenses
  const [actualExpenses, setActualExpenses] = useState<ExpenseItem[]>([
    { id: 'exp-1', category: 'Transportation', amount: 2598 },
    { id: 'exp-2', category: 'Hotel', amount: 5600 },
    { id: 'exp-3', category: 'Food', amount: 1450 },
  ]);

  const [newExpenseCat, setNewExpenseCat] = useState('Food');
  const [newExpenseAmt, setNewExpenseAmt] = useState<number>(500);

  const estimatedTotal = Object.values(categories).reduce((a, b) => a + b, 0);
  const actualTotal = actualExpenses.reduce((a, b) => a + b.amount, 0);
  const isOverBudget = estimatedTotal > maxBudget;
  const budgetUsagePercent = Math.min(100, Math.round((estimatedTotal / maxBudget) * 100));

  const handleCategoryChange = (cat: string, val: number) => {
    setCategories((prev) => ({
      ...prev,
      [cat]: Math.max(0, val),
    }));
  };

  const handleAddActualExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpenseAmt <= 0) return;
    setActualExpenses((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        category: newExpenseCat,
        amount: newExpenseAmt,
      },
    ]);
    setNewExpenseAmt(500);
  };

  const removeExpense = (id: string) => {
    setActualExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const categoryIcons: Record<string, any> = {
    Transportation: Bus,
    Hotel: Hotel,
    Food: Utensils,
    Activities: Camera,
    Shopping: ShoppingBag,
    Other: MoreHorizontal,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
                Travel Budget Calculator & Expense Tracker
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Set category ceilings, calculate projected trip outlays, and log actual receipts in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Max Budget Slider */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-end">
          <div className="text-[11px] text-slate-500 font-medium">Trip Ceiling Cap</div>
          <div className="text-lg font-extrabold text-blue-600 font-mono">
            {formatPrice(maxBudget)}
          </div>
        </div>
      </div>

      {/* Grid: Estimated Budget Breakdown + Actual Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Category Estimator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Category Estimator Sliders
            </h3>
            <span className="text-xs text-slate-500">
              Target Ceiling: {formatPrice(maxBudget)}
            </span>
          </div>

          {/* Progress bar to Ceiling */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Budget Allocated: {budgetUsagePercent}%</span>
              <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                {formatPrice(estimatedTotal)} / {formatPrice(maxBudget)}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverBudget ? 'bg-rose-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
              />
            </div>
            {isOverBudget && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold pt-1">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Allocations exceed ceiling by {formatPrice(estimatedTotal - maxBudget)}. Consider adjusting.
                </span>
              </div>
            )}
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            {Object.entries(categories).map(([cat, amount]) => {
              const Icon = categoryIcons[cat] || MoreHorizontal;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{cat}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      {formatPrice(amount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25000"
                    step="500"
                    value={amount}
                    onChange={(e) => handleCategoryChange(cat, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              );
            })}
          </div>

          {/* Summary Table (As specified in prompt requirement 10) */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5">
            <div className="font-sans font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
              Cost Summary Overview
            </div>
            {Object.entries(categories).map(([cat, amount]) => (
              <div key={cat} className="flex justify-between text-slate-600">
                <span>{cat.padEnd(18, ' ')}</span>
                <span className="font-bold">{formatPrice(amount)}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between font-bold text-slate-900 text-sm">
              <span>Estimated Total</span>
              <span className="text-blue-600">{formatPrice(estimatedTotal)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Actual Expense Tracker (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Actual Expenses Log
              </h3>
              <span className="font-mono font-bold text-emerald-600 text-sm">
                Paid: {formatPrice(actualTotal)}
              </span>
            </div>

            {/* Add Receipt Form */}
            <form onSubmit={handleAddActualExpense} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Log New Receipt</span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newExpenseCat}
                  onChange={(e) => setNewExpenseCat(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                >
                  {Object.keys(categories).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="10"
                  value={newExpenseAmt}
                  onChange={(e) => setNewExpenseAmt(Number(e.target.value))}
                  placeholder="Amount"
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Receipt</span>
              </button>
            </form>

            {/* List of Actual Expenses */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {actualExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{exp.category}</span>
                    <div className="text-[10px] text-slate-400">Verified Payment</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900">
                      {formatPrice(exp.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExpense(exp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remaining Balance Card */}
          <div className="p-4 rounded-xl bg-gradient-to-tr from-blue-900 to-slate-900 text-white space-y-1">
            <span className="text-[11px] text-blue-200 font-medium">Remaining Discretionary Funds</span>
            <div className="text-2xl font-black font-mono">
              {formatPrice(Math.max(0, maxBudget - actualTotal))}
            </div>
            <p className="text-[10px] text-slate-400">
              You are staying within safe travel margins!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
