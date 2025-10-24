import { motion } from 'framer-motion'
import { 
  UsersIcon, 
  CalendarIcon, 
  BanknotesIcon, 
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const stats = [
    { 
      name: 'Total Users', 
      value: '1,234', 
      icon: UsersIcon, 
      change: '+12.5%',
      trend: 'up' 
    },
    { 
      name: 'Active Events', 
      value: '42', 
      icon: CalendarIcon, 
      change: '+8.2%',
      trend: 'up' 
    },
    { 
      name: 'Total Revenue', 
      value: 'UGX 45.2M', 
      icon: BanknotesIcon, 
      change: '+23.1%',
      trend: 'up' 
    },
    { 
      name: 'Tickets Sold', 
      value: '3,892', 
      icon: ShoppingBagIcon, 
      change: '-2.4%',
      trend: 'down' 
    },
  ]

  const recentActivity = [
    { id: 1, type: 'New User', description: 'John Doe registered as Organizer', time: '2 mins ago' },
    { id: 2, type: 'New Event', description: 'Tech Summit 2025 created', time: '15 mins ago' },
    { id: 3, type: 'Transaction', description: 'UGX 75,000 sale completed', time: '1 hour ago' },
    { id: 4, type: 'Payout', description: 'UGX 850,000 paid to Tech Events UG', time: '2 hours ago' },
  ]

  const topOrganizers = [
    { id: 1, name: 'Tech Events UG', events: 8, revenue: 4250000 },
    { id: 2, name: 'Music Productions', events: 5, revenue: 3180000 },
    { id: 3, name: 'Art Collective', events: 12, revenue: 2890000 },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Admin Dashboard</h1>
        <p className="text-graytext">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="h-8 w-8 text-gold" />
              <span className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-graytext">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="font-clash text-xl font-bold">Recent Activity</h2>
          </div>
          <div className="divide-y divide-white/5">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gold mb-1">{activity.type}</p>
                    <p className="text-sm text-graytext">{activity.description}</p>
                  </div>
                  <span className="text-xs text-graytext whitespace-nowrap ml-4">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Organizers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="font-clash text-xl font-bold">Top Organizers</h2>
          </div>
          <div className="divide-y divide-white/5">
            {topOrganizers.map((organizer, index) => (
              <div key={organizer.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{organizer.name}</p>
                      <p className="text-sm text-graytext">{organizer.events} events</p>
                    </div>
                  </div>
                  <p className="text-gold font-semibold">
                    UGX {(organizer.revenue / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard