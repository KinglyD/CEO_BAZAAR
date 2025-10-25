import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Invites = () => {
  const navigate = useNavigate()
  const [invites, setInvites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingInvite, setProcessingInvite] = useState(null)

  useEffect(() => {
    fetchInvites()
  }, [])

  const fetchInvites = async () => {
    // TODO: Replace with actual API call
    // const response = await axios.get('/api/employee/invites')
    
    // Simulate API call - fetch invites for this employee
    setTimeout(() => {
      const mockInvites = [
        {
          id: 1,
          organizerName: 'Tech Events Uganda',
          organizerEmail: 'organizer@techevents.ug',
          eventCount: 5,
          role: 'Ticket Scanner',
          invitedAt: '2025-10-20',
          status: 'pending',
          message: 'We would love to have you join our team for upcoming tech events!'
        },
        {
          id: 2,
          organizerName: 'Music Fest Promoters',
          organizerEmail: 'team@musicfest.com',
          eventCount: 3,
          role: 'Entry Manager',
          invitedAt: '2025-10-18',
          status: 'pending',
          message: 'Join us to manage entry for our exciting music festivals.'
        }
      ]
      setInvites(mockInvites)
      setIsLoading(false)
    }, 1000)
  }

  const handleAccept = async (inviteId) => {
    setProcessingInvite(inviteId)
    try {
      // TODO: Replace with actual API call
      // await axios.post(`/api/employee/invites/${inviteId}/accept`)
      
      const invite = invites.find(inv => inv.id === inviteId)
      
      // Simulate API call
      setTimeout(() => {
        // Update invite status locally
        setInvites(invites.map(inv => 
          inv.id === inviteId ? { ...inv, status: 'accepted' } : inv
        ))
        
        setProcessingInvite(null)
        toast.success(`Welcome to ${invite.organizerName}'s team! 🎉`)
        
        // Redirect to dashboard after accepting
        setTimeout(() => navigate('/employee/dashboard'), 2000)
      }, 1000)
    } catch (error) {
      console.error('Failed to accept invite:', error)
      setProcessingInvite(null)
      toast.error('Failed to accept invite. Please try again.')
    }
  }

  const handleDecline = async (inviteId) => {
    setProcessingInvite(inviteId)
    try {
      // TODO: Replace with actual API call
      // await axios.post(`/api/employee/invites/${inviteId}/decline`)
      
      const invite = invites.find(inv => inv.id === inviteId)
      
      // Simulate API call
      setTimeout(() => {
        // Remove declined invite from list
        setInvites(invites.filter(inv => inv.id !== inviteId))
        setProcessingInvite(null)
        toast.success(`Declined invite from ${invite.organizerName}`)
      }, 500)
    } catch (error) {
      console.error('Failed to decline invite:', error)
      setProcessingInvite(null)
      toast.error('Failed to decline invite. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-graytext">Loading invites...</p>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-clash font-bold text-4xl mb-2">Team Invitations</h1>
          <p className="text-graytext">
            Review and respond to invitations from event organizers
          </p>
        </div>

        {invites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-12 border border-white/10 text-center"
          >
            <EnvelopeIcon className="h-16 w-16 text-graytext mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">No Pending Invitations</h3>
            <p className="text-graytext mb-6">
              You don't have any pending team invitations at the moment.
            </p>
            <button
              onClick={() => navigate('/employee/dashboard')}
              className="px-6 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {invites.map((invite, index) => (
              <motion.div
                key={invite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-clash font-bold text-2xl text-gold">
                        {invite.organizerName}
                      </h3>
                      {invite.status === 'accepted' && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                          Accepted
                        </span>
                      )}
                    </div>
                    
                    <p className="text-graytext text-sm mb-4">{invite.organizerEmail}</p>
                    
                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-graytext">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{invite.eventCount} Active Events</span>
                      </div>
                      <div className="flex items-center gap-2 text-graytext">
                        <UserGroupIcon className="h-4 w-4" />
                        <span>Role: {invite.role}</span>
                      </div>
                    </div>

                    {invite.message && (
                      <div className="bg-white/5 rounded-md p-4 mb-4">
                        <p className="text-sm text-graytext italic">"{invite.message}"</p>
                      </div>
                    )}

                    <p className="text-xs text-graytext">
                      Invited on {new Date(invite.invitedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>

                  {invite.status === 'pending' && (
                    <div className="flex gap-3 ml-4">
                      <button
                        onClick={() => handleAccept(invite.id)}
                        disabled={processingInvite === invite.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-md hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                        {processingInvite === invite.id ? 'Accepting...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleDecline(invite.id)}
                        disabled={processingInvite === invite.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-md hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircleIcon className="h-5 w-5" />
                        {processingInvite === invite.id ? 'Declining...' : 'Decline'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Invites
