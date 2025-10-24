import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const EventDetails = () => {
  const { id } = useParams()
  const [selectedTicket, setSelectedTicket] = useState(null)

  // Mock data - will be replaced with API call
  const event = {
    id: 1,
    title: 'Tech Summit 2025',
    description: 'Join us for the biggest tech conference of the year. Network with industry leaders, attend workshops, and discover the latest innovations.',
    longDescription: 'The Tech Summit 2025 brings together the brightest minds in technology for three days of learning, networking, and innovation. Featuring keynote speakers from leading tech companies, interactive workshops, and exclusive networking sessions.',
    date: '2025-11-15',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    location: 'Serena Hotel, Kampala',
    organizer: 'Tech Events UG',
    capacity: 500,
    soldCount: 247,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
    tickets: [
      { id: 1, name: 'Early Bird', price: 50000, available: 50 },
      { id: 2, name: 'Regular', price: 75000, available: 150 },
      { id: 3, name: 'VIP', price: 150000, available: 20 }
    ]
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"
            >
              <h1 className="font-clash font-bold text-4xl mb-4">{event.title}</h1>
              
              <div className="flex flex-wrap gap-6 mb-8 text-graytext">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gold" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-gold" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-gold" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-gold" />
                  <span>{event.soldCount} / {event.capacity} attending</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h2 className="font-clash text-2xl mb-4">About This Event</h2>
                <p className="text-graytext leading-relaxed mb-4">{event.description}</p>
                <p className="text-graytext leading-relaxed">{event.longDescription}</p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="font-clash text-xl mb-4">Organized by</h3>
                <p className="text-gold font-semibold">{event.organizer}</p>
              </div>
            </motion.div>
          </div>

          {/* Ticket Selection Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 sticky top-24"
            >
              <h3 className="font-clash text-2xl mb-6">Select Tickets</h3>

              <div className="space-y-4 mb-6">
                {event.tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTicket?.id === ticket.id
                        ? 'border-gold bg-gold/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{ticket.name}</h4>
                      <span className="text-gold font-bold">
                        UGX {ticket.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-graytext">
                      {ticket.available} tickets remaining
                    </p>
                  </div>
                ))}
              </div>

              {selectedTicket && (
                <Link
                  to={`/checkout/${event.id}`}
                  state={{ ticket: selectedTicket, event }}
                  className="block w-full py-3 bg-gold text-black text-center font-semibold rounded-md hover:bg-gold/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              )}

              {!selectedTicket && (
                <button
                  disabled
                  className="w-full py-3 bg-white/10 text-graytext text-center font-semibold rounded-md cursor-not-allowed"
                >
                  Select a ticket type
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails