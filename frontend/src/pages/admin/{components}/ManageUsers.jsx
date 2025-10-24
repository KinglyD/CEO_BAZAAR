import { useState } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, FunnelIcon, EyeIcon, NoSymbolIcon } from '@heroicons/react/24/outline'

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'organizer',
      status: 'active',
      joined: '2025-10-01',
      events: 5,
      revenue: 2400000
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'employee',
      status: 'active',
      joined: '2025-10-10',
      events: 0,
      revenue: 0
    },
    {
      id: 3,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'customer',
      status: 'active',
      joined: '2025-10-15',
      events: 0,
      revenue: 0
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'organizer',
      status: 'suspended',
      joined: '2025-09-20',
      events: 2,
      revenue: 850000
    },
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Manage Users</h1>
        <p className="text-graytext">View and manage platform users</p>
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterRole === 'all'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterRole('organizer')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterRole === 'organizer'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              Organizers
            </button>
            <button
              onClick={() => setFilterRole('employee')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterRole === 'employee'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => setFilterRole('customer')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filterRole === 'customer'
                  ? 'bg-gold text-black'
                  : 'bg-white/10 text-graytext hover:text-white'
              }`}
            >
              Customers
            </button>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
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
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Email</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Role</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Joined</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Events</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Revenue</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-graytext">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-medium">{user.name}</td>
                  <td className="py-4 px-6 text-graytext">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400 capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-400/20 text-green-400'
                        : 'bg-red-400/20 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-graytext">
                    {new Date(user.joined).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="py-4 px-6 text-graytext">{user.events}</td>
                  <td className="py-4 px-6 text-gold font-semibold">
                    {user.revenue > 0 ? `UGX ${(user.revenue / 1000000).toFixed(1)}M` : '-'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
                        <EyeIcon className="h-5 w-5 text-gold" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-md transition-colors">
                        <NoSymbolIcon className="h-5 w-5 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-graytext">No users found matching your criteria</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ManageUsers