import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeftIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  BanknotesIcon,
  CreditCardIcon,
  QrCodeIcon 
} from '@heroicons/react/24/outline'
import TicketScanner, { maskCustomerInfo } from './TicketScanner'

const EventWork = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [liveTransactions, setLiveTransactions] = useState([])
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [scannedCount, setScannedCount] = useState(0)
  const [manualForm, setManualForm] = useState({
    customerInfo: '', // Can be phone or email
    amount: '',
    paymentMethod: 'cash',
    ticketType: ''
  })

  useEffect(() => {
    fetchEventDetails()
    // Simulate live transaction feed
    const interval = setInterval(() => {
      addMockTransaction()
    }, 5000)

    return () => clearInterval(interval)
  }, [eventId])

  const fetchEventDetails = async () => {
    // TODO: Replace with actual API call
    // const response = await axios.get(`/api/employee/events/${eventId}`)
    
    setTimeout(() => {
      setEvent({
        id: eventId,
        title: 'Music Festival',
        organizer: 'Music Fest Promoters',
        date: '2025-10-24',
        location: 'Kololo Airstrip',
        capacity: 2000,
        ticketsSold: 1847,
        ticketTypes: [
          { name: 'Regular', price: 50000, sold: 1200 },
          { name: 'VIP', price: 100000, sold: 500 },
          { name: 'VVIP', price: 200000, sold: 147 }
        ]
      })
    }, 500)
  }

  const addMockTransaction = () => {
    const methods = ['Mobile Money (USSD)', 'Online Payment', 'Cash', 'POS']
    const phones = ['+256700123456', '+256701234567', '+256702345678', '+256703456789']
    const emails = ['john.doe@example.com', 'jane.smith@gmail.com', 'alice@example.com', 'bob.wilson@outlook.com']
    const prices = [50000, 100000, 200000]
    
    // Randomly choose between phone (USSD) or email (online)
    const isUSSD = Math.random() > 0.5
    const customerInfo = isUSSD 
      ? phones[Math.floor(Math.random() * phones.length)]
      : emails[Math.floor(Math.random() * emails.length)]
    
    const newTransaction = {
      id: Date.now(),
      customerInfo: maskCustomerInfo(customerInfo), // Masked info
      rawCustomerInfo: customerInfo, // Keep for backend (not displayed)
      amount: prices[Math.floor(Math.random() * prices.length)],
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      time: new Date().toISOString(),
      status: 'completed'
    }
    
    setLiveTransactions(prev => [newTransaction, ...prev].slice(0, 50))
  }

  const handleTicketScanned = (scanResult) => {
    // Increment scanned count
    setScannedCount(prev => prev + 1)
    
    // Add to transaction feed
    const newTransaction = {
      id: Date.now(),
      customerInfo: scanResult.customerInfo,
      amount: event.ticketTypes.find(t => t.name === scanResult.ticketType)?.price || 0,
      paymentMethod: scanResult.purchaseMethod,
      time: new Date().toISOString(),
      status: 'completed',
      scanned: true,
      ticketCode: scanResult.ticketCode
    }
    
    setLiveTransactions(prev => [newTransaction, ...prev])
  }

  const handleManualEntry = async (e) => {
    e.preventDefault()
    
    // TODO: Replace with actual API call
    // await axios.post(`/api/employee/events/${eventId}/manual-transaction`, manualForm)
    
    const newTransaction = {
      id: Date.now(),
      customerInfo: maskCustomerInfo(manualForm.customerInfo),
      rawCustomerInfo: manualForm.customerInfo, // Keep for backend
      amount: manualForm.amount,
      paymentMethod: manualForm.paymentMethod === 'cash' ? 'Cash' : 'POS',
      time: new Date().toISOString(),
      status: 'completed',
      manual: true
    }
    
    setLiveTransactions(prev => [newTransaction, ...prev])
    
    // Reset form
    setManualForm({
      customerInfo: '',
      amount: '',
      paymentMethod: 'cash',
      ticketType: ''
    })
    setShowManualEntry(false)
    
    alert('Transaction registered successfully!')
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-graytext">Loading event details...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/employee/dashboard')}
          className="flex items-center gap-2 text-graytext hover:text-white mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Events
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-clash font-bold text-4xl mb-2">{event.title}</h1>
            <p className="text-graytext">
              {event.location} • {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-400 font-semibold">Live</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <UserGroupIcon className="h-8 w-8 text-gold mb-2" />
          <p className="text-graytext text-sm mb-1">Tickets Sold</p>
          <p className="font-clash font-bold text-3xl">{event.ticketsSold}</p>
          <p className="text-xs text-graytext mt-1">of {event.capacity} capacity</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-500/10 backdrop-blur-sm rounded-lg p-6 border border-green-500/30"
        >
          <QrCodeIcon className="h-8 w-8 text-green-400 mb-2" />
          <p className="text-graytext text-sm mb-1">Scanned Today</p>
          <p className="font-clash font-bold text-3xl text-green-400">{scannedCount}</p>
          <p className="text-xs text-graytext mt-1">tickets validated</p>
        </motion.div>

        {event.ticketTypes.map((ticket, index) => (
          <motion.div
            key={ticket.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 1) * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
          >
            <p className="text-graytext text-sm mb-1">{ticket.name}</p>
            <p className="font-clash font-bold text-2xl">{ticket.sold}</p>
            <p className="text-xs text-gold mt-1">UGX {ticket.price.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setShowScanner(!showScanner)
            setShowManualEntry(false)
          }}
          className={`px-6 py-3 font-semibold rounded-md transition-colors ${
            showScanner
              ? 'bg-white/10 text-white border border-white/20'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <QrCodeIcon className="h-5 w-5" />
            <span>{showScanner ? 'Close Scanner' : 'Scan/Validate Ticket'}</span>
          </div>
        </button>
        
        <button
          onClick={() => {
            setShowManualEntry(!showManualEntry)
            setShowScanner(false)
          }}
          className={`px-6 py-3 font-semibold rounded-md transition-colors ${
            showManualEntry
              ? 'bg-white/10 text-white border border-white/20'
              : 'bg-gold text-black hover:bg-gold/90'
          }`}
        >
          {showManualEntry ? 'Cancel' : '+ Register Cash/POS Transaction'}
        </button>
      </div>

      {/* Ticket Scanner */}
      {showScanner && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8"
        >
          <TicketScanner eventId={eventId} onTicketScanned={handleTicketScanned} />
        </motion.div>
      )}

      {/* Manual Entry Form */}
      {showManualEntry && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8"
        >
          <h3 className="font-clash font-bold text-xl mb-4">Manual Transaction Entry</h3>
          <form onSubmit={handleManualEntry} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Customer Phone or Email</label>
              <input
                type="text"
                required
                value={manualForm.customerInfo}
                onChange={(e) => setManualForm({ ...manualForm, customerInfo: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                placeholder="+256 700 000 000 or email@example.com"
              />
              <p className="text-xs text-graytext mt-1">
                Will be masked in records (07*****345 or jo***@gmail.com)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ticket Type</label>
              <select
                required
                value={manualForm.ticketType}
                onChange={(e) => {
                  const selectedTicket = event.ticketTypes.find(t => t.name === e.target.value)
                  setManualForm({ 
                    ...manualForm, 
                    ticketType: e.target.value,
                    amount: selectedTicket?.price || ''
                  })
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
              >
                <option value="" className="bg-matte">Select ticket type</option>
                {event.ticketTypes.map(ticket => (
                  <option key={ticket.name} value={ticket.name} className="bg-matte">
                    {ticket.name} - UGX {ticket.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                required
                value={manualForm.amount}
                onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={manualForm.paymentMethod}
                onChange={(e) => setManualForm({ ...manualForm, paymentMethod: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
              >
                <option value="cash" className="bg-matte">Cash</option>
                <option value="pos" className="bg-matte">POS/Card</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
              >
                Register Transaction
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Live Transaction Feed */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-clash font-bold text-2xl">Live Transaction Feed</h2>
          <p className="text-graytext text-sm">Real-time ticket purchases</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-graytext uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graytext uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graytext uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graytext uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graytext uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graytext uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {liveTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-graytext">
                    <ClockIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    Waiting for transactions...
                  </td>
                </tr>
              ) : (
                liveTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                    animate={{ backgroundColor: 'transparent' }}
                    transition={{ duration: 2 }}
                    className="hover:bg-white/5"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(transaction.time).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{transaction.customerInfo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gold">
                      UGX {Number(transaction.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {transaction.paymentMethod === 'Cash' ? (
                          <BanknotesIcon className="h-4 w-4" />
                        ) : transaction.paymentMethod === 'POS' ? (
                          <CreditCardIcon className="h-4 w-4" />
                        ) : transaction.paymentMethod?.includes('USSD') ? (
                          <span>📱</span>
                        ) : (
                          <span>💳</span>
                        )}
                        <span className="truncate max-w-[120px]">{transaction.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {transaction.manual && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Manual</span>
                        )}
                        {transaction.scanned && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Scanned</span>
                        )}
                        {!transaction.manual && !transaction.scanned && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">Online</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircleIcon className="h-4 w-4" />
                        Completed
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EventWork
