import { useState } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

const ManageEvents = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const events = [
    {
      id: 1,
      title: 'Tech Summit 2025',
      organizer: 'Tech Events UG',
      date: '2025-11-15',
      status: 'approved',
      ticketsSold: 127,
      revenue: 850000,
      capacity: 200
    },
    {
      id: 2,
      title: 'Music Festival',
      organizer: 'Music Productions',
      date: '2025-12-01',
      status: 'pending',
      ticketsSold: 0,
      revenue: 0,
      capacity: 150
    },
    {
      id: 3,
      title: 'Art Exhibition',
      organizer: 'Art Collective',
      date: '2025-11-20',
      status: 'approved',
      ticketsSold: 68,
      revenue: 420000,
      capacity: 100
    },
    {
      id: 4,
      title: 'Food Festival',
      organizer: 'Foodies UG',
      date: '2025-10-30',
      status: 'rejected',
      ticketsSold: 0,
      revenue: 0,
      capacity: 80
    },
  ]

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Manage Events</h1>
        <p className="text-graytext">Review and approve platform events</p>
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
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterStatus === 'approved'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterStatus === 'rejected'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              Rejected
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
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Event</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Organizer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Sales</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Revenue</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-medium">{event.title}</td>
                  <td className="py-4 px-6 text-graytext">{event.organizer}</td>
                  <td className="py-4 px-6 text-graytext">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'approved'
                        ? 'bg-green-400/20 text-green-400'
                        : event.status === 'pending'
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'bg-red-400/20 text-red-400'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-graytext">
                    {event.ticketsSold} / {event.capacity}
                  </td>
                  <td className="py-4 px-6 text-gold font-semibold">
                    {event.revenue > 0 ? `UGX ${event.revenue.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
                        <EyeIcon className="h-5 w-5 text-gold" />
                      </button>
                      {event.status === 'pending' && (
                        <>
                          <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
                            <CheckIcon className="h-5 w-5 text-green-400" />
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
                            <XMarkIcon className="h-5 w-5 text-red-400" />
                          </button>
                        </>
                      )}
                    </div>
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

export default ManageEvents