import { useState } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const events = [
    { 
      id: 1, 
      name: 'Tech Summit 2025', 
      date: '2025-11-15',
      ticketsSold: 127,
      revenue: 850000,
      status: 'active',
      capacity: 200
    },
    { 
      id: 2, 
      name: 'Music Festival', 
      date: '2025-12-01',
      ticketsSold: 95,
      revenue: 625000,
      status: 'active',
      capacity: 150
    },
    { 
      id: 3, 
      name: 'Art Exhibition', 
      date: '2025-11-20',
      ticketsSold: 68,
      revenue: 420000,
      status: 'ended',
      capacity: 100
    },
    { 
      id: 4, 
      name: 'Startup Pitch Night', 
      date: '2025-10-28',
      ticketsSold: 52,
      revenue: 555000,
      status: 'ended',
      capacity: 80
    },
  ]

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Sales Overview</h1>
        <p className="text-graytext">Track your event performance and ticket sales</p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
            <input
              type="text"
              placeholder="Search events..."
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
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterStatus === 'active'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('ended')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterStatus === 'ended'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              Ended
            </button>
          </div>
        </div>
      </motion.div>

      {/* Events Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Event Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Tickets Sold</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Revenue</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-medium">{event.name}</td>
                  <td className="py-4 px-6 text-graytext">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{event.ticketsSold}</span>
                      <span className="text-graytext">/ {event.capacity}</span>
                      <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold rounded-full"
                          style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gold font-semibold">
                    UGX {event.revenue.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'active'
                        ? 'bg-green-400/20 text-green-400'
                        : 'bg-gray-400/20 text-gray-400'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-gold hover:text-gold/80 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-graytext">No events found matching your criteria</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Sales