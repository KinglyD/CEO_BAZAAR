import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // const response = await axios.post('/api/auth/login', formData)
      
      // Simulate API call
      setTimeout(() => {
        // Mock user data (in production, this comes from API)
        const userData = {
          id: Date.now(),
          email: formData.email,
          fullName: 'John Doe',
          token: 'mock-jwt-token-' + Date.now()
        }
        
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', userData.token)

        // Redirect to organization selection
        navigate('/select-organization')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"
        >
          <div className="text-center mb-8">
            <h1 className="font-clash font-bold text-3xl mb-2">Welcome Back</h1>
            <p className="text-graytext">Sign in to your CEO Bazaar account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-md">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-white/20"
                />
                <span className="text-sm text-graytext">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-gold hover:text-gold/80">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-graytext text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold hover:text-gold/80 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login