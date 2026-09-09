import React, { useState, useEffect } from 'react';
import { FeeRecord } from '../../types';
import { DollarSign, CheckCircle2, AlertCircle, Download, CreditCard } from 'lucide-react';
import { RazorpayModal } from '../common/RazorpayModal';

interface ParentFeesProps {
  onSuccessToast: (msg: string) => void;
}

export const ParentFees: React.FC<ParentFeesProps> = ({ onSuccessToast }) => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [payModalFee, setPayModalFee] = useState<FeeRecord | null>(null);

  const loadFees = () => {
    fetch('/api/fees').then(r => r.json()).then(d => setFees(d)).catch(() => {});
  };

  useEffect(() => {
    loadFees();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Fee Statements & Online Payment</h1>
        <p className="text-xs text-slate-500">Pay monthly tuition fees instantly using Razorpay UPI/Cards and download PDF receipts.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="table-scroll w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
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
                <td className="p-4 font-bold text-slate-900 dark:text-white">{f.month} {f.year}</td>
                <td className="p-4 font-bold text-slate-900 dark:text-white">₹{f.amount.toLocaleString('en-IN')}</td>
                <td className="p-4 text-slate-500">{f.dueDate}</td>
                <td className="p-4">
                  {f.status === 'paid' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Paid ({f.paymentMode || 'Razorpay'})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3.5 h-3.5" /> Due Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {f.status === 'pending' ? (
                    <button
                      onClick={() => setPayModalFee(f)}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow transition-all flex items-center gap-1 ml-auto"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Pay Now (Razorpay)
                    </button>
                  ) : (
                    <button
                      onClick={() => setPayModalFee(f)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF Receipt
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
            onSuccessToast(`Payment successful! PDF Receipt downloaded.`);
            setPayModalFee(null);
            loadFees();
          }}
        />
      )}
    </div>
  );
};
