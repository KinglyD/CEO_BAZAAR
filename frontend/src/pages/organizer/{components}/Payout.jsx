import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BanknotesIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const Payout = () => {
  const [showCashoutModal, setShowCashoutModal] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(null)
  const [cashoutAmount, setCashoutAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('mobileMoney')
  const [accountDetails, setAccountDetails] = useState('')

  const walletBalance = 10669000

  const pendingSettlements = [
    {
      id: 1,
      eventName: 'Music Festival',
      eventDate: '2025-10-24',
      settledDate: '2025-10-25',
      grossRevenue: 8500000,
      platformFee: 510000,
      netAmount: 7990000,
      status: 'settled',
      transactions: 1847
    },
    {
      id: 2,
      eventName: 'Tech Summit 2025',
      eventDate: '2025-10-25',
      settledDate: '2025-10-26',
      grossRevenue: 2850000,
      platformFee: 171000,
      netAmount: 2679000,
      status: 'settled',
      transactions: 387
    }
  ]

  const cashoutHistory = [
    {
      id: 1,
      amount: 5000000,
      date: '2025-10-20',
      method: 'Mobile Money',
      account: '+256 700 ***456',
      status: 'completed',
      reference: 'PAYOUT-001-2025'
    }
  ]

  const handleCashout = () => {
    if (!cashoutAmount || parseFloat(cashoutAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    if (parseFloat(cashoutAmount) > walletBalance) {
      alert('Insufficient balance')
      return
    }
    if (!accountDetails) {
      alert('Please enter account details')
      return
    }

    alert(`Cashout request submitted successfully!`)
    setShowCashoutModal(false)
    setCashoutAmount('')
    setAccountDetails('')
  }

  const settledAmount = pendingSettlements.filter(s => s.status === 'settled').reduce((sum, s) => sum + s.netAmount, 0)
  const totalPlatformFees = pendingSettlements.reduce((sum, s) => sum + s.platformFee, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Payouts & Wallet</h1>
        <p className="text-graytext">Manage your earnings</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-gold/20 to-transparent p-8 rounded-lg border border-gold/30 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-graytext mb-2">Available Balance</p>
            <h2 className="font-clash font-bold text-5xl text-gold">UGX {walletBalance.toLocaleString()}</h2>
          </div>
          <BanknotesIcon className="h-16 w-16 text-gold opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-graytext mb-1">Settled Funds</p>
            <p className="text-xl font-bold text-green-400">UGX {settledAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-graytext mb-1">Platform Fees (6%)</p>
            <p className="text-xl font-bold text-red-400">UGX {totalPlatformFees.toLocaleString()}</p>
          </div>
        </div>

        <button onClick={() => setShowCashoutModal(true)} className="px-8 py-3 bg-gold text-black font-bold rounded-md hover:bg-gold/90 transition-colors flex items-center gap-2">
          <ArrowDownTrayIcon className="h-5 w-5" />
          Request Cashout
        </button>
      </motion.div>

      <AnimatePresence>
        {showCashoutModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowCashoutModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-matte border border-white/20 rounded-lg p-8 max-w-md w-full">
              <h3 className="font-clash text-2xl font-bold mb-6">Request Cashout</h3>
              <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-md">
                <p className="text-sm text-graytext mb-1">Available Balance</p>
                <p className="text-2xl font-bold text-gold">UGX {walletBalance.toLocaleString()}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input type="number" value={cashoutAmount} onChange={(e) => setCashoutAmount(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold" placeholder="Enter amount" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold">
                    <option value="mobileMoney" className="bg-matte">Mobile Money</option>
                    <option value="bank" className="bg-matte">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Details</label>
                  <input type="text" value={accountDetails} onChange={(e) => setAccountDetails(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold" placeholder="+256 700 000 000" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCashout} className="flex-1 py-3 bg-gold text-black font-bold rounded-md hover:bg-gold/90">Submit</button>
                  <button onClick={() => setShowCashoutModal(false)} className="flex-1 py-3 bg-white/10 rounded-md hover:bg-white/20">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Payout
