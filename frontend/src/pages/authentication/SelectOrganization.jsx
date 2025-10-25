import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BuildingOfficeIcon, 
  CalendarIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

const SelectOrganization = () => {
  const navigate = useNavigate()
  
  // Mock data - will be replaced with API call
  const [organizations] = useState([
    {
      id: 1,
      name: 'CEO Bazaar Events',
      role: 'admin',
      logo: null,
      activeEvents: 12,
      description: 'Premium event management company'
    },
    {
      id: 2,
      name: 'Downtown Concerts Inc',
      role: 'employee',
      permissions: ['marketing', 'sales_view'],
      logo: null,
      activeEvents: 8,
      description: 'Live music and entertainment'
    },
    {
      id: 3,
      name: 'Sports Arena LLC',
      role: 'admin',
      logo: null,
      activeEvents: 5,
      description: 'Sports and recreation events'
    }
  ])

  const handleSelectOrganization = (org) => {
    // Store selected organization in localStorage/context
    localStorage.setItem('selectedOrganization', JSON.stringify(org))
    
    // Redirect based on role
    if (org.role === 'admin') {
      navigate('/admin/dashboard')
    } else {
      navigate('/employee/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-matte pt-20 px-4">
      <div className="max-w-6xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-clash font-bold text-4xl md:text-5xl text-white mb-4">
            Which organization are you working on today?
          </h1>
          <p className="text-graytext text-lg">
            Select an organization to access your dashboard
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org, index) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectOrganization(org)}
              className="bg-white/5 border border-white/10 rounded-lg p-6 cursor-pointer hover:border-gold/50 hover:bg-white/10 transition-all group"
            >
              {/* Logo or Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-gold/10 rounded-lg mb-4 group-hover:bg-gold/20 transition-colors">
                {org.logo ? (
                  <img src={org.logo} alt={org.name} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <BuildingOfficeIcon className="h-8 w-8 text-gold" />
                )}
              </div>

              {/* Organization Info */}
              <h3 className="font-clash font-bold text-xl text-white mb-2">
                {org.name}
              </h3>
              
              <p className="text-graytext text-sm mb-4">
                {org.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-2 text-sm text-graytext mb-4">
                <CalendarIcon className="h-4 w-4 text-gold" />
                <span>{org.activeEvents} active events</span>
              </div>

              {/* Role Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  org.role === 'admin' 
                    ? 'bg-gold/20 text-gold' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {org.role === 'admin' ? 'Administrator' : 'Team Member'}
                </span>
                
                <ArrowRightIcon className="h-5 w-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {organizations.length === 0 && (
          <div className="text-center py-20">
            <BuildingOfficeIcon className="h-16 w-16 text-graytext mx-auto mb-4" />
            <h3 className="font-clash font-bold text-2xl text-white mb-2">
              No Organizations Found
            </h3>
            <p className="text-graytext mb-6">
              You haven't been added to any organizations yet.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SelectOrganization
