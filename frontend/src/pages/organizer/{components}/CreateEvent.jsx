import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CalendarIcon, MapPinIcon, PhotoIcon } from '@heroicons/react/24/outline'

const CreateEvent = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: '',
    eventType: 'paid',
    image: null
  })

  const [tickets, setTickets] = useState([
    { name: 'Regular', price: '', quantity: '' }
  ])

  const addTicket = () => {
    setTickets([...tickets, { name: '', price: '', quantity: '' }])
  }

  const removeTicket = (index) => {
    setTickets(tickets.filter((_, i) => i !== index))
  }

  const updateTicket = (index, field, value) => {
    const newTickets = [...tickets]
    newTickets[index][field] = value
    setTickets(newTickets)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      navigate('/organizer/dashboard')
    }, 2000)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Create Event</h1>
        <p className="text-graytext">Fill in the details to create your event</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="font-clash text-2xl font-bold mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  placeholder="e.g., Tech Summit 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  placeholder="Describe your event..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                      placeholder="e.g., Serena Hotel, Kampala"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Event Type</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 bg-white/10 border-2 border-white/20 rounded-md cursor-pointer hover:border-gold/50 transition-colors">
                    <input
                      type="radio"
                      name="eventType"
                      value="paid"
                      checked={formData.eventType === 'paid'}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="mr-3"
                    />
                    <span className="font-medium">Paid Event</span>
                  </label>
                  <label className="flex items-center p-3 bg-white/10 border-2 border-white/20 rounded-md cursor-pointer hover:border-gold/50 transition-colors">
                    <input
                      type="radio"
                      name="eventType"
                      value="free"
                      checked={formData.eventType === 'free'}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="mr-3"
                    />
                    <span className="font-medium">Free Event</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Types */}
          {formData.eventType === 'paid' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-clash text-2xl font-bold">Ticket Types</h2>
                <button
                  type="button"
                  onClick={addTicket}
                  className="px-4 py-2 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
                >
                  Add Ticket Type
                </button>
              </div>

              <div className="space-y-4">
                {tickets.map((ticket, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Ticket Name</label>
                        <input
                          type="text"
                          required
                          value={ticket.name}
                          onChange={(e) => updateTicket(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                          placeholder="e.g., VIP"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Price (UGX)</label>
                        <input
                          type="number"
                          required
                          value={ticket.price}
                          onChange={(e) => updateTicket(index, 'price', e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                          placeholder="50000"
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-2">Quantity</label>
                          <input
                            type="number"
                            required
                            value={ticket.quantity}
                            onChange={(e) => updateTicket(index, 'quantity', e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                            placeholder="100"
                          />
                        </div>
                        {tickets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicket(index)}
                            className="self-end px-4 py-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cover Image */}
          <div>
            <h2 className="font-clash text-2xl font-bold mb-6">Cover Image</h2>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-gold/50 transition-colors cursor-pointer">
              <PhotoIcon className="h-12 w-12 text-graytext mx-auto mb-4" />
              <p className="text-graytext mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-graytext">PNG, JPG up to 10MB</p>
              <input type="file" accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Event...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/organizer/dashboard')}
              className="px-8 py-3 border-2 border-white/20 text-white font-semibold rounded-md hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CreateEvent