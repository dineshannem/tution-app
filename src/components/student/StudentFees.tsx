import React, { useState, useEffect } from 'react';
import { FeePayment } from '../../types';
import { CreditCard, CheckCircle2, AlertCircle, Download, ShieldCheck } from 'lucide-react';
import { RazorpayModal } from '../common/RazorpayModal';

interface StudentFeesProps {
  onSuccessToast: (msg: string) => void;
}

export const StudentFees: React.FC<StudentFeesProps> = ({ onSuccessToast }) => {
  const [fees, setFees] = useState<FeePayment[]>([]);
  const [payModalFee, setPayModalFee] = useState<FeePayment | null>(null);

  const loadFees = () => {
    fetch('/api/fees')
      .then(r => r.json())
      .then(d => setFees(d))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadFees();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Tuition Fee Statements & Online Payment
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Pay monthly tuition fees instantly using Razorpay UPI, NetBanking, or Debit/Credit card with automated PDF receipt generation.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="p-4">Receipt No & Month</th>
              <th className="p-4">Class</th>
              <th className="p-4">Monthly Fee</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Payment Status</th>
              <th className="p-4 text-right">Action / Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {fees.map(f => (
              <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4">
                  <div className="font-extrabold text-slate-900 dark:text-white">{f.month}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{f.receiptNo}</div>
                </td>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{f.class}</td>
                <td className="p-4 font-black text-slate-900 dark:text-white">₹{f.amount.toLocaleString('en-IN')}</td>
                <td className="p-4 text-slate-500">{f.dueDate}</td>
                <td className="p-4">
                  {f.status === 'paid' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fully Paid ({f.paymentMode || 'Razorpay'})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-3 py-1 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5" /> Payment Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {f.status === 'pending' ? (
                    <button
                      onClick={() => setPayModalFee(f)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow transition-all flex items-center gap-1.5 ml-auto"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Pay Now (Razorpay)
                    </button>
                  ) : (
                    <button
                      onClick={() => setPayModalFee(f)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-extrabold text-xs transition-colors flex items-center gap-1.5 ml-auto border border-indigo-200 dark:border-indigo-800"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Receipt PDF
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
          fee={payModalFee}
          onClose={() => setPayModalFee(null)}
          onSuccess={(razorpayPaymentId, method) => {
            fetch('/api/fees/pay', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                feeId: payModalFee.id,
                razorpayPaymentId,
                paymentMethod: method
              })
            }).then(() => {
              onSuccessToast(`Fee paid successfully via ${method}! Receipt generated.`);
              loadFees();
            });
          }}
        />
      )}
    </div>
  );
};
