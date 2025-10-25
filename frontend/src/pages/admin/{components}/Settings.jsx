import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Cog6ToothIcon,
  CreditCardIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'CEO Bazaar',
    platformEmail: 'support@ceobazaar.com',
    platformPhone: '0700000000',
    currency: 'UGX',
    timezone: 'Africa/Kampala',
    maintenanceMode: false,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    platformFeePercent: 6.5,
    mobileMoney: {
      enabled: true,
      provider: 'MTN/Airtel',
      apiKey: '••••••••••••',
    },
    bankTransfer: {
      enabled: true,
      accountName: 'CEO Bazaar Ltd',
      accountNumber: '••••••••',
      bankName: 'Stanbic Bank',
    },
    paymentGateway: {
      enabled: false,
      provider: 'Flutterwave',
      publicKey: '••••••••••••',
      secretKey: '••••••••••••',
    },
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.ceobazaar.com',
    smtpPort: '587',
    smtpUser: 'noreply@ceobazaar.com',
    smtpPassword: '••••••••',
    smsProvider: 'Africa\'s Talking',
    smsApiKey: '••••••••••••',
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginAttempts: '5',
  })

  const [aiSettings, setAISettings] = useState({
    enabled: true,
    provider: 'OpenAI',
    apiKey: '••••••••••••',
    model: 'gpt-4',
    maxTokens: '2000',
  })

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'payment', name: 'Payment', icon: CreditCardIcon },
    { id: 'email', name: 'Email & SMS', icon: EnvelopeIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'ai', name: 'AI Configuration', icon: SparklesIcon },
  ]

  const handleSaveSettings = () => {
    setIsLoading(true)
    setTimeout(() => {
      toast.success('Settings saved successfully')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-clash font-bold text-4xl mb-2">Platform Settings</h1>
        <p className="text-graytext">Configure platform-wide settings and integrations</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gold text-black'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.name}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6"
      >
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Platform Name</label>
                <input
                  type="text"
                  value={generalSettings.platformName}
                  onChange={(e) => setGeneralSettings({...generalSettings, platformName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Support Email</label>
                <input
                  type="email"
                  value={generalSettings.platformEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, platformEmail: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Support Phone</label>
                <input
                  type="tel"
                  value={generalSettings.platformPhone}
                  onChange={(e) => setGeneralSettings({...generalSettings, platformPhone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  value={generalSettings.currency}
                  onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="UGX">UGX - Ugandan Shilling</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="TZS">TZS - Tanzanian Shilling</option>
                  <option value="RWF">RWF - Rwandan Franc</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="Africa/Kampala">Africa/Kampala (EAT)</option>
                  <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                  <option value="Africa/Kigali">Africa/Kigali (CAT)</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={generalSettings.maintenanceMode}
                    onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold focus:ring-gold focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium">Maintenance Mode</span>
                </label>
                <p className="text-xs text-graytext mt-1 ml-8">
                  Enable to show maintenance page to all users
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Platform Fee (%)</label>
              <input
                type="number"
                step="0.1"
                value={paymentSettings.platformFeePercent}
                onChange={(e) => setPaymentSettings({...paymentSettings, platformFeePercent: parseFloat(e.target.value)})}
                className="w-full md:w-1/3 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <p className="text-xs text-graytext mt-1">
                Fee charged on each ticket sale
              </p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Mobile Money</h3>
                  <p className="text-sm text-graytext">MTN & Airtel Money integration</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.mobileMoney.enabled}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      mobileMoney: {...paymentSettings.mobileMoney, enabled: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Provider</label>
                  <input
                    type="text"
                    value={paymentSettings.mobileMoney.provider}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      mobileMoney: {...paymentSettings.mobileMoney, provider: e.target.value}
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="password"
                    value={paymentSettings.mobileMoney.apiKey}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      mobileMoney: {...paymentSettings.mobileMoney, apiKey: e.target.value}
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Bank Transfer</h3>
                  <p className="text-sm text-graytext">Direct bank account deposits</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.bankTransfer.enabled}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      bankTransfer: {...paymentSettings.bankTransfer, enabled: e.target.checked}
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Account Name</label>
                  <input
                    type="text"
                    value={paymentSettings.bankTransfer.accountName}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      bankTransfer: {...paymentSettings.bankTransfer, accountName: e.target.value}
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Number</label>
                  <input
                    type="text"
                    value={paymentSettings.bankTransfer.accountNumber}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      bankTransfer: {...paymentSettings.bankTransfer, accountNumber: e.target.value}
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={paymentSettings.bankTransfer.bankName}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      bankTransfer: {...paymentSettings.bankTransfer, bankName: e.target.value}
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email & SMS Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">SMTP Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Port</label>
                  <input
                    type="text"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP User</label>
                  <input
                    type="email"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SMTP Password</label>
                  <input
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="font-semibold text-lg mb-4">SMS Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SMS Provider</label>
                  <select
                    value={emailSettings.smsProvider}
                    onChange={(e) => setEmailSettings({...emailSettings, smsProvider: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="Africa's Talking">Africa's Talking</option>
                    <option value="Twilio">Twilio</option>
                    <option value="Nexmo">Nexmo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="password"
                    value={emailSettings.smsApiKey}
                    onChange={(e) => setEmailSettings({...emailSettings, smsApiKey: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold focus:ring-gold focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium">Require Two-Factor Authentication</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password Expiry (days)</label>
                <input
                  type="number"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* AI Settings */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">AI Marketing Suite</h3>
                <p className="text-sm text-graytext">Enable AI-powered marketing features</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiSettings.enabled}
                  onChange={(e) => setAISettings({...aiSettings, enabled: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">AI Provider</label>
                <select
                  value={aiSettings.provider}
                  onChange={(e) => setAISettings({...aiSettings, provider: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  disabled={!aiSettings.enabled}
                >
                  <option value="OpenAI">OpenAI</option>
                  <option value="Anthropic">Anthropic</option>
                  <option value="Google">Google AI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <select
                  value={aiSettings.model}
                  onChange={(e) => setAISettings({...aiSettings, model: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  disabled={!aiSettings.enabled}
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-3">Claude 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  value={aiSettings.apiKey}
                  onChange={(e) => setAISettings({...aiSettings, apiKey: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  disabled={!aiSettings.enabled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Tokens</label>
                <input
                  type="number"
                  value={aiSettings.maxTokens}
                  onChange={(e) => setAISettings({...aiSettings, maxTokens: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold"
                  disabled={!aiSettings.enabled}
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-white/10 mt-6">
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-gold hover:bg-gold/90 text-black px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings
