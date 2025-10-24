import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { UserIcon, PhoneIcon, BanknotesIcon } from '@heroicons/react/24/outline'

const ManualEntry = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    eventId: '',
    ticketType: '',
    quantity: 1,
    paymentMethod: 'cash',
    amount: ''
  })

  const events = [
    { id: 1, name: 'Tech Summit 2025', tickets: ['Regular', 'VIP'] },
    { id: 2, name: 'Music Festival', tickets: ['Early Bird', 'Regular', 'VIP'] },
    { id: 3, name: 'Art Exhibition', tickets: ['General', 'Student'] },
  ]

  const selectedEvent = events.find(e => e.id === parseInt(formData.eventId))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      alert('Transaction recorded successfully!')
      setFormData({
        customerName: '',
        phoneNumber: '',
        eventId: '',
        ticketType: '',
        quantity: 1,
        paymentMethod: 'cash',
        amount: ''
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Manual Entry</h1>
        <p className="text-graytext">Record walk-in ticket sales manually</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Customer Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                placeholder="07XXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Event</label>
            <select
              required
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value, ticketType: '' })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Choose an event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </div>

          {selectedEvent && (
            <div>
              <label className="block text-sm font-medium mb-2">Ticket Type</label>
              <select
                required
                value={formData.ticketType}
                onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
              >
                <option value="">Choose ticket type</option>
                {selectedEvent.tickets.map(ticket => (
                  <option key={ticket} value={ticket}>{ticket}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount (UGX)</label>
            <div className="relative">
              <BanknotesIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                placeholder="50000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="space-y-2">
              <label className="flex items-center p-3 bg-white/10 border-2 border-white/20 rounded-md cursor-pointer hover:border-gold/50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mr-3"
                />
                <span className="font-medium">Cash</span>
              </label>
              <label className="flex items-center p-3 bg-white/10 border-2 border-white/20 rounded-md cursor-pointer hover:border-gold/50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={formData.paymentMethod === 'momo'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mr-3"
                />
                <span className="font-medium">Mobile Money</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Recording Transaction...' : 'Record Transaction'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default ManualEntry