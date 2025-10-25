import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CalendarIcon, 
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const EventInvitations = () => {
  const [invitations, setInvitations] = useState([
    {
      id: 1,
      eventName: 'Tech Summit 2025',
      primaryOrganizer: 'CEO Bazaar Events',
      date: 'Nov 15, 2025',
      venue: 'Kampala Serena Hotel',
      location: 'Kampala, Uganda',
      yourShare: 40,
      platformFee: 6,
      estimatedRevenue: 5000000,
      yourEarnings: 1880000, // (5000000 * 0.94) * 0.40
      status: 'pending',
      coOrganizers: [
        { name: 'CEO Bazaar Events', share: 60 },
        { name: 'Your Organization', share: 40 }
      ],
      sentDate: '2025-10-20',
      expiresIn: 5
    },
    {
      id: 2,
      eventName: 'Music Festival 2025',
      primaryOrganizer: 'Downtown Concerts Inc',
      date: 'Dec 1, 2025',
      venue: 'Kololo Airstrip',
      location: 'Kampala, Uganda',
      yourShare: 33,
      platformFee: 8,
      estimatedRevenue: 12000000,
      yourEarnings: 3643200, // (12000000 * 0.92) * 0.33
      status: 'pending',
      coOrganizers: [
        { name: 'Downtown Concerts Inc', share: 34 },
        { name: 'Your Organization', share: 33 },
        { name: 'Sports Arena LLC', share: 33 }
      ],
      sentDate: '2025-10-22',
      expiresIn: 7
    },
    {
      id: 3,
      eventName: 'Art Exhibition',
      primaryOrganizer: 'Art Gallery UG',
      date: 'Nov 20, 2025',
      venue: 'National Theatre',
      location: 'Kampala, Uganda',
      yourShare: 50,
      platformFee: 6,
      estimatedRevenue: 3000000,
      yourEarnings: 1410000,
      status: 'accepted',
      coOrganizers: [
        { name: 'Art Gallery UG', share: 50 },
        { name: 'Your Organization', share: 50 }
      ],
      sentDate: '2025-10-18',
      acceptedDate: '2025-10-19'
    }
  ])

  const [selectedInvitation, setSelectedInvitation] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleAccept = (invitationId) => {
    setInvitations(invitations.map(inv => 
      inv.id === invitationId ? { ...inv, status: 'accepted', acceptedDate: new Date().toISOString().split('T')[0] } : inv
    ))
    setShowDetailModal(false)
  }

  const handleDecline = (invitationId) => {
    setInvitations(invitations.map(inv => 
      inv.id === invitationId ? { ...inv, status: 'declined' } : inv
    ))
    setShowDetailModal(false)
  }

  const viewDetails = (invitation) => {
    setSelectedInvitation(invitation)
    setShowDetailModal(true)
  }

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending')
  const acceptedInvitations = invitations.filter(inv => inv.status === 'accepted')
  const declinedInvitations = invitations.filter(inv => inv.status === 'declined')

  const InvitationCard = ({ invitation }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 border rounded-lg p-6 ${
        invitation.status === 'pending' 
          ? 'border-gold/50' 
          : invitation.status === 'accepted'
          ? 'border-green-500/50'
          : 'border-red-500/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-clash font-bold text-xl mb-1">{invitation.eventName}</h3>
          <p className="text-sm text-graytext">by {invitation.primaryOrganizer}</p>
        </div>
        {invitation.status === 'pending' && (
          <div className="px-3 py-1 bg-gold/20 text-gold text-xs font-semibold rounded-full">
            {invitation.expiresIn} days left
          </div>
        )}
        {invitation.status === 'accepted' && (
          <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1">
            <CheckCircleIcon className="h-4 w-4" />
            Accepted
          </div>
        )}
        {invitation.status === 'declined' && (
          <div className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full flex items-center gap-1">
            <XCircleIcon className="h-4 w-4" />
            Declined
          </div>
        )}
      </div>

      {/* Event Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-graytext">
          <CalendarIcon className="h-4 w-4 text-gold" />
          <span>{invitation.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-graytext">
          <MapPinIcon className="h-4 w-4 text-gold" />
          <span>{invitation.venue}</span>
        </div>
      </div>

      {/* Revenue Info */}
      <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-graytext">Your Revenue Share</span>
          <span className="font-bold text-2xl text-gold">{invitation.yourShare}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-graytext">Estimated Earnings</span>
          <span className="font-semibold text-white">
            UGX {invitation.yourEarnings.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Co-Organizers */}
      <div className="mb-4">
        <p className="text-xs text-graytext mb-2">Revenue Split:</p>
        <div className="flex items-center gap-1 mb-2">
          {invitation.coOrganizers.map((org, idx) => (
            <div
              key={idx}
              className="h-2 bg-gold rounded-full transition-all"
              style={{ width: `${org.share}%` }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {invitation.coOrganizers.map((org, idx) => (
            <span key={idx} className="text-xs text-graytext">
              {org.name}: {org.share}%
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => viewDetails(invitation)}
          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-md hover:bg-white/20 transition-colors text-sm font-medium"
        >
          View Details
        </button>
        {invitation.status === 'pending' && (
          <>
            <button
              onClick={() => handleAccept(invitation.id)}
              className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-md hover:bg-green-500/30 transition-colors text-sm font-medium"
            >
              Accept
            </button>
            <button
              onClick={() => handleDecline(invitation.id)}
              className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-md hover:bg-red-500/30 transition-colors text-sm font-medium"
            >
              Decline
            </button>
          </>
        )}
      </div>
    </motion.div>
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-clash font-bold text-3xl mb-2">Event Invitations</h1>
        <p className="text-graytext">Review collaboration requests from other organizations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-graytext text-sm mb-1">Pending</p>
          <p className="font-clash font-bold text-3xl text-gold">{pendingInvitations.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-graytext text-sm mb-1">Accepted</p>
          <p className="font-clash font-bold text-3xl text-green-400">{acceptedInvitations.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-graytext text-sm mb-1">Declined</p>
          <p className="font-clash font-bold text-3xl text-red-400">{declinedInvitations.length}</p>
        </div>
      </div>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <div className="mb-8">
          <h2 className="font-clash font-bold text-2xl mb-4">Pending Invitations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingInvitations.map(invitation => (
              <InvitationCard key={invitation.id} invitation={invitation} />
            ))}
          </div>
        </div>
      )}

      {/* Accepted Invitations */}
      {acceptedInvitations.length > 0 && (
        <div className="mb-8">
          <h2 className="font-clash font-bold text-2xl mb-4">Accepted</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {acceptedInvitations.map(invitation => (
              <InvitationCard key={invitation.id} invitation={invitation} />
            ))}
          </div>
        </div>
      )}

      {/* Declined Invitations */}
      {declinedInvitations.length > 0 && (
        <div>
          <h2 className="font-clash font-bold text-2xl mb-4">Declined</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {declinedInvitations.map(invitation => (
              <InvitationCard key={invitation.id} invitation={invitation} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {invitations.length === 0 && (
        <div className="text-center py-20">
          <UserGroupIcon className="h-16 w-16 text-graytext mx-auto mb-4" />
          <h3 className="font-clash font-bold text-2xl text-white mb-2">
            No Invitations Yet
          </h3>
          <p className="text-graytext">
            You'll see collaboration requests from other organizations here
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedInvitation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-matte border border-white/10 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-clash font-bold text-2xl mb-6">{selectedInvitation.eventName}</h2>
            
            <div className="space-y-6">
              {/* Event Details */}
              <div>
                <h3 className="font-semibold mb-3">Event Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-graytext">Organized by</span>
                    <span>{selectedInvitation.primaryOrganizer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-graytext">Date</span>
                    <span>{selectedInvitation.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-graytext">Venue</span>
                    <span>{selectedInvitation.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-graytext">Location</span>
                    <span>{selectedInvitation.location}</span>
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Revenue Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-graytext">Estimated Total Revenue</span>
                    <span className="font-semibold">UGX {selectedInvitation.estimatedRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-400">
                    <span>Platform Fee ({selectedInvitation.platformFee}%)</span>
                    <span>- UGX {(selectedInvitation.estimatedRevenue * selectedInvitation.platformFee / 100).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between font-semibold mb-2">
                      <span>Organizer Share ({100 - selectedInvitation.platformFee}%)</span>
                      <span className="text-gold">UGX {(selectedInvitation.estimatedRevenue * (100 - selectedInvitation.platformFee) / 100).toLocaleString()}</span>
                    </div>
                    <div className="pl-4 space-y-1 border-l-2 border-gold/50">
                      {selectedInvitation.coOrganizers.map((org, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-graytext">{org.name} ({org.share}%)</span>
                          <span className={org.name === 'Your Organization' ? 'text-gold font-semibold' : ''}>
                            UGX {((selectedInvitation.estimatedRevenue * (100 - selectedInvitation.platformFee) / 100) * org.share / 100).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-gold">Important Terms</h3>
                <ul className="text-sm text-graytext space-y-1 list-disc list-inside">
                  <li>Revenue split is final once all parties accept</li>
                  <li>Payouts occur within 7 days after event ends</li>
                  <li>All parties share event promotion responsibilities</li>
                  <li>Refund policies apply proportionally to all organizers</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              {selectedInvitation.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleDecline(selectedInvitation.id)}
                    className="flex-1 px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-md hover:bg-red-500/30 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(selectedInvitation.id)}
                    className="flex-1 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-md hover:bg-green-500/30 transition-colors"
                  >
                    Accept Invitation
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default EventInvitations
