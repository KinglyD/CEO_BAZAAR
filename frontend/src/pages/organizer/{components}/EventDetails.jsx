import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  TicketIcon,
  BanknotesIcon,
  UsersIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [liveTransactions, setLiveTransactions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddTicket, setShowAddTicket] = useState(false)
  const [editingTicket, setEditingTicket] = useState(null)
  const transactionsPerPage = 10

  const [newTicket, setNewTicket] = useState({
    name: '',
    price: '',
    capacity: ''
  })

  useEffect(() => {
    fetchEventDetails()
    const interval = setInterval(() => {
      addMockTransaction()
    }, 8000)
    return () => clearInterval(interval)
  }, [id])

  const fetchEventDetails = () => {
    // Mock event data - replace with API call
    const mockEvent = {
      id: parseInt(id),
      title: 'Music Festival',
      description: 'Join us for an unforgettable night of live music featuring top artists from across East Africa. Experience world-class performances, amazing food, and great vibes!',
      date: '2025-10-24',
      startTime: '14:00',
      endTime: '23:00',
      location: 'Kololo Airstrip, Kampala',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
      status: 'live',
      capacity: 2000,
      ticketsSold: 1847,
      revenue: 8500000,
      ticketTypes: [
        { id: 1, name: 'Regular', price: 50000, sold: 1200, capacity: 1200 },
        { id: 2, name: 'VIP', price: 100000, sold: 500, capacity: 600 },
        { id: 3, name: 'VVIP', price: 250000, sold: 147, capacity: 200 }
      ]
    }
    setEvent(mockEvent)

    // Mock transactions
    const mockTransactions = Array.from({ length: 47 }, (_, i) => ({
      id: Date.now() - i * 1000,
      customerInfo: i % 2 === 0 ? `07${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}` : `user${i}@example.com`,
      ticketType: ['Regular', 'VIP', 'VVIP'][Math.floor(Math.random() * 3)],
      amount: [50000, 100000, 250000][Math.floor(Math.random() * 3)],
      paymentMethod: ['Mobile Money (USSD)', 'Online Payment', 'Cash', 'POS'][Math.floor(Math.random() * 4)],
      time: new Date(Date.now() - i * 60000).toISOString(),
      status: 'completed'
    }))
    setLiveTransactions(mockTransactions)
  }

  const addMockTransaction = () => {
    if (!event) return
    const ticketType = event.ticketTypes[Math.floor(Math.random() * event.ticketTypes.length)]
    const newTransaction = {
      id: Date.now(),
      customerInfo: Math.random() > 0.5 ? `07${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}` : `customer@example.com`,
      ticketType: ticketType.name,
      amount: ticketType.price,
      paymentMethod: ['Mobile Money (USSD)', 'Online Payment', 'Cash', 'POS'][Math.floor(Math.random() * 4)],
      time: new Date().toISOString(),
      status: 'completed'
    }
    setLiveTransactions(prev => [newTransaction, ...prev])
  }

  const handleAddTicket = () => {
    if (!newTicket.name || !newTicket.price || !newTicket.capacity) {
      alert('Please fill all fields')
      return
    }
    const ticket = {
      id: Date.now(),
      name: newTicket.name,
      price: parseInt(newTicket.price),
      capacity: parseInt(newTicket.capacity),
      sold: 0
    }
    setEvent({ ...event, ticketTypes: [...event.ticketTypes, ticket] })
    setNewTicket({ name: '', price: '', capacity: '' })
    setShowAddTicket(false)
    alert('Ticket type added successfully!')
  }

  const handleEditTicket = (ticket) => {
    setEditingTicket({ ...ticket })
  }

  const handleUpdateTicket = () => {
    setEvent({
      ...event,
      ticketTypes: event.ticketTypes.map(t =>
        t.id === editingTicket.id ? editingTicket : t
      )
    })
    setEditingTicket(null)
    alert('Ticket updated successfully!')
  }

  const handleDeleteTicket = (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket type?')) {
      setEvent({
        ...event,
        ticketTypes: event.ticketTypes.filter(t => t.id !== ticketId)
      })
      alert('Ticket type deleted successfully!')
    }
  }

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = liveTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction)
  const totalPages = Math.ceil(liveTransactions.length / transactionsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (!event) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-graytext">Loading...</p></div>
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/organizer/dashboard')}
          className="flex items-center gap-2 text-graytext hover:text-white mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Dashboard
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-clash font-bold text-4xl mb-2">{event.title}</h1>
            <p className="text-graytext">{event.description}</p>
          </div>
          {event.status === 'live' && (
            <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
              LIVE NOW
            </div>
          )}
        </div>
      </div>

      {/* Event Image & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <CalendarIcon className="h-8 w-8 text-gold mb-2" />
            <h3 className="text-sm text-graytext mb-1">Date</h3>
            <p className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <ClockIcon className="h-8 w-8 text-gold mb-2" />
            <h3 className="text-sm text-graytext mb-1">Time</h3>
            <p className="font-semibold">{event.startTime} - {event.endTime}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <MapPinIcon className="h-8 w-8 text-gold mb-2" />
            <h3 className="text-sm text-graytext mb-1">Location</h3>
            <p className="font-semibold">{event.location}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <BanknotesIcon className="h-8 w-8 text-gold mb-2" />
            <h3 className="text-sm text-graytext mb-1">Total Revenue</h3>
            <p className="font-semibold text-gold">UGX {event.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Ticket Types Management */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-clash text-2xl font-bold">Ticket Types</h2>
          <button
            onClick={() => setShowAddTicket(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Ticket Type
          </button>
        </div>

        {/* Add Ticket Form */}
        <AnimatePresence>
          {showAddTicket && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-white/10 rounded-lg border border-white/20"
            >
              <h3 className="font-semibold mb-4">Add New Ticket Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Ticket Name (e.g., VIP)"
                  value={newTicket.name}
                  onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold"
                />
                <input
                  type="number"
                  placeholder="Price (UGX)"
                  value={newTicket.price}
                  onChange={(e) => setNewTicket({ ...newTicket, price: e.target.value })}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold"
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={newTicket.capacity}
                  onChange={(e) => setNewTicket({ ...newTicket, capacity: e.target.value })}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddTicket}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowAddTicket(false)
                    setNewTicket({ name: '', price: '', capacity: '' })
                  }}
                  className="px-4 py-2 bg-white/10 text-white font-semibold rounded-md hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ticket Types List */}
        <div className="space-y-4">
          {event.ticketTypes.map((ticket) => (
            <div key={ticket.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
              {editingTicket?.id === ticket.id ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={editingTicket.name}
                    onChange={(e) => setEditingTicket({ ...editingTicket, name: e.target.value })}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold"
                  />
                  <input
                    type="number"
                    value={editingTicket.price}
                    onChange={(e) => setEditingTicket({ ...editingTicket, price: parseInt(e.target.value) })}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold"
                  />
                  <input
                    type="number"
                    value={editingTicket.capacity}
                    onChange={(e) => setEditingTicket({ ...editingTicket, capacity: parseInt(e.target.value) })}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateTicket}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <CheckCircleIcon className="h-5 w-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => setEditingTicket(null)}
                      className="flex-1 px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20"
                    >
                      <XMarkIcon className="h-5 w-5 mx-auto" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{ticket.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-graytext">
                      <span>Price: <span className="text-gold font-semibold">UGX {ticket.price.toLocaleString()}</span></span>
                      <span>Sold: <span className="text-white">{ticket.sold}/{ticket.capacity}</span></span>
                      <span>Available: <span className="text-green-400">{ticket.capacity - ticket.sold}</span></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTicket(ticket)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Transactions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-clash font-bold text-2xl">Live Transactions</h2>
          <div className="text-sm text-graytext">
            Total: <span className="text-gold font-semibold">{liveTransactions.length}</span> transactions
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-graytext uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-graytext uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-graytext uppercase">Ticket</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-graytext uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-graytext uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-graytext uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {new Date(transaction.time).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                    {transaction.customerInfo}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {transaction.ticketType}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold text-gold">
                    UGX {transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircleIcon className="h-4 w-4" />
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  currentPage === number
                    ? 'bg-gold text-black font-semibold'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetails
