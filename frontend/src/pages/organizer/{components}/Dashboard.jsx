import { motion } from 'framer-motion'
import { 
  TicketIcon, 
  BanknotesIcon, 
  UsersIcon, 
  CalendarIcon,
  ArrowTrendingUpIcon,
  PlusCircleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Dashboard = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const stats = [
    { name: 'Total Revenue', value: 'UGX 12,450,000', icon: BanknotesIcon, change: '+12.5%', trend: 'up' },
    { name: 'Tickets Sold', value: '1,847', icon: TicketIcon, change: '+28.2%', trend: 'up' },
    { name: 'Active Events', value: '3', icon: CalendarIcon, change: '+2', trend: 'up' },
    { name: 'Total Customers', value: '1,289', icon: UsersIcon, change: '+15.3%', trend: 'up' },
  ]

  const recentEvents = [
    { 
      id: 1, 
      name: 'Music Festival', 
      sales: 1847, 
      revenue: 8500000, 
      status: 'live',
      date: '2025-10-24',
      location: 'Kololo Airstrip',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400'
    },
    { 
      id: 2, 
      name: 'Tech Summit 2025', 
      sales: 387, 
      revenue: 2850000, 
      status: 'upcoming',
      date: '2025-10-25',
      location: 'Serena Hotel',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
    },
    { 
      id: 3, 
      name: 'Jazz Night Under The Stars', 
      sales: 234, 
      revenue: 1100000, 
      status: 'upcoming',
      date: '2025-11-30',
      location: 'National Theatre Gardens',
      image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400'
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">
          Welcome back{user ? `, ${user.fullName.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-graytext">Here's what's happening with your events today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-gold/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gold/10 rounded-lg">
                <stat.icon className="h-6 w-6 text-gold" />
              </div>
              <span className="flex items-center text-sm text-green-400 font-semibold">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-graytext">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-clash text-2xl font-bold">Your Events</h2>
          <Link to="/organizer/sales" className="text-gold hover:text-gold/80 text-sm font-medium">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentEvents.map((event, index) => (
            <Link
              key={event.id}
              to={`/organizer/event/${event.id}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-gold/50 transition-all group cursor-pointer"
              >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {event.status === 'live' && (
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
                    LIVE NOW
                  </div>
                )}
                {event.status === 'upcoming' && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    UPCOMING
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-clash font-bold text-lg mb-2">{event.name}</h3>
                <div className="space-y-2 text-sm text-graytext mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TicketIcon className="h-4 w-4" />
                    <span>{event.sales.toLocaleString()} tickets sold</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-graytext">Revenue</span>
                    <span className="text-gold font-bold">UGX {event.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Link
          to="/organizer/create"
          className="bg-gradient-to-br from-gold/20 to-transparent p-6 rounded-lg border border-white/10 hover:border-gold/50 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <PlusCircleIcon className="h-12 w-12 text-gold mb-4 group-hover:scale-110 transition-transform relative z-10" />
          <h3 className="font-clash text-xl font-bold mb-2 relative z-10">Create New Event</h3>
          <p className="text-graytext text-sm relative z-10">Start selling tickets for your next event</p>
        </Link>

        <Link
          to="/organizer/payouts"
          className="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-gold/50 transition-all group"
        >
          <BanknotesIcon className="h-12 w-12 text-gold mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-clash text-xl font-bold mb-2">View Payouts</h3>
          <p className="text-graytext text-sm">Check your earnings and payout history</p>
        </Link>

        <Link
          to="/organizer/sales"
          className="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-gold/50 transition-all group"
        >
          <CheckCircleIcon className="h-12 w-12 text-gold mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-clash text-xl font-bold mb-2">Sales Analytics</h3>
          <p className="text-graytext text-sm">View detailed sales and customer data</p>
        </Link>
      </motion.div>
    </div>
  )
}

export default Dashboard