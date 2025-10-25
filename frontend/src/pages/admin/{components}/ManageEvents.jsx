import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  BanknotesIcon,
  FlagIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ManageEvents = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const stats = [
    { label: 'Total Events', value: '1,234', icon: CalendarIcon, color: 'purple' },
    { label: 'Active Events', value: '234', icon: CheckCircleIcon, color: 'green' },
    { label: 'Tickets Sold', value: '45,678', icon: TicketIcon, color: 'blue' },
    { label: 'Total Revenue', value: 'UGX 125M', icon: BanknotesIcon, color: 'gold' },
  ]

  const events = [
    {
      id: 1,
      name: 'Music Festival 2024',
      organizer: 'EventsPro UG',
      category: 'Music',
      date: '2024-12-25',
      location: 'Kampala, Uganda',
      ticketsSold: 8500,
      totalTickets: 10000,
      revenue: 85000000,
      status: 'active',
      featured: true,
    },
    {
      id: 2,
      name: 'Tech Summit',
      organizer: 'Tech Events Ltd',
      category: 'Conference',
      date: '2024-11-15',
      location: 'Kigali, Rwanda',
      ticketsSold: 3200,
      totalTickets: 5000,
      revenue: 48000000,
      status: 'active',
      featured: false,
    },
    {
      id: 3,
      name: 'Jazz Night',
      organizer: 'Music Nights',
      category: 'Music',
      date: '2024-10-30',
      location: 'Entebbe, Uganda',
      ticketsSold: 1800,
      totalTickets: 2000,
      revenue: 27000000,
      status: 'completed',
      featured: false,
    },
    {
      id: 4,
      name: 'Food Carnival',
      organizer: 'Foodies UG',
      category: 'Food & Drink',
      date: '2024-11-20',
      location: 'Jinja, Uganda',
      ticketsSold: 2400,
      totalTickets: 3000,
      revenue: 24000000,
      status: 'active',
      featured: true,
    },
    {
      id: 5,
      name: 'Startup Pitch Night',
      organizer: 'Innovation Hub',
      category: 'Business',
      date: '2024-11-10',
      location: 'Nairobi, Kenya',
      ticketsSold: 450,
      totalTickets: 500,
      revenue: 6750000,
      status: 'flagged',
      featured: false,
    },
  ]

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleFlagEvent = (eventId) => {
    toast.success('Event flagged for review')
  }

  const handleApproveEvent = (eventId) => {
    toast.success('Event approved')
  }

  const handleRejectEvent = (eventId) => {
    toast.error('Event rejected')
  }

  const handleToggleFeatured = (eventId) => {
    toast.success('Featured status updated')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Event Management</h1>
        <p className="text-graytext">Monitor and manage all platform events</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
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
                  stat.color === 'purple' ? 'bg-purple-500/20' :
                  stat.color === 'green' ? 'bg-green-500/20' :
                  stat.color === 'blue' ? 'bg-blue-500/20' :
                  'bg-gold/20'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    stat.color === 'purple' ? 'text-purple-400' :
                    stat.color === 'green' ? 'text-green-400' :
                    stat.color === 'blue' ? 'text-blue-400' :
                    'text-gold'
                  }`} />
                </div>
              </div>
              <p className="text-graytext text-sm mb-1">{stat.label}</p>
              <p className="font-clash text-2xl font-bold">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-graytext" />
          <input
            type="text"
            placeholder="Search events or organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="flagged">Flagged</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Categories</option>
          <option value="Music">Music</option>
          <option value="Conference">Conference</option>
          <option value="Food & Drink">Food & Drink</option>
          <option value="Business">Business</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{event.name}</h3>
                  {event.featured && (
                    <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-graytext">by {event.organizer}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                event.status === 'active' ? 'bg-green-500/20 text-green-400' :
                event.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                event.status === 'flagged' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-graytext">
                <CalendarIcon className="h-4 w-4" />
                {new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-graytext">
                <MapPinIcon className="h-4 w-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TicketIcon className="h-4 w-4 text-graytext" />
                <span className="text-white font-medium">
                  {event.ticketsSold} / {event.totalTickets}
                </span>
                <span className="text-graytext">tickets sold</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BanknotesIcon className="h-4 w-4 text-graytext" />
                <span className="text-gold font-semibold">
                  UGX {(event.revenue / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gold h-2 rounded-full transition-all"
                  style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleFeatured(event.id)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  event.featured
                    ? 'bg-gold/20 text-gold hover:bg-gold/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {event.featured ? 'Unfeatured' : 'Feature'}
              </button>
              
              {event.status === 'flagged' ? (
                <>
                  <button
                    onClick={() => handleApproveEvent(event.id)}
                    className="p-2 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                    title="Approve"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleRejectEvent(event.id)}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    title="Reject"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleFlagEvent(event.id)}
                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  title="Flag Event"
                >
                  <FlagIcon className="h-5 w-5" />
                </button>
              )}
              
              <button
                onClick={() => navigate(`/admin/events/${event.id}`)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="View Details"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="h-12 w-12 text-graytext mx-auto mb-3" />
          <p className="text-graytext">No events found</p>
        </div>
      )}
    </div>
  )
}

export default ManageEvents
