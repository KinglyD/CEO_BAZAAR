import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PhoneIcon, EnvelopeIcon, CreditCardIcon } from '@heroicons/react/24/outline'

const Checkout = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { ticket, event } = location.state || {}

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    paymentMethod: 'momo'
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      navigate(`/ticket/${Date.now()}`, {
        state: { ticket, event, buyer: formData }
      })
    }, 2000)
  }

  if (!ticket || !event) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <p className="text-graytext">Invalid checkout session</p>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-clash font-bold text-4xl mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <h2 className="font-clash text-2xl mb-6">Your Information</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                      placeholder="john@example.com"
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
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                      placeholder="07XXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Payment Method</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 bg-white/10 border-2 border-white/20 rounded-md cursor-pointer hover:border-gold/50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="momo"
                        checked={formData.paymentMethod === 'momo'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="mr-3"
                      />
                      <span className="font-medium">MTN Mobile Money</span>
                    </label>
                    <label className="flex items-center p-4 bg-white/10 border-2 border-white/20 rounded-md cursor-pointer hover:border-gold/50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="mr-3"
                      />
                      <CreditCardIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Complete Purchase'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 sticky top-24">
              <h3 className="font-clash text-xl mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-graytext mb-1">Event</p>
                  <p className="font-semibold">{event.title}</p>
                </div>

                <div>
                  <p className="text-sm text-graytext mb-1">Ticket Type</p>
                  <p className="font-semibold">{ticket.name}</p>
                </div>

                <div>
                  <p className="text-sm text-graytext mb-1">Date</p>
                  <p className="font-semibold">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-graytext">Subtotal</span>
                  <span className="font-semibold">UGX {ticket.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-graytext">Processing Fee</span>
                  <span className="font-semibold">UGX 0</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-gold">UGX {ticket.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout