import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Copy, 
  Check, 
  Heart, 
  ShieldCheck, 
  Globe2, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';

export interface BankAccount {
  currency: 'NGN' | 'USD';
  currencyLabel: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  swiftCode: string;
  sortCode: string;
  branch: string;
  symbol: string;
}

export const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    currency: 'NGN',
    currencyLabel: 'Nigerian Naira (NGN)',
    accountNumber: '1311816265',
    accountName: 'TEMITOPE SOCIETAL SUSTAINABILITY AND DEVELOPMENT INITIATIVE (TSSDI)',
    bankName: 'ZENITH BANK',
    swiftCode: 'ZEIBNGLA',
    sortCode: '057080277',
    branch: 'KEBBI HOUSE BRANCH',
    symbol: '₦'
  },
  {
    currency: 'USD',
    currencyLabel: 'US Dollar (USD Dom)',
    accountNumber: '5075911468',
    accountName: 'TEMITOPE SOCIETAL SUSTAINABILITY AND DEVELOPMENT INITIATIVE (TSSDI)',
    bankName: 'ZENITH BANK',
    swiftCode: 'ZEIBNGLA',
    sortCode: '057080277',
    branch: 'KEBBI HOUSE BRANCH',
    symbol: '$'
  }
];

export function DonationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedCurrency, setSelectedCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeAccount = DEFAULT_BANK_ACCOUNTS.find(a => a.currency === selectedCurrency) || DEFAULT_BANK_ACCOUNTS[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 my-8"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-royal-blue to-blue-900 text-white p-6 sm:p-8 relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider text-lime-300 mb-3">
                <Heart size={14} className="fill-current text-vibrant-red" />
                Direct NGO Bank Transfer
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold">Support Our Mission</h3>
              <p className="text-blue-100 text-sm mt-1 max-w-lg">
                Your direct contribution empowers grassroots education, community health, and women & youth entrepreneurship.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Currency Selector */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                {DEFAULT_BANK_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.currency}
                    onClick={() => setSelectedCurrency(acc.currency)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      selectedCurrency === acc.currency
                        ? 'bg-white text-royal-blue shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-royal-blue/10 flex items-center justify-center text-xs font-black">
                      {acc.symbol}
                    </span>
                    {acc.currencyLabel}
                  </button>
                ))}
              </div>

              {/* Account Card */}
              <div className="bg-gradient-to-br from-blue-50/60 to-soft-smoke p-6 rounded-2xl border border-blue-100/80 space-y-4">
                {/* Account Number Box */}
                <div className="bg-white p-5 rounded-xl border border-blue-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      {activeAccount.currency} Account Number
                    </span>
                    <span className="text-3xl font-mono font-black text-royal-blue tracking-wider">
                      {activeAccount.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeAccount.accountNumber, `num-${activeAccount.currency}`)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-royal-blue hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
                  >
                    {copiedKey === `num-${activeAccount.currency}` ? (
                      <>
                        <Check size={16} className="text-lime-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy Number</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/80 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Account Name</span>
                    <p className="font-semibold text-gray-900 mt-0.5 text-xs leading-snug">{activeAccount.accountName}</p>
                  </div>
                  <div className="bg-white/80 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Bank Name</span>
                    <p className="font-bold text-royal-blue mt-0.5">{activeAccount.bankName}</p>
                  </div>
                  <div className="bg-white/80 p-3.5 rounded-xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Branch</span>
                    <p className="font-semibold text-gray-800 mt-0.5 text-xs">{activeAccount.branch}</p>
                  </div>
                  <div className="bg-white/80 p-3.5 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">SWIFT Code</span>
                      <p className="font-mono font-bold text-gray-800 mt-0.5">{activeAccount.swiftCode}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(activeAccount.swiftCode, `swift-${activeAccount.currency}`)}
                      className="p-2 text-gray-400 hover:text-royal-blue rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy SWIFT"
                    >
                      {copiedKey === `swift-${activeAccount.currency}` ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="bg-white/80 p-3.5 rounded-xl border border-gray-100 flex items-center justify-between sm:col-span-2">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Sort Code</span>
                      <p className="font-mono font-bold text-gray-800 mt-0.5">{activeAccount.sortCode}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(activeAccount.sortCode, `sort-${activeAccount.currency}`)}
                      className="p-2 text-gray-400 hover:text-royal-blue rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy Sort Code"
                    >
                      {copiedKey === `sort-${activeAccount.currency}` ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust & Verification Badges */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span>Verified Official NGO Account</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>100% Direct Impact</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function Donation() {
  const [selectedCurrency, setSelectedCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeAccount = DEFAULT_BANK_ACCOUNTS.find(a => a.currency === selectedCurrency) || DEFAULT_BANK_ACCOUNTS[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section id="donate" className="py-24 bg-gradient-to-b from-white via-soft-smoke to-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-royal-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-royal-blue/10 text-royal-blue font-semibold text-xs tracking-widest uppercase mb-4">
            <Heart size={14} className="fill-current text-vibrant-red" />
            Partner With Us
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
            Support Our Sustainable Impact
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Your generous contributions directly fund life-changing community outreach, youth skill building, healthcare initiatives, and grassroots leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Impact Highlights */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-royal-blue text-white shadow-xl">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Building2 size={28} className="text-lime-300" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4">
                Direct Bank Transfers & Global Giving
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">
                Temitope Societal Sustainability and Development Initiative maintains verified domestic and foreign currency accounts for transparent and audited donations.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white/10 text-lime-300 mt-0.5">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Official Registered NGO</h4>
                    <p className="text-xs text-blue-200 mt-0.5">All donations are handled with full organizational governance.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white/10 text-lime-300 mt-0.5">
                    <Globe2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Domestic & International Support</h4>
                    <p className="text-xs text-blue-200 mt-0.5">Seamless transfers via NGN and USD (SWIFT) channels.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white/10 text-lime-300 mt-0.5">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Direct Grassroots Beneficiaries</h4>
                    <p className="text-xs text-blue-200 mt-0.5">Your support reaches vulnerable families and youths directly.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-blue-800/80 text-xs text-blue-200 flex items-center justify-between">
              <span>Zenith Bank Plc</span>
              <span>Kebbi House Branch</span>
            </div>
          </div>

          {/* Right Column: Interactive Bank Details Card */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-between">
            <div>
              {/* Currency Toggle Tabs */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
                {DEFAULT_BANK_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.currency}
                    onClick={() => setSelectedCurrency(acc.currency)}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      selectedCurrency === acc.currency
                        ? 'bg-royal-blue text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="font-mono text-base">{acc.symbol}</span>
                    {acc.currencyLabel}
                  </button>
                ))}
              </div>

              {/* Main Account Showcase */}
              <div className="bg-soft-smoke p-6 sm:p-8 rounded-2xl border border-gray-200/80 space-y-6">
                {/* Account Number Display */}
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Account Number ({activeAccount.currency})
                    </span>
                    <span className="text-3xl sm:text-4xl font-mono font-black text-royal-blue tracking-wider">
                      {activeAccount.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeAccount.accountNumber, `main-num-${activeAccount.currency}`)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-lime-green hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
                  >
                    {copiedKey === `main-num-${activeAccount.currency}` ? (
                      <>
                        <Check size={18} />
                        <span>Account Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>Copy Account Number</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bank Specifications Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Account Name</span>
                    <p className="font-bold text-gray-900 mt-1 text-sm leading-snug">{activeAccount.accountName}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Bank Name</span>
                    <p className="font-bold text-royal-blue mt-1 text-base">{activeAccount.bankName}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Branch</span>
                    <p className="font-semibold text-gray-800 mt-1 text-sm">{activeAccount.branch}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">SWIFT Code</span>
                      <p className="font-mono font-bold text-gray-900 mt-1 text-sm">{activeAccount.swiftCode}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(activeAccount.swiftCode, `main-swift-${activeAccount.currency}`)}
                      className="p-2 text-gray-400 hover:text-royal-blue rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy SWIFT Code"
                    >
                      {copiedKey === `main-swift-${activeAccount.currency}` ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between sm:col-span-2">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sort Code</span>
                      <p className="font-mono font-bold text-gray-900 mt-1 text-sm">{activeAccount.sortCode}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(activeAccount.sortCode, `main-sort-${activeAccount.currency}`)}
                      className="p-2 text-gray-400 hover:text-royal-blue rounded-lg hover:bg-gray-100 transition-colors"
                      title="Copy Sort Code"
                    >
                      {copiedKey === `main-sort-${activeAccount.currency}` ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <span>Kindly include your name/reference when making direct transfers.</span>
              <a 
                href="mailto:contact@temitopessdi.org?subject=Donation Notification" 
                className="inline-flex items-center gap-1.5 text-royal-blue font-semibold hover:underline"
              >
                Notify us of transfer <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
