import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  BanknotesIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FlagIcon,
  StarIcon,
  QrCodeIcon,
  HashtagIcon,
  CreditCardIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Utility function to mask customer information
const maskCustomerInfo = (info) => {
  if (!info) return 'N/A'
  
  // Check if it's an email
  if (info.includes('@')) {
    const [username, domain] = info.split('@')
    if (username.length <= 3) {
      return `${username[0]}***@${domain}`
    }
    return `${username.slice(0, 3)}***@${domain}`
  }
  
  // Check if it's a phone number
  if (info.match(/^\+?[\d\s-]+$/)) {
    const cleaned = info.replace(/\D/g, '')
    if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 2)}***${cleaned.slice(-2)}`
    }
    return `${cleaned.slice(0, 3)}*****${cleaned.slice(-3)}`
  }
  
  // Default masking for other formats
  if (info.length <= 6) {
    return `${info.slice(0, 2)}***`
  }
  return `${info.slice(0, 3)}*****${info.slice(-2)}`
}

const EventDetails = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showScanner, setShowScanner] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [scannedCount, setScannedCount] = useState(0)
  const [scanMode, setScanMode] = useState('qr') // 'qr' or 'manual'
  const [ticketCode, setTicketCode] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [showScanResult, setShowScanResult] = useState(false)
  const [manualForm, setManualForm] = useState({
    customerInfo: '',
    amount: '',
    paymentMethod: 'cash',
    ticketType: ''
  })

  useEffect(() => {
    fetchEventDetails()
    // Simulate live transaction feed
    const interval = setInterval(() => {
      addMockTransaction()
    }, 8000) // New transaction every 8 seconds

    return () => clearInterval(interval)
  }, [eventId])

  const addMockTransaction = () => {
    const methods = ['Mobile Money', 'Online Payment', 'Cash', 'POS']
    const phones = ['+256700123456', '+256701234567', '+256702345678', '+256703456789']
    const emails = ['john.doe@example.com', 'jane.smith@gmail.com', 'alice@example.com', 'bob.wilson@outlook.com']
    
    // Randomly choose between phone (USSD) or email (online)
    const isUSSD = Math.random() > 0.5
    const customerInfo = isUSSD 
      ? phones[Math.floor(Math.random() * phones.length)]
      : emails[Math.floor(Math.random() * emails.length)]
    
    // Pick random ticket type from event
    if (event && event.ticketTypes.length > 0) {
      const randomTicket = event.ticketTypes[Math.floor(Math.random() * event.ticketTypes.length)]
      
      const newTransaction = {
        id: Date.now(),
        customerEmail: maskCustomerInfo(customerInfo),
        customerPhone: maskCustomerInfo(customerInfo),
        ticketType: randomTicket.name,
        amount: randomTicket.price,
        paymentMethod: methods[Math.floor(Math.random() * methods.length)],
        time: new Date().toLocaleString(),
        status: 'completed',
        live: true
      }
      
      setTransactions(prev => [newTransaction, ...prev].slice(0, 50)) // Keep last 50
    }
  }

  useEffect(() => {
    fetchEventDetails()
  }, [eventId])

  const fetchEventDetails = async () => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setEvent({
        id: eventId,
        name: 'Music Festival 2024',
        organizer: 'EventsPro UG',
        organizerEmail: 'info@eventspro.ug',
        organizerPhone: '+256700123456',
        category: 'Music',
        description: 'East Africa\'s biggest music festival featuring international and local artists. Experience 3 days of non-stop entertainment, food, and culture.',
        date: '2024-12-25',
        endDate: '2024-12-27',
        time: '14:00',
        location: 'Kampala, Uganda',
        venue: 'Kololo Airstrip',
        capacity: 10000,
        ticketsSold: 8500,
        revenue: 85000000,
        platformFee: 5100000, // 6% of revenue
        organizerPayout: 79900000,
        status: 'active',
        featured: true,
        createdAt: '2024-10-01',
        lastUpdated: '2024-10-20',
        ticketTypes: [
          { 
            name: 'General Admission', 
            price: 50000, 
            sold: 5000, 
            total: 6000,
            revenue: 250000000 
          },
          { 
            name: 'VIP', 
            price: 100000, 
            sold: 2500, 
            total: 3000,
            revenue: 250000000 
          },
          { 
            name: 'VVIP', 
            price: 200000, 
            sold: 1000, 
            total: 1000,
            revenue: 200000000 
          },
        ],
        coOrganizers: [
          { name: 'Downtown Concerts', share: 30, payout: 23970000 },
          { name: 'Sports Arena', share: 20, payout: 15980000 },
        ],
      })

      // Mock recent transactions
      setTransactions([
        {
          id: 1,
          customerEmail: 'jo***@gmail.com',
          customerPhone: '07*****345',
          ticketType: 'VIP',
          amount: 100000,
          paymentMethod: 'Mobile Money',
          time: '2024-10-25 14:30',
          status: 'completed',
        },
        {
          id: 2,
          customerEmail: 'al***@example.com',
          customerPhone: '07*****678',
          ticketType: 'General Admission',
          amount: 50000,
          paymentMethod: 'Card Payment',
          time: '2024-10-25 14:15',
          status: 'completed',
        },
        {
          id: 3,
          customerEmail: 'sa***@outlook.com',
          customerPhone: '07*****901',
          ticketType: 'VVIP',
          amount: 200000,
          paymentMethod: 'Mobile Money',
          time: '2024-10-25 14:00',
          status: 'completed',
        },
        {
          id: 4,
          customerEmail: 'mi***@gmail.com',
          customerPhone: '07*****234',
          ticketType: 'VIP',
          amount: 100000,
          paymentMethod: 'Bank Transfer',
          time: '2024-10-25 13:45',
          status: 'pending',
        },
        {
          id: 5,
          customerEmail: 'em***@example.com',
          customerPhone: '07*****567',
          ticketType: 'General Admission',
          amount: 50000,
          paymentMethod: 'Mobile Money',
          time: '2024-10-25 13:30',
          status: 'completed',
        },
      ])

      setLoading(false)
    }, 500)
  }

  const handleToggleFeatured = () => {
    const action = event.featured ? 'removed from featured events' : 'added to featured events'
    toast.success(`Event ${action}. It will ${event.featured ? 'no longer' : 'now'} appear prominently on the homepage.`)
    setEvent({ ...event, featured: !event.featured })
  }

  const handleFlagEvent = () => {
    toast.warning('Event flagged for review. This event requires admin attention for potential policy violations or suspicious activity.')
    setEvent({ ...event, status: 'flagged' })
  }

  const handleApproveEvent = () => {
    toast.success('Event approved and activated. The event is now live and visible to all users.')
    setEvent({ ...event, status: 'active' })
  }

  const handleRejectEvent = () => {
    if (confirm('Are you sure you want to reject this event? This will permanently cancel it and refund all tickets.')) {
      toast.error('Event rejected and cancelled. All ticket holders will be refunded.')
      setEvent({ ...event, status: 'cancelled' })
    }
  }

  const handleSuspendEvent = () => {
    if (confirm('Are you sure you want to suspend this event? This will temporarily hide it from the platform until further review.')) {
      toast.error('Event suspended. The event is temporarily hidden and ticket sales are paused.')
      setEvent({ ...event, status: 'suspended' })
    }
  }

  const validateTicket = async (code) => {
    setIsScanning(true)
    setScanResult(null)
    setShowScanResult(false)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation (80% success rate)
      const isValid = Math.random() > 0.2
      
      const result = {
        valid: isValid,
        ticketCode: code,
        customerInfo: isValid ? maskCustomerInfo(
          Math.random() > 0.5 
            ? '+256700123456' 
            : 'john.doe@example.com'
        ) : null,
        ticketType: isValid ? event.ticketTypes[Math.floor(Math.random() * event.ticketTypes.length)].name : null,
        purchaseMethod: isValid ? ['Mobile Money', 'Online Payment', 'Cash'][Math.floor(Math.random() * 3)] : null,
        purchaseDate: isValid ? new Date().toISOString() : null,
        alreadyUsed: isValid ? Math.random() > 0.9 : false,
        message: !isValid 
          ? 'Invalid ticket code. Please check and try again.' 
          : Math.random() > 0.9 
            ? 'This ticket has already been used for entry.'
            : 'Valid ticket. Entry granted.'
      }
      
      setScanResult(result)
      setShowScanResult(true)
      
      if (result.valid && !result.alreadyUsed) {
        setScannedCount(prev => prev + 1)
        toast.success('Ticket validated successfully!')
        
        // Add to transaction feed
        const ticketType = event.ticketTypes.find(t => t.name === result.ticketType)
        const newTransaction = {
          id: Date.now(),
          customerEmail: result.customerInfo,
          customerPhone: result.customerInfo,
          ticketType: result.ticketType,
          amount: ticketType?.price || 0,
          paymentMethod: result.purchaseMethod,
          time: new Date().toLocaleString(),
          status: 'completed',
          scanned: true,
          ticketCode: result.ticketCode
        }
        setTransactions(prev => [newTransaction, ...prev])
      } else if (result.alreadyUsed) {
        toast.error('Ticket already used!')
      } else {
        toast.error('Invalid ticket!')
      }
      
      // Auto-hide result after 5 seconds
      setTimeout(() => {
        setShowScanResult(false)
        setTicketCode('')
      }, 5000)
      
    } catch (error) {
      setScanResult({
        valid: false,
        message: 'Error validating ticket. Please try again.'
      })
      setShowScanResult(true)
      toast.error('Validation error')
    } finally {
      setIsScanning(false)
    }
  }

  const handleScanTicket = (e) => {
    e.preventDefault()
    if (ticketCode.trim()) {
      validateTicket(ticketCode.trim())
    }
  }

  const handleManualEntry = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!manualForm.customerInfo || !manualForm.amount || !manualForm.ticketType) {
      toast.error('Please fill in all required fields')
      return
    }
    
    const newTransaction = {
      id: Date.now(),
      customerEmail: maskCustomerInfo(manualForm.customerInfo),
      customerPhone: maskCustomerInfo(manualForm.customerInfo),
      ticketType: manualForm.ticketType,
      amount: parseFloat(manualForm.amount),
      paymentMethod: manualForm.paymentMethod === 'cash' ? 'Cash' : 'POS',
      time: new Date().toLocaleString(),
      status: 'completed',
      manual: true
    }
    
    setTransactions(prev => [newTransaction, ...prev])
    
    // Reset form
    setManualForm({
      customerInfo: '',
      amount: '',
      paymentMethod: 'cash',
      ticketType: ''
    })
    setShowManualEntry(false)
    
    toast.success('Transaction registered successfully!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-graytext">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <CalendarIcon className="h-12 w-12 text-graytext mx-auto mb-3" />
          <p className="text-graytext">Event not found</p>
          <button
            onClick={() => navigate('/admin/events')}
            className="mt-4 text-gold hover:underline"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/events')}
          className="flex items-center gap-2 text-graytext hover:text-white mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Events
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-clash font-bold text-4xl">{event.name}</h1>
              {event.featured && (
                <span className="px-3 py-1 bg-gold/20 text-gold text-sm rounded-full font-medium flex items-center gap-1">
                  <StarIcon className="h-4 w-4" />
                  Featured
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                event.status === 'active' ? 'bg-green-500/20 text-green-400' :
                event.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                event.status === 'flagged' ? 'bg-red-500/20 text-red-400' :
                event.status === 'suspended' ? 'bg-orange-500/20 text-orange-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
            <p className="text-graytext mb-2">by {event.organizer}</p>
            <div className="flex items-center gap-4 text-sm text-graytext">
              <span>Created: {new Date(event.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>Last Updated: {new Date(event.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFeatured}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                event.featured
                  ? 'bg-gold/20 text-gold hover:bg-gold/30'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {event.featured ? 'Unfeature' : 'Feature'}
            </button>

            {event.status === 'flagged' ? (
              <>
                <button
                  onClick={handleApproveEvent}
                  className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  Approve
                </button>
                <button
                  onClick={handleRejectEvent}
                  className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <XCircleIcon className="h-5 w-5" />
                  Reject
                </button>
              </>
            ) : event.status === 'active' ? (
              <>
                <button
                  onClick={handleFlagEvent}
                  className="px-4 py-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <FlagIcon className="h-5 w-5" />
                  Flag
                </button>
                <button
                  onClick={handleSuspendEvent}
                  className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-medium transition-colors"
                >
                  Suspend
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <TicketIcon className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <p className="text-graytext text-sm mb-1">Tickets Sold</p>
          <p className="font-clash text-2xl font-bold">{event.ticketsSold.toLocaleString()}</p>
          <p className="text-xs text-graytext mt-1">of {event.capacity.toLocaleString()} capacity</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-green-500/10 backdrop-blur-sm rounded-lg p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <QrCodeIcon className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <p className="text-graytext text-sm mb-1">Scanned Today</p>
          <p className="font-clash text-2xl font-bold text-green-400">{scannedCount}</p>
          <p className="text-xs text-graytext mt-1">tickets validated</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gold/20">
              <BanknotesIcon className="h-6 w-6 text-gold" />
            </div>
          </div>
          <p className="text-graytext text-sm mb-1">Total Revenue</p>
          <p className="font-clash text-2xl font-bold">UGX {(event.revenue / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-graytext mt-1">Gross sales</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <ChartBarIcon className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <p className="text-graytext text-sm mb-1">Platform Fee (6%)</p>
          <p className="font-clash text-2xl font-bold">UGX {(event.platformFee / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-graytext mt-1">CEO Bazaar commission</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <BanknotesIcon className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <p className="text-graytext text-sm mb-1">Organizer Payout</p>
          <p className="font-clash text-2xl font-bold">UGX {(event.organizerPayout / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-graytext mt-1">After platform fee</p>
        </motion.div>
      </div>

      {/* Action Buttons for Scanning and Manual Entry */}
      <div className="flex gap-4 mb-8">
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
          <div className="flex items-center gap-2">
            <PlusCircleIcon className="h-5 w-5" />
            <span>{showManualEntry ? 'Cancel' : 'Register Cash/POS Transaction'}</span>
          </div>
        </button>
      </div>

      {/* Ticket Scanner */}
      {showScanner && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
            <h2 className="font-clash font-bold text-xl mb-4">Ticket Scanner</h2>
            
            {/* Scan Mode Selector */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setScanMode('qr')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  scanMode === 'qr'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-graytext hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <QrCodeIcon className="h-5 w-5" />
                  <span>QR Scanner</span>
                </div>
              </button>
              <button
                onClick={() => setScanMode('manual')}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                  scanMode === 'manual'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-graytext hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <HashtagIcon className="h-5 w-5" />
                  <span>Manual Code</span>
                </div>
              </button>
            </div>

            {scanMode === 'qr' ? (
              <div className="text-center py-12">
                <div className="w-64 h-64 mx-auto bg-white/10 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-white/20">
                  <QrCodeIcon className="h-24 w-24 text-graytext" />
                </div>
                <p className="text-graytext mb-4">Position QR code within frame to scan</p>
                <p className="text-sm text-graytext">
                  Camera access required. Click "Manual Code" to enter ticket number manually.
                </p>
              </div>
            ) : (
              <form onSubmit={handleScanTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ticket Code</label>
                  <input
                    type="text"
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value)}
                    placeholder="Enter ticket code (e.g., TKT-2024-XXXXX)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isScanning}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isScanning || !ticketCode.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-white/5 disabled:text-graytext text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {isScanning ? 'Validating...' : 'Validate Ticket'}
                </button>
              </form>
            )}

            {/* Scan Result */}
            <AnimatePresence>
              {showScanResult && scanResult && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 p-4 rounded-lg ${
                    scanResult.valid && !scanResult.alreadyUsed
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-red-500/20 border border-red-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {scanResult.valid && !scanResult.alreadyUsed ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircleIcon className="h-6 w-6 text-red-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`font-semibold ${
                        scanResult.valid && !scanResult.alreadyUsed ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {scanResult.message}
                      </p>
                      {scanResult.valid && !scanResult.alreadyUsed && (
                        <div className="mt-2 space-y-1 text-sm">
                          <p className="text-white">Ticket: <span className="text-graytext">{scanResult.ticketCode}</span></p>
                          <p className="text-white">Type: <span className="text-graytext">{scanResult.ticketType}</span></p>
                          <p className="text-white">Customer: <span className="text-graytext">{scanResult.customerInfo}</span></p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Manual Transaction Entry */}
      {showManualEntry && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
            <h2 className="font-clash font-bold text-xl mb-4">Register Manual Transaction</h2>
            <p className="text-graytext text-sm mb-6">
              Record cash or POS payments collected at the venue
            </p>

            <form onSubmit={handleManualEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Customer Contact <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={manualForm.customerInfo}
                  onChange={(e) => setManualForm({ ...manualForm, customerInfo: e.target.value })}
                  placeholder="Phone number or email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ticket Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={manualForm.ticketType}
                  onChange={(e) => {
                    const selectedTicket = event.ticketTypes.find(t => t.name === e.target.value)
                    setManualForm({ 
                      ...manualForm, 
                      ticketType: e.target.value,
                      amount: selectedTicket?.price || ''
                    })
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                >
                  <option value="">Select ticket type</option>
                  {event.ticketTypes.map((ticket) => (
                    <option key={ticket.name} value={ticket.name}>
                      {ticket.name} - UGX {ticket.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (UGX) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={manualForm.amount}
                  onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Method <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setManualForm({ ...manualForm, paymentMethod: 'cash' })}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      manualForm.paymentMethod === 'cash'
                        ? 'bg-gold text-black'
                        : 'bg-white/5 text-graytext hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <BanknotesIcon className="h-5 w-5" />
                      <span>Cash</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualForm({ ...manualForm, paymentMethod: 'pos' })}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      manualForm.paymentMethod === 'pos'
                        ? 'bg-gold text-black'
                        : 'bg-white/5 text-graytext hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CreditCardIcon className="h-5 w-5" />
                      <span>POS</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowManualEntry(false)
                    setManualForm({
                      customerInfo: '',
                      amount: '',
                      paymentMethod: 'cash',
                      ticketType: ''
                    })
                  }}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gold hover:bg-gold/90 text-black font-semibold rounded-lg transition-colors"
                >
                  Register Transaction
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6"
          >
            <h2 className="font-clash font-bold text-xl mb-4">Event Information</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-graytext mb-1">Description</p>
                <p className="text-white">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-graytext mb-1">Category</p>
                  <p className="text-white">{event.category}</p>
                </div>
                <div>
                  <p className="text-sm text-graytext mb-1">Venue</p>
                  <p className="text-white">{event.venue}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-graytext" />
                    <p className="text-sm text-graytext">Event Date</p>
                  </div>
                  <p className="text-white">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ClockIcon className="h-4 w-4 text-graytext" />
                    <p className="text-sm text-graytext">Start Time</p>
                  </div>
                  <p className="text-white">{event.time}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPinIcon className="h-4 w-4 text-graytext" />
                  <p className="text-sm text-graytext">Location</p>
                </div>
                <p className="text-white">{event.location}</p>
              </div>
            </div>
          </motion.div>

          {/* Ticket Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6"
          >
            <h2 className="font-clash font-bold text-xl mb-4">Ticket Sales Breakdown</h2>
            
            <div className="space-y-4">
              {event.ticketTypes.map((ticket, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{ticket.name}</h3>
                      <p className="text-sm text-graytext">UGX {ticket.price.toLocaleString()} per ticket</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-semibold">UGX {(ticket.revenue / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-graytext">{ticket.sold} / {ticket.total} sold</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gold h-2 rounded-full transition-all"
                      style={{ width: `${(ticket.sold / ticket.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live Transactions Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-clash font-bold text-xl">Live Transaction Feed</h2>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-400 text-sm font-semibold">Live</span>
              </div>
            </div>
            
            <p className="text-graytext text-sm mb-4">
              Real-time transaction monitoring for this event
            </p>

            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <ClockIcon className="h-12 w-12 text-graytext mx-auto mb-3" />
                <p className="text-graytext">No transactions yet</p>
                <p className="text-sm text-graytext mt-1">Transactions will appear here in real-time</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-graytext">{transaction.customerEmail}</p>
                          {transaction.scanned && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium flex items-center gap-1">
                              <QrCodeIcon className="h-3 w-3" />
                              Scanned
                            </span>
                          )}
                          {transaction.manual && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
                              Manual
                            </span>
                          )}
                          {transaction.live && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                              Live
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-white font-medium">{transaction.ticketType}</span>
                          <span className="text-graytext">{transaction.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gold font-semibold">UGX {transaction.amount.toLocaleString()}</p>
                        <div className="flex items-center gap-2 justify-end mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-xs text-graytext mt-1">{transaction.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-graytext">Total Transactions</span>
                <span className="text-white font-semibold">{transactions.length}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organizer Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6"
          >
            <h2 className="font-clash font-bold text-lg mb-4">Organizer Details</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-graytext mb-1">Organization</p>
                <p className="text-white font-medium">{event.organizer}</p>
              </div>
              <div>
                <p className="text-sm text-graytext mb-1">Email</p>
                <p className="text-white">{event.organizerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-graytext mb-1">Phone</p>
                <p className="text-white">{event.organizerPhone}</p>
              </div>
              <div>
                <p className="text-sm text-graytext mb-1">Payout Amount</p>
                <p className="text-gold font-semibold">UGX {(event.organizerPayout / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </motion.div>

          {/* Co-Organizers */}
          {event.coOrganizers && event.coOrganizers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6"
            >
              <h2 className="font-clash font-bold text-lg mb-4 flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5" />
                Co-Organizers
              </h2>
              
              <div className="space-y-3">
                {event.coOrganizers.map((coOrg, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <p className="text-white font-medium mb-1">{coOrg.name}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-graytext">{coOrg.share}% share</span>
                      <span className="text-gold font-semibold">
                        UGX {(coOrg.payout / 1000000).toFixed(2)}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sales Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6"
          >
            <h2 className="font-clash font-bold text-lg mb-4">Sales Progress</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-graytext">Capacity</span>
                  <span className="text-white font-semibold">
                    {((event.ticketsSold / event.capacity) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-gold to-yellow-500 h-3 rounded-full transition-all"
                    style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-graytext mt-2">
                  {event.ticketsSold.toLocaleString()} of {event.capacity.toLocaleString()} tickets sold
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-graytext mb-2">Revenue Target</p>
                <p className="text-2xl font-bold text-gold">UGX {(event.revenue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </motion.div>

          {/* Admin Actions Guide */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30 p-6"
          >
            <h2 className="font-clash font-bold text-lg mb-4 text-blue-400">Admin Actions Guide</h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StarIcon className="h-4 w-4 text-gold" />
                  <p className="font-semibold text-gold">Feature/Unfeature</p>
                </div>
                <p className="text-graytext text-xs">
                  Featured events appear prominently on the homepage with a gold badge, increasing visibility to users.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <FlagIcon className="h-4 w-4 text-yellow-400" />
                  <p className="font-semibold text-yellow-400">Flag Event</p>
                </div>
                <p className="text-graytext text-xs">
                  Mark event for review due to policy violations, suspicious activity, or user reports. Requires admin approval to proceed.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircleIcon className="h-4 w-4 text-green-400" />
                  <p className="font-semibold text-green-400">Approve Event</p>
                </div>
                <p className="text-graytext text-xs">
                  Activate flagged event after review. Makes event live and visible to all users with full functionality.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <XCircleIcon className="h-4 w-4 text-red-400" />
                  <p className="font-semibold text-red-400">Suspend Event</p>
                </div>
                <p className="text-graytext text-xs">
                  Temporarily hide event from platform and pause ticket sales. Can be reactivated later. Use for temporary issues.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <XCircleIcon className="h-4 w-4 text-red-500" />
                  <p className="font-semibold text-red-500">Reject Event</p>
                </div>
                <p className="text-graytext text-xs">
                  Permanently cancel event and refund all tickets. Use for serious violations. This action cannot be undone.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
