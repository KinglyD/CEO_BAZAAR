import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  PlusCircleIcon, 
  ChartBarIcon, 
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'
import Dashboard from './Dashboard'
import CreateEvent from './CreateEvent'
import Sales from './Sales'
import Payouts from './Payout'
import Settings from './Settings'
import EventDetails from './EventDetails'

const OrganizerLayout = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', path: '/organizer/dashboard', icon: HomeIcon },
    { name: 'Create Event', path: '/organizer/create', icon: PlusCircleIcon },
    { name: 'Sales', path: '/organizer/sales', icon: ChartBarIcon },
    { name: 'Payouts', path: '/organizer/payouts', icon: CreditCardIcon },
    { name: 'Settings', path: '/organizer/settings', icon: Cog6ToothIcon },
  ]

  return (
    <div className="pt-16 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/5 border-r border-white/10 min-h-screen fixed">
          <div className="p-6">
            <h2 className="font-clash font-bold text-xl text-gold mb-8">Organizer Portal</h2>
            
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-gold text-black'
                        : 'text-graytext hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-3 text-graytext hover:text-white transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create" element={<CreateEvent />} />
            <Route path="event/:id" element={<EventDetails />} />
            <Route path="sales" element={<Sales />} />
            <Route path="payouts" element={<Payouts />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default OrganizerLayout