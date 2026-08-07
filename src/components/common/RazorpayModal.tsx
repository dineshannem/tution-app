import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, Wallet, ShieldCheck, CheckCircle2, Download } from 'lucide-react';
import { FeePayment } from '../../types';
import jsPDF from 'jspdf';

interface RazorpayModalProps {
  isOpen: boolean;
  fee: FeePayment | null;
  onClose: () => void;
  onSuccess: (razorpayPaymentId: string, method: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  fee,
  onClose,
  onSuccess
}) => {
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Wallet'>('UPI');
  const [upiId, setUpiId] = useState('user@upi');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState('');

  if (!isOpen || !fee) return null;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment gateway handshake delay
    setTimeout(() => {
      const generatedId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setLastPaymentId(generatedId);
      setProcessing(false);
      setCompleted(true);
      onSuccess(generatedId, method);
    }, 1500);
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();

    // Header styling
    doc.setFillColor(30, 58, 138); // Navy blue
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SSR TUITION MANAGEMENT', 15, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Classes 1-10 (CBSE & State Board) | Single Teacher Excellence: SSR Sir', 15, 28);
    doc.text('Phone: +91 98765 43210 | Email: teacher@ssrtuition.com', 15, 34);

    // Title
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL FEE PAYMENT RECEIPT', 15, 55);

    // Receipt details box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 62, 180, 50, 3, 3, 'FD');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Receipt No: ${fee.receiptNo}`, 22, 73);
    doc.text(`Payment ID: ${lastPaymentId || fee.razorpayPaymentId || 'pay_live_verified'}`, 22, 82);
    doc.text(`Date & Time: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 22, 91);
    doc.text(`Payment Gateway: Razorpay (${method})`, 22, 100);

    // Student & Fee breakdown
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT & FEE DETAILS', 15, 125);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student Name: ${fee.studentName}`, 20, 137);
    doc.text(`Class & Board: ${fee.class}`, 20, 145);
    doc.text(`Fee Month: ${fee.month}`, 20, 153);
    doc.text(`Status: FULLY PAID (SUCCESSFUL)`, 20, 161);

    // Total box
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
    doc.roundedRect(15, 172, 180, 25, 3, 3, 'FD');

    doc.setTextColor(6, 95, 70);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL AMOUNT PAID: RS. ${fee.amount.toLocaleString('en-IN')}/-`, 22, 188);

    // Authorized Stamp
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a computer-generated receipt signed by SSR Tuition Management.', 15, 215);
    doc.text('Thank you for prompt fee payment!', 15, 222);

    doc.save(`SSR_Fee_Receipt_${fee.studentName.replace(/\s+/g, '_')}_${fee.month.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Razorpay Secure Checkout
              </div>
              <h2 className="text-xl font-bold mt-1">SSR Tuition Fee Payment</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-200 block">{fee.studentName} - {fee.class}</span>
              <span className="text-sm font-semibold">{fee.month} Tuition Fee</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-blue-200 block">Amount Payable</span>
              <span className="text-2xl font-black text-amber-300">₹{fee.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!completed ? (
            <form onSubmit={handlePayNow}>
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('UPI')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      method === 'UPI'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    UPI / QR
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('Card')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      method === 'Card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('NetBanking')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      method === 'NetBanking'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building className="w-5 h-5 text-purple-600" />
                    NetBank
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('Wallet')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      method === 'Wallet'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    Wallets
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs */}
              {method === 'UPI' && (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-5">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                      Enter VPA / UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      required
                      placeholder="e.g. mobile@upi"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Fast</span>
                    Instant authorization with zero transaction charge.
                  </div>
                </div>
              )}

              {method === 'Card' && (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-5">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 block">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'NetBanking' && (
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-5">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2 block">
                    Select Your Bank
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {method === 'Wallet' && (
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-5">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2 block">
                    Select Wallet
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>Paytm Wallet</option>
                    <option>Amazon Pay</option>
                    <option>Mobikwik</option>
                    <option>PhonePe Wallet</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Razorpay Payment...
                  </>
                ) : (
                  <>
                    Pay ₹{fee.amount.toLocaleString('en-IN')} via Razorpay
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Successful!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Transaction ID: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{lastPaymentId}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Fee payment of ₹{fee.amount} for {fee.month} has been verified and updated in SSR Tuition records.
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={downloadReceipt}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" /> Download PDF Fee Receipt
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
