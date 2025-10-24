import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  BanknotesIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'
import Dashboard from './Dashboard'
import ManageUsers from './ManageUsers'
import ManageEvents from './ManageEvents'
import Transactions from './Transactions'
import Settings from './Settings'

const AdminLayout = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
    { name: 'Users', path: '/admin/users', icon: UsersIcon },
    { name: 'Events', path: '/admin/events', icon: CalendarIcon },
    { name: 'Transactions', path: '/admin/transactions', icon: BanknotesIcon },
    { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon },
  ]

  return (
    <div className="pt-16 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/5 border-r border-white/10 min-h-screen fixed">
          <div className="p-6">
            <h2 className="font-clash font-bold text-xl text-gold mb-8">Admin Portal</h2>
            
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout