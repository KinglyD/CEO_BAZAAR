import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  QrCodeIcon, 
  HashtagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

// Utility function to mask customer information
const maskCustomerInfo = (info) => {
  if (!info) return 'N/A'
  
  // Check if it's an email
  if (info.includes('@')) {
    const [username, domain] = info.split('@')
    if (username.length <= 3) {
      return `${username[0]}***@${domain}`
    }
    return `${username.slice(0, 3)}***@${domain}`
  }
  
  // Check if it's a phone number
  if (info.match(/^\+?[\d\s-]+$/)) {
    const cleaned = info.replace(/\D/g, '')
    if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 2)}***${cleaned.slice(-2)}`
    }
    return `${cleaned.slice(0, 3)}*****${cleaned.slice(-3)}`
  }
  
  // Default masking for other formats
  if (info.length <= 6) {
    return `${info.slice(0, 2)}***`
  }
  return `${info.slice(0, 3)}*****${info.slice(-2)}`
}

const TicketScanner = ({ eventId, onTicketScanned }) => {
  const [scanMode, setScanMode] = useState('qr') // 'qr' or 'manual'
  const [ticketCode, setTicketCode] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const validateTicket = async (code) => {
    setIsScanning(true)
    setScanResult(null)
    setShowResult(false)

    try {
      // TODO: Replace with actual API call
      // const response = await axios.post(`/api/employee/events/${eventId}/validate-ticket`, { code })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation
      const isValid = Math.random() > 0.2 // 80% success rate for demo
      
      const result = {
        valid: isValid,
        ticketCode: code,
        customerInfo: isValid ? maskCustomerInfo(
          Math.random() > 0.5 
            ? '+256700123456' 
            : 'john.doe@example.com'
        ) : null,
        ticketType: isValid ? ['Regular', 'VIP', 'VVIP'][Math.floor(Math.random() * 3)] : null,
        purchaseMethod: isValid ? ['Mobile Money (USSD)', 'Online Payment', 'Cash'][Math.floor(Math.random() * 3)] : null,
        purchaseDate: isValid ? new Date().toISOString() : null,
        alreadyUsed: isValid ? Math.random() > 0.9 : false, // 10% already used
        message: !isValid 
          ? 'Invalid ticket code. Please check and try again.' 
          : Math.random() > 0.9 
            ? 'This ticket has already been used for entry.'
            : 'Valid ticket. Entry granted.'
      }
      
      setScanResult(result)
      setShowResult(true)
      
      if (result.valid && !result.alreadyUsed && onTicketScanned) {
        onTicketScanned(result)
      }
      
      // Auto-hide result after 5 seconds
      setTimeout(() => {
        setShowResult(false)
        setTicketCode('')
      }, 5000)
      
    } catch (error) {
      setScanResult({
        valid: false,
        message: 'Error validating ticket. Please try again.'
      })
      setShowResult(true)
    } finally {
      setIsScanning(false)
    }
  }

  const handleQRScan = () => {
    // TODO: Integrate with actual QR scanner library (e.g., react-qr-reader)
    // For now, simulate scanning
    const mockCode = `TKT-${Date.now()}`
    validateTicket(mockCode)
  }

  const handleManualEntry = (e) => {
    e.preventDefault()
    if (ticketCode.trim()) {
      validateTicket(ticketCode.trim())
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-clash font-bold text-2xl">Ticket Validation</h3>
        
        {/* Mode Toggle */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setScanMode('qr')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              scanMode === 'qr'
                ? 'bg-gold text-black'
                : 'text-graytext hover:text-white'
            }`}
          >
            <QrCodeIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Scan QR</span>
          </button>
          <button
            onClick={() => setScanMode('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              scanMode === 'manual'
                ? 'bg-gold text-black'
                : 'text-graytext hover:text-white'
            }`}
          >
            <HashtagIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Enter Code</span>
          </button>
        </div>
      </div>

      {/* Scanning Interface */}
      <div className="space-y-6">
        {scanMode === 'qr' ? (
          <div className="text-center">
            {/* QR Scanner Placeholder */}
            <div className="relative mx-auto w-full max-w-md aspect-square bg-black/30 rounded-lg border-2 border-dashed border-gold/50 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 border-2 border-gold rounded-lg"></div>
              </div>
              <div className="z-10 text-center">
                <QrCodeIcon className="h-16 w-16 text-gold mx-auto mb-4" />
                <p className="text-graytext">Position QR code within frame</p>
              </div>
            </div>
            
            <button
              onClick={handleQRScan}
              disabled={isScanning}
              className="mt-6 px-8 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? 'Scanning...' : 'Simulate QR Scan'}
            </button>
            
            <p className="mt-4 text-sm text-graytext">
              Camera integration will be added in production
            </p>
          </div>
        ) : (
          <form onSubmit={handleManualEntry} className="max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Enter Ticket Code
              </label>
              <input
                type="text"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                placeholder="TKT-XXXXXXXXXX or 6-digit code"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors text-center text-lg font-mono"
                disabled={isScanning}
              />
              <p className="mt-2 text-xs text-graytext text-center">
                Enter the code shown on the customer's ticket
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isScanning || !ticketCode.trim()}
              className="w-full px-8 py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? 'Validating...' : 'Validate Ticket'}
            </button>
          </form>
        )}

        {/* Scan Result */}
        <AnimatePresence>
          {showResult && scanResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-6 rounded-lg border-2 ${
                scanResult.valid && !scanResult.alreadyUsed
                  ? 'bg-green-500/20 border-green-500'
                  : 'bg-red-500/20 border-red-500'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {scanResult.valid && !scanResult.alreadyUsed ? (
                    <CheckCircleIcon className="h-12 w-12 text-green-400" />
                  ) : (
                    <XCircleIcon className="h-12 w-12 text-red-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-bold text-xl mb-2 ${
                    scanResult.valid && !scanResult.alreadyUsed ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {scanResult.valid && !scanResult.alreadyUsed ? '✓ Entry Granted' : '✗ Access Denied'}
                  </h4>
                  
                  <p className="text-sm mb-4">{scanResult.message}</p>
                  
                  {scanResult.valid && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-graytext">Ticket Code:</span>
                        <span className="font-mono">{scanResult.ticketCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-graytext">Customer:</span>
                        <span className="font-medium">{scanResult.customerInfo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-graytext">Ticket Type:</span>
                        <span className="font-medium text-gold">{scanResult.ticketType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-graytext">Purchase Method:</span>
                        <span>{scanResult.purchaseMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-graytext">Purchase Date:</span>
                        <span>{new Date(scanResult.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      
                      {scanResult.alreadyUsed && (
                        <div className="mt-4 p-3 bg-orange-500/20 border border-orange-500/50 rounded-md">
                          <p className="text-orange-400 text-sm font-medium">
                            ⚠️ Warning: This ticket was already used for entry
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300 mb-2 font-medium">💡 Ticket Validation Tips:</p>
          <ul className="text-xs text-blue-200 space-y-1 ml-4 list-disc">
            <li>Customer info is masked for privacy (subscription required for full access)</li>
            <li>USSD purchases show masked phone numbers (07*****345)</li>
            <li>Online purchases show masked emails (jon***@gmail.com)</li>
            <li>Each ticket can only be used once</li>
            <li>Report any suspicious activity to the organizer</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TicketScanner
export { maskCustomerInfo }
