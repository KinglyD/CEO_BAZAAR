import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  CheckBadgeIcon,
  XCircleIcon,
  EyeIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPlan, setFilterPlan] = useState('all')

  const stats = [
    { label: 'Total Users', value: '892', icon: UserGroupIcon, color: 'blue' },
    { label: 'Organizers', value: '487', icon: BriefcaseIcon, color: 'purple' },
    { label: 'Employees', value: '234', icon: UserGroupIcon, color: 'green' },
    { label: 'Customers', value: '171', icon: ShoppingBagIcon, color: 'orange' },
  ]

  const users = [
    {
      id: 1,
      name: 'EventsPro UG',
      email: 'contact@eventspro.ug',
      phone: '0700123456',
      role: 'organizer',
      plan: 'Premium',
      status: 'active',
      joinDate: '2024-05-15',
      events: 45,
      revenue: 85000000,
      employees: 12,
    },
    {
      id: 2,
      name: 'Tech Events Ltd',
      email: 'info@techevents.com',
      phone: '0712345678',
      role: 'organizer',
      plan: 'Pro',
      status: 'active',
      joinDate: '2024-06-20',
      events: 23,
      revenue: 48000000,
      employees: 6,
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'john@eventspro.ug',
      phone: '0723456789',
      role: 'employee',
      status: 'active',
      joinDate: '2024-07-10',
      organizer: 'EventsPro UG',
      position: 'Event Coordinator',
    },
    {
      id: 4,
      name: 'Sarah Smith',
      email: 'sarah@email.com',
      phone: '0734567890',
      role: 'customer',
      status: 'active',
      joinDate: '2024-08-05',
      ticketsBought: 12,
      totalSpent: 450000,
    },
    {
      id: 5,
      name: 'Music Nights',
      email: 'contact@musicnights.ug',
      phone: '0745678901',
      role: 'organizer',
      plan: 'Free',
      status: 'suspended',
      joinDate: '2024-03-12',
      events: 8,
      revenue: 5000000,
      employees: 2,
    },
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || user.role === activeTab
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan
    return matchesSearch && matchesTab && matchesStatus && matchesPlan
  })

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const handleSuspendUser = (userId) => {
    toast.success('User suspended successfully')
  }

  const handleActivateUser = (userId) => {
    toast.success('User activated successfully')
  }

  const handleSendMessage = (userId) => {
    toast.success('Message sent to user')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">User Management</h1>
        <p className="text-graytext">Manage organizers, employees, and customers</p>
      </div>

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
                  stat.color === 'blue' ? 'bg-blue-500/20' :
                  stat.color === 'purple' ? 'bg-purple-500/20' :
                  stat.color === 'green' ? 'bg-green-500/20' :
                  'bg-orange-500/20'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'purple' ? 'text-purple-400' :
                    stat.color === 'green' ? 'text-green-400' :
                    'text-orange-400'
                  }`} />
                </div>
              </div>
              <p className="text-graytext text-sm mb-1">{stat.label}</p>
              <p className="font-clash text-2xl font-bold">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'organizer', 'employee', 'customer'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-gold text-black'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}s
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-graytext" />
          <input
            type="text"
            placeholder="Search by name or email..."
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
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>

        {activeTab === 'organizer' && (
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="all">All Plans</option>
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Premium">Premium</option>
          </select>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 font-semibold">User</th>
                <th className="text-left p-4 font-semibold">Role</th>
                {activeTab === 'organizer' && <th className="text-left p-4 font-semibold">Plan</th>}
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Joined</th>
                {activeTab === 'organizer' && <th className="text-left p-4 font-semibold">Events</th>}
                {activeTab === 'organizer' && <th className="text-left p-4 font-semibold">Revenue</th>}
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map(user => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-graytext">{user.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'organizer' ? 'bg-purple-500/20 text-purple-400' :
                      user.role === 'employee' ? 'bg-green-500/20 text-green-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  {activeTab === 'organizer' && (
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        user.plan === 'Premium' ? 'bg-gold/20 text-gold' :
                        user.plan === 'Pro' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-white/10'
                      }`}>
                        {user.plan === 'Premium' && <CheckBadgeIcon className="h-3.5 w-3.5" />}
                        {user.plan}
                      </span>
                    </td>
                  )}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      user.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.status === 'active' ? <CheckCircleIcon className="h-3.5 w-3.5" /> :
                       user.status === 'suspended' ? <NoSymbolIcon className="h-3.5 w-3.5" /> :
                       <XCircleIcon className="h-3.5 w-3.5" />}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-graytext">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  {activeTab === 'organizer' && (
                    <>
                      <td className="p-4 font-semibold">{user.events}</td>
                      <td className="p-4 font-semibold text-gold">
                        UGX {(user.revenue / 1000000).toFixed(1)}M
                      </td>
                    </>
                  )}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Suspend User"
                        >
                          <NoSymbolIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateUser(user.id)}
                          className="p-2 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                          title="Activate User"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleSendMessage(user.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Send Message"
                      >
                        <EnvelopeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-graytext mx-auto mb-3" />
            <p className="text-graytext">No users found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-darkgray border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-darkgray z-10">
                <h2 className="font-bold text-2xl">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-graytext mb-1 block">Full Name</label>
                      <p className="font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-graytext mb-1 block">Role</label>
                      <p className="font-medium capitalize">{selectedUser.role}</p>
                    </div>
                    <div>
                      <label className="text-sm text-graytext mb-1 block">Email</label>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-graytext mb-1 block">Phone</label>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-graytext mb-1 block">Status</label>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        selectedUser.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-graytext mb-1 block">Join Date</label>
                      <p className="font-medium">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {selectedUser.role === 'organizer' && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Business Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-graytext mb-1">Subscription Plan</p>
                        <p className="font-bold text-xl text-gold">{selectedUser.plan}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-graytext mb-1">Total Events</p>
                        <p className="font-bold text-xl">{selectedUser.events}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-graytext mb-1">Total Revenue</p>
                        <p className="font-bold text-xl text-green-400">
                          UGX {(selectedUser.revenue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.role === 'employee' && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Employment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-graytext mb-1 block">Organizer</label>
                        <p className="font-medium">{selectedUser.organizer}</p>
                      </div>
                      <div>
                        <label className="text-sm text-graytext mb-1 block">Position</label>
                        <p className="font-medium">{selectedUser.position}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.role === 'customer' && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Purchase History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-graytext mb-1">Tickets Bought</p>
                        <p className="font-bold text-xl">{selectedUser.ticketsBought}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-graytext mb-1">Total Spent</p>
                        <p className="font-bold text-xl text-gold">
                          UGX {(selectedUser.totalSpent / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {selectedUser.status === 'active' ? (
                    <button
                      onClick={() => {
                        handleSuspendUser(selectedUser.id)
                        setShowUserModal(false)
                      }}
                      className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Suspend User
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleActivateUser(selectedUser.id)
                        setShowUserModal(false)
                      }}
                      className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Activate User
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleSendMessage(selectedUser.id)
                      setShowUserModal(false)
                    }}
                    className="flex-1 bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageUsers
