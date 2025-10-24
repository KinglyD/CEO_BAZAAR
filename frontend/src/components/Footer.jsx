import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-matte border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-clash font-bold text-xl text-gold mb-4">CEO BAZAAR</h3>
            <p className="text-graytext text-sm">
              Where Vision Meets Impact. Your premier marketplace for events and merchandise.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/#events" className="text-graytext hover:text-white text-sm transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/#merchandise" className="text-graytext hover:text-white text-sm transition-colors">
                  Shop Merchandise
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-graytext hover:text-white text-sm transition-colors">
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-graytext hover:text-white text-sm transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-graytext hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-graytext hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-graytext hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-graytext hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refunds" className="text-graytext hover:text-white text-sm transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-graytext text-sm">
          <p>&copy; {new Date().getFullYear()} CEO Bazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer