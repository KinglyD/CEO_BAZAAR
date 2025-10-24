import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const EmployeeDashboard = () => {
  const navigate = useNavigate()
  const [organizers, setOrganizers] = useState([])
  const [selectedOrganizer, setSelectedOrganizer] = useState(null)
  const [availableEvents, setAvailableEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrganizersAndEvents()
  }, [])

  const fetchOrganizersAndEvents = async () => {
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: 'Tech Events Uganda',
          email: 'organizer@techevents.ug',
          events: [
            {
              id: 1,
              title: 'Tech Summit 2025',
              date: '2025-10-25',
              startTime: '09:00',
              endTime: '17:00',
              location: 'Serena Hotel, Kampala',
              capacity: 500,
              ticketsSold: 387,
              status: 'upcoming',
              myRole: 'Ticket Scanner',
              image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
              ticketTypes: [
                { name: 'Regular', price: 50000, sold: 250, capacity: 300 },
                { name: 'VIP', price: 100000, sold: 137, capacity: 200 }
              ]
            },
            {
              id: 3,
              title: 'AI & Innovation Conference',
              date: '2025-11-15',
              startTime: '08:00',
              endTime: '18:00',
              location: 'Kampala Serena Hotel',
              capacity: 800,
              ticketsSold: 623,
              status: 'upcoming',
              myRole: 'Registration Desk',
              image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
              ticketTypes: [
                { name: 'Early Bird', price: 75000, sold: 300, capacity: 300 },
                { name: 'Regular', price: 100000, sold: 223, capacity: 400 },
                { name: 'VIP', price: 200000, sold: 100, capacity: 100 }
              ]
            }
          ]
        },
        {
          id: 2,
          name: 'Music Fest Promoters',
          email: 'team@musicfest.com',
          events: [
            {
              id: 2,
              title: 'Music Festival',
              date: '2025-10-24',
              startTime: '14:00',
              endTime: '23:00',
              location: 'Kololo Airstrip',
              capacity: 2000,
              ticketsSold: 1847,
              status: 'live',
              myRole: 'Entry Manager',
              image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
              ticketTypes: [
                { name: 'Regular', price: 50000, sold: 1200, capacity: 1200 },
                { name: 'VIP', price: 100000, sold: 500, capacity: 600 },
                { name: 'VVIP', price: 250000, sold: 147, capacity: 200 }
              ]
            },
            {
              id: 4,
              title: 'Jazz Night Under The Stars',
              date: '2025-11-30',
              startTime: '18:00',
              endTime: '23:00',
              location: 'National Theatre Gardens',
              capacity: 500,
              ticketsSold: 234,
              status: 'upcoming',
              myRole: 'Ticket Validator',
              image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
              ticketTypes: [
                { name: 'General', price: 30000, sold: 150, capacity: 300 },
                { name: 'Premium', price: 60000, sold: 84, capacity: 200 }
              ]
            }
          ]
        },
        {
          id: 3,
          name: 'Sports & Entertainment Ltd',
          email: 'info@sportsent.ug',
          events: [
            {
              id: 5,
              title: 'Rugby Tournament Finals',
              date: '2025-12-05',
              startTime: '10:00',
              endTime: '19:00',
              location: 'Legends Rugby Club',
              capacity: 1500,
              ticketsSold: 892,
              status: 'upcoming',
              myRole: 'Gate Control',
              image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800',
              ticketTypes: [
                { name: 'Standing', price: 20000, sold: 600, capacity: 800 },
                { name: 'Seated', price: 50000, sold: 250, capacity: 500 },
                { name: 'VIP Box', price: 150000, sold: 42, capacity: 200 }
              ]
            }
          ]
        }
      ]
      setOrganizers(mockData)
      setIsLoading(false)
    }, 1000)
  }

  const handleOrganizerChange = (organizerId) => {
    const organizer = organizers.find(o => o.id === parseInt(organizerId))
    setSelectedOrganizer(organizer)
    setAvailableEvents(organizer?.events || [])
  }

  const handleEventChange = (eventId) => {
    // Navigate to the event work page
    navigate(`/employee/event/${eventId}`)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-graytext">Loading...</p></div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">EVENTS</h1>
        <p className="text-graytext">Select an organizer and event to start working</p>
      </div>
      
      {/* Organizer Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-3 flex items-center gap-2">
          <BuildingOfficeIcon className="h-5 w-5 text-gold" />
          Select Organizer
        </label>
        <div className="relative">
          <select 
            value={selectedOrganizer?.id || ''} 
            onChange={(e) => handleOrganizerChange(e.target.value)} 
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors appearance-none pr-10"
          >
            <option value="" className="bg-matte">Choose an organizer...</option>
            {organizers.map(org => (
              <option key={org.id} value={org.id} className="bg-matte">
                {org.name} ({org.events.length} event{org.events.length !== 1 ? 's' : ''})
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-graytext pointer-events-none" />
        </div>
      </div>

      {/* Event Cards Grid */}
      {selectedOrganizer && availableEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="font-clash font-bold text-2xl mb-4 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-gold" />
            Available Events - Click to Start Working
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableEvents.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => handleEventChange(event.id)}
                className="cursor-pointer rounded-lg overflow-hidden border-2 border-white/10 hover:border-gold transition-all bg-white/5 backdrop-blur-sm"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {event.status === 'live' && (
                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-clash font-bold text-lg mb-2">{event.title}</h3>
                  <div className="space-y-2 text-sm text-graytext">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckBadgeIcon className="h-4 w-4 text-gold" />
                      <span className="text-gold font-semibold">{event.myRole}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-graytext">Tickets Sold</span>
                      <span className="font-semibold">{event.ticketsSold}/{event.capacity}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* No organizer selected message */}
      {!selectedOrganizer && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 text-graytext">
          <BuildingOfficeIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select an organizer to view available events</p>
        </motion.div>
      )}
    </div>
  )
}

export default EmployeeDashboard
