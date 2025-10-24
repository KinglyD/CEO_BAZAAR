import { useState } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const transactions = [
    {
      id: 'TXN-001',
      customer: 'Jane Smith',
      event: 'Tech Summit 2025',
      amount: 50000,
      status: 'completed',
      date: '2025-10-24T10:30:00',
      paymentMethod: 'Mobile Money'
    },
    {
      id: 'TXN-002',
      customer: 'John Doe',
      event: 'Music Festival',
      amount: 75000,
      status: 'completed',
      date: '2025-10-24T09:15:00',
      paymentMethod: 'Card'
    },
    {
      id: 'TXN-003',
      customer: 'Bob Wilson',
      event: 'Art Exhibition',
      amount: 30000,
      status: 'pending',
      date: '2025-10-24T08:45:00',
      paymentMethod: 'Mobile Money'
    },
    {
      id: 'TXN-004',
      customer: 'Alice Brown',
      event: 'Tech Summit 2025',
      amount: 50000,
      status: 'failed',
      date: '2025-10-23T16:20:00',
      paymentMethod: 'Card'
    },
  ]

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = 
      txn.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || txn.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-clash font-bold text-4xl mb-2">Transactions</h1>
          <p className="text-graytext">Monitor all platform transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors">
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <h3 className="text-2xl font-bold mb-1">UGX {totalRevenue.toLocaleString()}</h3>
          <p className="text-sm text-graytext">Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <h3 className="text-2xl font-bold mb-1">
            {transactions.filter(t => t.status === 'completed').length}
          </h3>
          <p className="text-sm text-graytext">Successful Transactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <h3 className="text-2xl font-bold mb-1">
            {transactions.filter(t => t.status === 'failed').length}
          </h3>
          <p className="text-sm text-graytext">Failed Transactions</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('failed')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterStatus === 'failed'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              Failed
            </button>
          </div>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Event</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Method</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm">{txn.id}</td>
                  <td className="py-4 px-6 font-medium">{txn.customer}</td>
                  <td className="py-4 px-6 text-graytext">{txn.event}</td>
                  <td className="py-4 px-6 text-gold font-semibold">
                    UGX {txn.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-graytext">{txn.paymentMethod}</td>
                  <td className="py-4 px-6 text-graytext">
                    {new Date(txn.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      txn.status === 'completed'
                        ? 'bg-green-400/20 text-green-400'
                        : txn.status === 'pending'
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'bg-red-400/20 text-red-400'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-graytext">No transactions found matching your criteria</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Transactions