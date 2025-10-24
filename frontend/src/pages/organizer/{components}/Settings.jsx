import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserIcon, EnvelopeIcon, PhoneIcon, BanknotesIcon } from '@heroicons/react/24/outline'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '0772345678',
    businessName: 'Tech Events UG',
    momoNumber: '0772345678',
    bankName: 'Stanbic Bank',
    accountNumber: '1234567890',
    accountName: 'John Doe'
  })

  const handleSave = (e) => {
    e.preventDefault()
    // API call to save settings
    alert('Settings saved successfully!')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Settings</h1>
        <p className="text-graytext">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-gold text-black font-semibold'
                    : 'text-graytext hover:text-white hover:bg-white/5'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'business'
                    ? 'bg-gold text-black font-semibold'
                    : 'text-graytext hover:text-white hover:bg-white/5'
                }`}
              >
                Business Info
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'payment'
                    ? 'bg-gold text-black font-semibold'
                    : 'text-graytext hover:text-white hover:bg-white/5'
                }`}
              >
                Payment Methods
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'security'
                    ? 'bg-gold text-black font-semibold'
                    : 'text-graytext hover:text-white hover:bg-white/5'
                }`}
              >
                Security
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-6">
                <h2 className="font-clash text-2xl font-bold mb-6">Profile Information</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
                >
                  Save Changes
                </button>
              </form>
            )}

            {/* Business Tab */}
            {activeTab === 'business' && (
              <form onSubmit={handleSave} className="space-y-6">
                <h2 className="font-clash text-2xl font-bold mb-6">Business Information</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Business Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                    placeholder="Tell us about your business..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
                >
                  Save Changes
                </button>
              </form>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <form onSubmit={handleSave} className="space-y-6">
                <h2 className="font-clash text-2xl font-bold mb-6">Payment Methods</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Mobile Money</h3>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-3.5 h-5 w-5 text-graytext" />
                      <input
                        type="tel"
                        value={formData.momoNumber}
                        onChange={(e) => setFormData({ ...formData, momoNumber: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                        placeholder="07XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="font-semibold mb-4">Bank Account</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                        placeholder="Bank Name"
                      />
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                        placeholder="Account Number"
                      />
                      <input
                        type="text"
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                        placeholder="Account Name"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
                >
                  Save Changes
                </button>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <form onSubmit={handleSave} className="space-y-6">
                <h2 className="font-clash text-2xl font-bold mb-6">Security Settings</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold text-black font-semibold rounded-md hover:bg-gold/90 transition-colors"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings