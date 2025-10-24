import { Link } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 bg-matte/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="font-clash font-bold text-2xl text-gold hover:text-gold/90 transition-colors">
            CEO BAZAAR
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/#events" className="text-graytext hover:text-white transition-colors">
              Events
            </Link>
            <Link to="/#merchandise" className="text-graytext hover:text-white transition-colors">
              Merchandise
            </Link>
            <Link to="/register" className="text-graytext hover:text-white transition-colors">
              Sell with Us
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-white hover:text-gold transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium bg-gold text-black rounded-md hover:bg-gold/90 transition-colors">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in">
            <Link
              to="/#events"
              className="block px-4 py-2 text-graytext hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/#merchandise"
              className="block px-4 py-2 text-graytext hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Merchandise
            </Link>
            <Link
              to="/register"
              className="block px-4 py-2 text-graytext hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sell with Us
            </Link>
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                className="block px-4 py-2 text-center text-white hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-center bg-gold text-black rounded-md hover:bg-gold/90 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar