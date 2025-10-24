import { useState } from 'react'
import { motion } from 'framer-motion'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState({
    siteName: 'CEO Bazaar',
    siteEmail: 'admin@ceobazaar.com',
    commission: '10',
    currency: 'UGX',
    minPayout: '100000',
    enableRegistration: true,
    requireApproval: true,
    enableNotifications: true
  })

  const handleSave = (e) => {
    e.preventDefault()
    alert('Settings saved successfully!')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Platform Settings</h1>
        <p className="text-graytext">Manage platform configuration</p>
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
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'general'
                    ? 'bg-gold text-black font-semibold'
                    : 'text-graytext hover:text-white hover:bg-white/5'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'payment'
                    ? 'bg-gold text-black font-semibold'
                    : 'text-graytext hover:text-white hover:bg-white/5'
                }`}
              >
                Payment
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-gold text-black font-semibold'
                    : 'text-graytext hover:text-white hover:bg-white/5'
                }`}
              >
                Notifications
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
            {/* General Tab */}
            {activeTab === 'general' && (
              <form onSubmit={handleSave} className="space-y-6">
                <h2 className="font-clash text-2xl font-bold mb-6">General Settings</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Site Name</label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Admin Email</label>
                  <input
                    type="email"
                    value={formData.siteEmail}
                    onChange={(e) => setFormData({ ...formData, siteEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  >
                    <option value="UGX">UGX - Ugandan Shilling</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.enableRegistration}
                      onChange={(e) => setFormData({ ...formData, enableRegistration: e.target.checked })}
                      className="rounded"
                    />
                    <div>
                      <p className="font-medium">Enable User Registration</p>
                      <p className="text-sm text-graytext">Allow new users to register on the platform</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.requireApproval}
                      onChange={(e) => setFormData({ ...formData, requireApproval: e.target.checked })}
                      className="rounded"
                    />
                    <div>
                      <p className="font-medium">Require Event Approval</p>
                      <p className="text-sm text-graytext">Events must be approved before going live</p>
                    </div>
                  </label>
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
                <h2 className="font-clash text-2xl font-bold mb-6">Payment Settings</h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Platform Commission (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.commission}
                    onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  />
                  <p className="text-sm text-graytext mt-2">
                    Platform commission on each transaction
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Payout Amount (UGX)</label>
                  <input
                    type="number"
                    value={formData.minPayout}
                    onChange={(e) => setFormData({ ...formData, minPayout: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                  />
                  <p className="text-sm text-graytext mt-2">
                    Minimum amount required for organizer payouts
                  </p>
                </div>

                <div className="p-4 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                  <h3 className="font-semibold text-blue-400 mb-2">Payment Gateway Integration</h3>
                  <p className="text-sm text-graytext mb-4">
                    Configure your payment gateway credentials
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">MTN Mobile Money API Key</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Airtel Money API Key</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:border-gold transition-colors"
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

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleSave} className="space-y-6">
                <h2 className="font-clash text-2xl font-bold mb-6">Notification Settings</h2>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.enableNotifications}
                      onChange={(e) => setFormData({ ...formData, enableNotifications: e.target.checked })}
                      className="rounded"
                    />
                    <div>
                      <p className="font-medium">Enable Email Notifications</p>
                      <p className="text-sm text-graytext">Send email notifications to users</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded"
                    />
                    <div>
                      <p className="font-medium">New User Registration</p>
                      <p className="text-sm text-graytext">Notify admin when new users register</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded"
                    />
                    <div>
                      <p className="font-medium">New Event Created</p>
                      <p className="text-sm text-graytext">Notify admin when events are created</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded"
                    />
                    <div>
                      <p className="font-medium">Transaction Alerts</p>
                      <p className="text-sm text-graytext">Notify admin of high-value transactions</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded"
                    />
                    <div>
                      <p className="font-medium">Payout Requests</p>
                      <p className="text-sm text-graytext">Notify admin of payout requests</p>
                    </div>
                  </label>
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

                <div className="border-t border-white/10 pt-6">
                  <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-graytext mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <button
                    type="button"
                    className="px-6 py-2 border-2 border-gold text-gold font-semibold rounded-md hover:bg-gold hover:text-black transition-colors"
                  >
                    Enable 2FA
                  </button>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="font-semibold text-red-400 mb-4">Danger Zone</h3>
                  <p className="text-sm text-graytext mb-4">
                    These actions are irreversible. Please be certain.
                  </p>
                  <button
                    type="button"
                    className="px-6 py-2 bg-red-500/20 border-2 border-red-500 text-red-400 font-semibold rounded-md hover:bg-red-500/30 transition-colors"
                  >
                    Clear All Data
                  </button>
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