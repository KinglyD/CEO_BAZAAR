import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircleIcon, CalendarIcon, MapPinIcon, TicketIcon } from '@heroicons/react/24/outline'
import { QRCodeSVG } from 'qrcode.react'

const TicketConfirmation = () => {
  const location = useLocation()
  const { ticket, event, buyer } = location.state || {}

  if (!ticket || !event || !buyer) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <p className="text-graytext">Invalid ticket information</p>
      </div>
    )
  }

  const ticketId = `TKT-${Date.now()}`

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <CheckCircleIcon className="h-20 w-20 text-gold mx-auto mb-4" />
          <h1 className="font-clash font-bold text-4xl mb-2">Payment Successful!</h1>
          <p className="text-graytext text-lg">Your ticket has been sent to your email and phone</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
        >
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-gold/20 to-transparent p-8 border-b border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-clash text-3xl font-bold mb-2">{event.title}</h2>
                <div className="space-y-2 text-graytext">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              <TicketIcon className="h-12 w-12 text-gold" />
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-graytext mb-1">Ticket Holder</p>
                  <p className="font-semibold text-lg">{buyer.fullName}</p>
                </div>

                <div>
                  <p className="text-sm text-graytext mb-1">Ticket Type</p>
                  <p className="font-semibold text-lg">{ticket.name}</p>
                </div>

                <div>
                  <p className="text-sm text-graytext mb-1">Ticket ID</p>
                  <p className="font-mono text-gold">{ticketId}</p>
                </div>

                <div>
                  <p className="text-sm text-graytext mb-1">Amount Paid</p>
                  <p className="font-semibold text-2xl text-gold">UGX {ticket.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG
                    value={ticketId}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Footer */}
          <div className="bg-white/5 p-6 border-t border-white/10">
            <p className="text-sm text-graytext text-center">
              Present this QR code at the event entrance for validation
            </p>
          </div>
        </motion.div>

        <div className="mt-8 flex gap-4 justify-center">
          <button className="px-6 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors">
            Download Ticket
          </button>
          <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-black transition-colors">
            Share Event
          </button>
        </div>
      </div>
    </div>
  )
}

export default TicketConfirmation