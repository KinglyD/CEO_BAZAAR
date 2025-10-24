import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EnvelopeIcon, LockClosedIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'organizer' // organizer, employee, or customer
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // const response = await axios.post('/api/auth/register', formData)
      
      // Simulate API call
      setTimeout(() => {
        // Store user data in localStorage (in production, use proper auth token)
        const userData = {
          id: Date.now(),
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.accountType,
          token: 'mock-jwt-token-' + Date.now()
        }
        
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', userData.token)

        // Redirect based on account type
        if (formData.accountType === 'organizer') {
          navigate('/organizer/dashboard')
        } else if (formData.accountType === 'employee') {
          navigate('/employee/invites') // Employees go to invites page first
        } else {
          navigate('/') // Regular customers go back to home
        }
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"
        >
          <div className="text-center mb-8">
            <h1 className="font-clash font-bold text-3xl mb-2">Create Account</h1>
            <p className="text-graytext">Join CEO Bazaar and start selling</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-md">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  placeholder="+256 700 000 000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account Type</label>
              <select
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
              >
                <option value="organizer" className="bg-matte">Event Organizer / Seller</option>
                <option value="employee" className="bg-matte">Employee / Ticket Scanner</option>
                <option value="customer" className="bg-matte">Customer</option>
              </select>
              <p className="text-xs text-graytext mt-2">
                {formData.accountType === 'organizer' && 'Create and sell event tickets & merchandise'}
                {formData.accountType === 'employee' && 'Scan tickets and manage entry'}
                {formData.accountType === 'customer' && 'Purchase tickets and merchandise'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-graytext text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-gold hover:text-gold/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register