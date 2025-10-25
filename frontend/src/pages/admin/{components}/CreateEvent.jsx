import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CalendarIcon, 
  MapPinIcon, 
  TicketIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const CreateEvent = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Basic Info, 2: Tickets, 3: Collaboration
  
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    location: '',
    category: 'concert',
    image: null,
    isCollaborative: false,
    platformFee: 6 // 6% for regular, 8% for premium
  })

  const [tickets, setTickets] = useState([
    { id: 1, name: 'General Admission', price: '', quantity: '', description: '' }
  ])

  const [coOrganizers, setCoOrganizers] = useState([])
  const [revenueSplit, setRevenueSplit] = useState([
    { organizationId: 'current', name: 'Your Organization', percentage: 100 }
  ])

  // Mock list of organizations for collaboration
  const [availableOrganizations] = useState([
    { id: 2, name: 'Downtown Concerts Inc' },
    { id: 3, name: 'Sports Arena LLC' },
    { id: 4, name: 'Art Gallery UG' },
    { id: 5, name: 'Tech Events Co' }
  ])

  const addTicketTier = () => {
    setTickets([...tickets, { 
      id: Date.now(), 
      name: '', 
      price: '', 
      quantity: '', 
      description: '' 
    }])
  }

  const removeTicketTier = (id) => {
    setTickets(tickets.filter(t => t.id !== id))
  }

  const updateTicket = (id, field, value) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const addCoOrganizer = (org) => {
    if (coOrganizers.find(co => co.id === org.id)) return
    
    const newCoOrganizers = [...coOrganizers, org]
    setCoOrganizers(newCoOrganizers)
    
    // Recalculate revenue split evenly
    const totalOrgs = newCoOrganizers.length + 1 // +1 for current org
    const evenSplit = Math.floor(100 / totalOrgs)
    const remainder = 100 - (evenSplit * totalOrgs)
    
    const newSplit = [
      { organizationId: 'current', name: 'Your Organization', percentage: evenSplit + remainder },
      ...newCoOrganizers.map(co => ({
        organizationId: co.id,
        name: co.name,
        percentage: evenSplit
      }))
    ]
    
    setRevenueSplit(newSplit)
    setEventData({ ...eventData, isCollaborative: true })
  }

  const removeCoOrganizer = (orgId) => {
    const newCoOrganizers = coOrganizers.filter(co => co.id !== orgId)
    setCoOrganizers(newCoOrganizers)
    
    if (newCoOrganizers.length === 0) {
      setRevenueSplit([{ organizationId: 'current', name: 'Your Organization', percentage: 100 }])
      setEventData({ ...eventData, isCollaborative: false })
    } else {
      const totalOrgs = newCoOrganizers.length + 1
      const evenSplit = Math.floor(100 / totalOrgs)
      const remainder = 100 - (evenSplit * totalOrgs)
      
      const newSplit = [
        { organizationId: 'current', name: 'Your Organization', percentage: evenSplit + remainder },
        ...newCoOrganizers.map(co => ({
          organizationId: co.id,
          name: co.name,
          percentage: evenSplit
        }))
      ]
      
      setRevenueSplit(newSplit)
    }
  }

  const updateRevenueSplit = (orgId, newPercentage) => {
    const updated = revenueSplit.map(rs => 
      rs.organizationId === orgId ? { ...rs, percentage: Number(newPercentage) } : rs
    )
    
    const total = updated.reduce((sum, rs) => sum + rs.percentage, 0)
    
    if (total <= 100) {
      setRevenueSplit(updated)
    }
  }

  const calculateEstimatedRevenue = () => {
    const totalTickets = tickets.reduce((sum, t) => sum + (Number(t.price) * Number(t.quantity)), 0)
    const platformFee = totalTickets * (eventData.platformFee / 100)
    const organizerShare = totalTickets - platformFee
    
    return {
      totalTickets,
      platformFee,
      organizerShare,
      splits: revenueSplit.map(rs => ({
        ...rs,
        amount: (organizerShare * rs.percentage / 100)
      }))
    }
  }

  const handleSubmit = () => {
    // TODO: API call to create event
    console.log('Event Data:', eventData)
    console.log('Tickets:', tickets)
    console.log('Co-Organizers:', coOrganizers)
    console.log('Revenue Split:', revenueSplit)
    
    alert('Event created! Co-organizers will receive invitations to approve.')
    navigate('/admin/events')
  }

  const revenue = calculateEstimatedRevenue()
  const totalSplit = revenueSplit.reduce((sum, rs) => sum + rs.percentage, 0)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-clash font-bold text-3xl mb-2">Create Event</h1>
        <p className="text-graytext">Set up your event and invite co-organizers</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= s ? 'bg-gold text-black' : 'bg-white/10 text-graytext'
            } font-semibold transition-colors`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`w-24 h-1 mx-2 ${
                step > s ? 'bg-gold' : 'bg-white/10'
              } transition-colors`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="font-clash font-bold text-xl mb-6">Event Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Event Name</label>
                <input
                  type="text"
                  value={eventData.name}
                  onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                  placeholder="Tech Summit 2025"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows="4"
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Describe your event..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={eventData.time}
                  onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Venue</label>
                <input
                  type="text"
                  value={eventData.venue}
                  onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                  placeholder="Kampala Serena Hotel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                  placeholder="Kampala, Uganda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={eventData.category}
                  onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="concert" className="bg-matte">Concert</option>
                  <option value="conference" className="bg-matte">Conference</option>
                  <option value="sports" className="bg-matte">Sports</option>
                  <option value="festival" className="bg-matte">Festival</option>
                  <option value="workshop" className="bg-matte">Workshop</option>
                  <option value="other" className="bg-matte">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Platform Fee</label>
                <select
                  value={eventData.platformFee}
                  onChange={(e) => setEventData({ ...eventData, platformFee: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                >
                  <option value={6} className="bg-matte">6% - Standard Events</option>
                  <option value={8} className="bg-matte">8% - Premium Events</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Event Image</label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-gold/50 transition-colors cursor-pointer">
                  <PhotoIcon className="h-12 w-12 text-graytext mx-auto mb-2" />
                  <p className="text-sm text-graytext mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-graytext">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
            >
              Next: Ticket Tiers
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Ticket Tiers */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-clash font-bold text-xl">Ticket Tiers</h2>
              <button
                onClick={addTicketTier}
                className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold border border-gold/50 rounded-md hover:bg-gold/30 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Add Tier
              </button>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div key={ticket.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Tier {index + 1}</h3>
                    {tickets.length > 1 && (
                      <button
                        onClick={() => removeTicketTier(ticket.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Ticket Name</label>
                      <input
                        type="text"
                        value={ticket.name}
                        onChange={(e) => updateTicket(ticket.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                        placeholder="VIP, General, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Price (UGX)</label>
                      <input
                        type="number"
                        value={ticket.price}
                        onChange={(e) => updateTicket(ticket.id, 'price', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                        placeholder="50000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Quantity</label>
                      <input
                        type="number"
                        value={ticket.quantity}
                        onChange={(e) => updateTicket(ticket.id, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                        placeholder="100"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm mb-2">Description</label>
                      <input
                        type="text"
                        value={ticket.description}
                        onChange={(e) => updateTicket(ticket.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                        placeholder="Includes front row seating, meet & greet..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3 bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-8 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
            >
              Next: Collaboration
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Collaboration & Revenue Split */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Add Co-Organizers */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="font-clash font-bold text-xl mb-4">Invite Co-Organizers</h2>
            <p className="text-graytext text-sm mb-6">
              Collaborate with other organizations and split revenue
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {availableOrganizations
                .filter(org => !coOrganizers.find(co => co.id === org.id))
                .map(org => (
                  <button
                    key={org.id}
                    onClick={() => addCoOrganizer(org)}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:border-gold/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <UserGroupIcon className="h-6 w-6 text-gold" />
                      <span className="font-medium">{org.name}</span>
                    </div>
                    <PlusIcon className="h-5 w-5 text-gold" />
                  </button>
                ))}
            </div>

            {coOrganizers.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-graytext">Selected Co-Organizers:</h3>
                {coOrganizers.map(org => (
                  <div key={org.id} className="flex items-center justify-between p-3 bg-gold/10 border border-gold/30 rounded-lg">
                    <span className="font-medium">{org.name}</span>
                    <button
                      onClick={() => removeCoOrganizer(org.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Revenue Split */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="font-clash font-bold text-xl mb-4">Revenue Split</h2>
            
            <div className="space-y-4 mb-6">
              {revenueSplit.map(rs => (
                <div key={rs.organizationId} className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm mb-2">{rs.name}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={rs.percentage}
                        onChange={(e) => updateRevenueSplit(rs.organizationId, e.target.value)}
                        className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-gold transition-colors"
                      />
                      <span className="text-graytext">%</span>
                      <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gold h-full transition-all"
                          style={{ width: `${rs.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-lg border ${
              totalSplit === 100 
                ? 'bg-green-500/10 border-green-500/50' 
                : 'bg-red-500/10 border-red-500/50'
            }`}>
              <p className="text-sm">
                Total: <span className="font-bold">{totalSplit}%</span>
                {totalSplit !== 100 && (
                  <span className="text-red-400 ml-2">(Must equal 100%)</span>
                )}
                {totalSplit === 100 && (
                  <span className="text-green-400 ml-2">✓ Valid split</span>
                )}
              </p>
            </div>
          </div>

          {/* Estimated Revenue Breakdown */}
          <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/30 rounded-lg p-6">
            <h2 className="font-clash font-bold text-xl mb-4 flex items-center gap-2">
              <CurrencyDollarIcon className="h-6 w-6 text-gold" />
              Estimated Revenue Breakdown
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-graytext">Total Ticket Sales</span>
                <span className="font-bold">UGX {revenue.totalTickets.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-red-400">
                <span>Platform Fee ({eventData.platformFee}%)</span>
                <span className="font-bold">- UGX {revenue.platformFee.toLocaleString()}</span>
              </div>

              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between mb-3">
                  <span className="font-semibold">Organizer Share ({100 - eventData.platformFee}%)</span>
                  <span className="font-bold text-gold">UGX {revenue.organizerShare.toLocaleString()}</span>
                </div>

                <div className="space-y-2 pl-4 border-l-2 border-gold/50">
                  {revenue.splits.map(split => (
                    <div key={split.organizationId} className="flex justify-between text-sm">
                      <span className="text-graytext">{split.name} ({split.percentage}%)</span>
                      <span className="font-semibold">UGX {split.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={totalSplit !== 100}
              className="px-8 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {eventData.isCollaborative ? 'Send Invitations & Create Event' : 'Create Event'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CreateEvent
