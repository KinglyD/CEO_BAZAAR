import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState('30days')

  const stats = [
    { 
      label: 'Total Volume', 
      value: 'UGX 125.5M', 
      change: '+23.5%',
      trend: 'up',
      icon: BanknotesIcon, 
      color: 'blue' 
    },
    { 
      label: 'Platform Fees', 
      value: 'UGX 8.2M', 
      change: '+18.2%',
      trend: 'up',
      icon: ArrowTrendingUpIcon, 
      color: 'green' 
    },
    { 
      label: 'Pending Payouts', 
      value: 'UGX 15.3M', 
      change: '+5.4%',
      trend: 'up',
      icon: ClockIcon, 
      color: 'orange' 
    },
    { 
      label: 'Refunds', 
      value: 'UGX 1.2M', 
      change: '-12%',
      trend: 'down',
      icon: ArrowTrendingDownIcon, 
      color: 'red' 
    },
  ]

  const transactions = [
    {
      id: 'TXN-001234',
      type: 'payment',
      event: 'Music Festival 2024',
      organizer: 'EventsPro UG',
      customer: 'John Doe',
      amount: 150000,
      fee: 9000,
      status: 'completed',
      date: '2024-10-15T14:30:00',
      method: 'Mobile Money',
    },
    {
      id: 'TXN-001235',
      type: 'payout',
      event: 'Tech Summit',
      organizer: 'Tech Events Ltd',
      customer: null,
      amount: 2500000,
      fee: 0,
      status: 'pending',
      date: '2024-10-14T10:15:00',
      method: 'Bank Transfer',
    },
    {
      id: 'TXN-001236',
      type: 'refund',
      event: 'Jazz Night',
      organizer: 'Music Nights',
      customer: 'Sarah Smith',
      amount: 75000,
      fee: -4500,
      status: 'completed',
      date: '2024-10-13T16:45:00',
      method: 'Mobile Money',
    },
    {
      id: 'TXN-001237',
      type: 'payment',
      event: 'Food Carnival',
      organizer: 'Foodies UG',
      customer: 'Mike Johnson',
      amount: 200000,
      fee: 12000,
      status: 'completed',
      date: '2024-10-12T09:20:00',
      method: 'Credit Card',
    },
    {
      id: 'TXN-001238',
      type: 'subscription',
      event: null,
      organizer: 'EventsPro UG',
      customer: null,
      amount: 150000,
      fee: 0,
      status: 'completed',
      date: '2024-10-11T12:00:00',
      method: 'Mobile Money',
    },
    {
      id: 'TXN-001239',
      type: 'payment',
      event: 'Startup Pitch Night',
      organizer: 'Innovation Hub',
      customer: 'Alice Brown',
      amount: 50000,
      fee: 3000,
      status: 'failed',
      date: '2024-10-10T18:30:00',
      method: 'Mobile Money',
    },
  ]

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (txn.event && txn.event.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         txn.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || txn.type === filterType
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleExport = () => {
    toast.success('Transactions exported successfully')
  }

  const handleProcessPayout = (txnId) => {
    toast.success('Payout processed successfully')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-clash font-bold text-4xl mb-2">Transactions</h1>
          <p className="text-graytext">Monitor all platform transactions and payouts</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-500/20' :
                  stat.color === 'green' ? 'bg-green-500/20' :
                  stat.color === 'orange' ? 'bg-orange-500/20' :
                  'bg-red-500/20'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'green' ? 'text-green-400' :
                    stat.color === 'orange' ? 'text-orange-400' :
                    'text-red-400'
                  }`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendIcon className="h-4 w-4" />
                  {stat.change}
                </div>
              </div>
              <p className="text-graytext text-sm mb-1">{stat.label}</p>
              <p className="font-clash text-2xl font-bold">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-graytext" />
          <input
            type="text"
            placeholder="Search by ID, event, or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Types</option>
          <option value="payment">Payment</option>
          <option value="payout">Payout</option>
          <option value="refund">Refund</option>
          <option value="subscription">Subscription</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 font-semibold">Transaction ID</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Details</th>
                <th className="text-left p-4 font-semibold">Amount</th>
                <th className="text-left p-4 font-semibold">Fee</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredTransactions.map((txn) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-mono text-sm">{txn.id}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      txn.type === 'payment' ? 'bg-blue-500/20 text-blue-400' :
                      txn.type === 'payout' ? 'bg-purple-500/20 text-purple-400' :
                      txn.type === 'refund' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gold/20 text-gold'
                    }`}>
                      {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-sm">
                        {txn.event || 'Subscription Payment'}
                      </p>
                      <p className="text-xs text-graytext">{txn.organizer}</p>
                      {txn.customer && (
                        <p className="text-xs text-graytext">by {txn.customer}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-gold">
                      UGX {(txn.amount / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-graytext">{txn.method}</p>
                  </td>
                  <td className="p-4">
                    <p className={`font-semibold ${
                      txn.fee > 0 ? 'text-green-400' : txn.fee < 0 ? 'text-red-400' : 'text-graytext'
                    }`}>
                      {txn.fee === 0 ? '-' : `UGX ${Math.abs(txn.fee / 1000).toFixed(1)}K`}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      txn.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      txn.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {txn.status === 'completed' ? <CheckCircleIcon className="h-3.5 w-3.5" /> :
                       txn.status === 'pending' ? <ClockIcon className="h-3.5 w-3.5" /> :
                       <XCircleIcon className="h-3.5 w-3.5" />}
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{new Date(txn.date).toLocaleDateString()}</p>
                    <p className="text-xs text-graytext">
                      {new Date(txn.date).toLocaleTimeString()}
                    </p>
                  </td>
                  <td className="p-4">
                    {txn.type === 'payout' && txn.status === 'pending' && (
                      <button
                        onClick={() => handleProcessPayout(txn.id)}
                        className="px-4 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-medium transition-colors"
                      >
                        Process
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <BanknotesIcon className="h-12 w-12 text-graytext mx-auto mb-3" />
            <p className="text-graytext">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions
