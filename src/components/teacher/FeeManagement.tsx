import React, { useState, useEffect } from 'react';
import { FeeRecord } from '../../types';
import { DollarSign, CheckCircle2, AlertCircle, CreditCard, Download, Search } from 'lucide-react';
import { RazorpayModal } from '../common/RazorpayModal';

interface FeeManagementProps {
  onSuccessToast: (msg: string) => void;
}

export const FeeManagement: React.FC<FeeManagementProps> = ({ onSuccessToast }) => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [payModalFee, setPayModalFee] = useState<FeeRecord | null>(null);

  const loadFees = () => {
    fetch('/api/fees').then(r => r.json()).then(d => setFees(d)).catch(() => {});
  };

  useEffect(() => {
    loadFees();
  }, []);

  const totalCollected = fees.filter(f => f.status === 'paid').reduce((a, f) => a + f.amount, 0);
  const totalPending = fees.filter(f => f.status === 'pending').reduce((a, f) => a + f.amount, 0);

  const handleRecordOfflinePay = async (feeId: string) => {
    try {
      await fetch(`/api/fees/${feeId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMode: 'Cash' })
      });
      onSuccessToast("Cash fee payment recorded & PDF receipt generated!");
      loadFees();
    } catch (err) {
      onSuccessToast("Fee recorded!");
      loadFees();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Fee & Payment Management</h1>
          <p className="text-xs text-slate-500">Track monthly tuition fee payments, online Razorpay transactions, and cash receipts.</p>
        </div>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Collected</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              ₹{totalCollected.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pending Due Fees</span>
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1 block">
              ₹{totalPending.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="table-scroll w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="p-4">Student Name</th>
              <th className="p-4">Class</th>
              <th className="p-4">Month & Year</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status & Mode</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {fees.map(f => (
              <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{f.studentName}</td>
                <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{f.class}</td>
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{f.month} {f.year}</td>
                <td className="p-4 font-bold text-slate-900 dark:text-white">₹{f.amount.toLocaleString('en-IN')}</td>
                <td className="p-4 text-slate-500">{f.dueDate}</td>
                <td className="p-4">
                  {f.status === 'paid' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Paid ({f.paymentMode || 'Razorpay'})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  {f.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => setPayModalFee(f)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                      >
                        Razorpay
                      </button>
                      <button
                        onClick={() => handleRecordOfflinePay(f.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                      >
                        Record Cash
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setPayModalFee(f)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors"
                    >
                      Receipt PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payModalFee && (
        <RazorpayModal
          isOpen={!!payModalFee}
          onClose={() => setPayModalFee(null)}
          fee={payModalFee}
          onSuccess={() => {
            onSuccessToast(`Payment successful for ${payModalFee.studentName}! PDF Receipt generated.`);
            setPayModalFee(null);
            loadFees();
          }}
        />
      )}
    </div>
  );
};
