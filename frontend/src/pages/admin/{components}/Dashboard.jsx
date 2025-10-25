import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import {
  BanknotesIcon,
  UserGroupIcon,
  CalendarIcon,
  TicketIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('30days')

  const stats = [
    {
      label: 'Total Revenue',
      value: 'UGX 125,450,000',
      change: '+23.5%',
      trend: 'up',
      icon: BanknotesIcon,
      color: 'green',
      subtext: 'Platform fees: UGX 8.2M'
    },
    {
      label: 'Active Organizers',
      value: '487',
      change: '+12%',
      trend: 'up',
      icon: UserGroupIcon,
      color: 'blue',
      subtext: '45 new this month'
    },
    {
      label: 'Total Events',
      value: '1,234',
      change: '+18%',
      trend: 'up',
      icon: CalendarIcon,
      color: 'purple',
      subtext: '234 active'
    },
    {
      label: 'Tickets Sold',
      value: '45,678',
      change: '+8.2%',
      trend: 'up',
      icon: TicketIcon,
      color: 'orange',
      subtext: '2,345 today'
    },
  ]

  const revenueData = [
    { month: 'May', revenue: 45000000, fees: 2800000 },
    { month: 'Jun', revenue: 58000000, fees: 3600000 },
    { month: 'Jul', revenue: 72000000, fees: 4500000 },
    { month: 'Aug', revenue: 89000000, fees: 5500000 },
    { month: 'Sep', revenue: 98000000, fees: 6100000 },
    { month: 'Oct', revenue: 125450000, fees: 8200000 },
  ]

  const subscriptionData = [
    { name: 'Free', users: 325, value: 0 },
    { name: 'Pro', users: 125, value: 6250000 },
    { name: 'Premium', users: 37, value: 5550000 },
  ]

  const topEvents = [
    { name: 'Music Festival 2024', organizer: 'EventsPro UG', tickets: 8500, revenue: 85000000 },
    { name: 'Tech Summit', organizer: 'Tech Events', tickets: 3200, revenue: 48000000 },
    { name: 'Jazz Night', organizer: 'Music Nights', tickets: 1800, revenue: 27000000 },
    { name: 'Food Carnival', organizer: 'Foodies UG', tickets: 2400, revenue: 24000000 },
  ]

  const recentActivity = [
    { type: 'event', text: 'New event created: Digital Marketing Workshop', time: '2 mins ago' },
    { type: 'subscription', text: 'EventsPro UG upgraded to Premium', time: '15 mins ago' },
    { type: 'sale', text: '50 tickets sold for Music Festival 2024', time: '23 mins ago' },
    { type: 'user', text: 'New organizer signup: Creative Events Ltd', time: '1 hour ago' },
    { type: 'payout', text: 'Payout request: UGX 2.5M from Tech Events', time: '2 hours ago' },
  ]

  const COLORS = ['#D4AF37', '#4F46E5', '#10B981', '#F59E0B']

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Admin Dashboard</h1>
        <p className="text-graytext">Platform overview and key metrics</p>
      </div>

      <div className="flex justify-end mb-6">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  stat.color === 'green' ? 'bg-green-500/20' :
                  stat.color === 'blue' ? 'bg-blue-500/20' :
                  stat.color === 'purple' ? 'bg-purple-500/20' :
                  'bg-orange-500/20'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    stat.color === 'green' ? 'text-green-400' :
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    'text-orange-400'
                  }`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendIcon className="h-4 w-4" />
                  {stat.change}
                </div>
              </div>
              <p className="text-graytext text-sm mb-1">{stat.label}</p>
              <p className="font-clash text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-graytext">{stat.subtext}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h3 className="font-semibold text-lg mb-4">Revenue & Platform Fees</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#D4AF37" 
                strokeWidth={2}
                name="Total Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="fees" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Platform Fees"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h3 className="font-semibold text-lg mb-4">Subscription Distribution</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="users"
                  label
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex-1 space-y-3">
              {subscriptionData.map((sub, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="font-medium">{sub.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{sub.users} users</p>
                    <p className="text-xs text-graytext">
                      UGX {(sub.value / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h3 className="font-semibold text-lg mb-4">Top Performing Events</h3>
          <div className="space-y-3">
            {topEvents.map((event, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold mb-1">{event.name}</p>
                  <p className="text-xs text-graytext">{event.organizer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gold">
                    UGX {(event.revenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-graytext">{event.tickets} tickets</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'event' ? 'bg-blue-400' :
                  activity.type === 'subscription' ? 'bg-gold' :
                  activity.type === 'sale' ? 'bg-green-400' :
                  activity.type === 'user' ? 'bg-purple-400' :
                  'bg-orange-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm mb-1">{activity.text}</p>
                  <p className="text-xs text-graytext">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
