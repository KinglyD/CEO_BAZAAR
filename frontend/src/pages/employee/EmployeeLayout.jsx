import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  CalendarDaysIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import EmployeeDashboard from './EmployeeDashboard'
import Invites from './Invites'
import EventWork from './EventWork'

const EmployeeLayout = () => {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navigation = [
    { name: 'EVENTS', path: '/employee/dashboard', icon: HomeIcon },
    { name: 'Invitations', path: '/employee/invites', icon: EnvelopeIcon },
  ]

  return (
    <div className="pt-16 min-h-screen">
      <div className="flex">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          w-64 bg-white/5 border-r border-white/10 min-h-screen fixed z-40 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            <h2 className="font-clash font-bold text-xl text-gold mb-8">Employee Portal</h2>
            
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
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
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-graytext hover:text-white transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="invites" element={<Invites />} />
            <Route path="event/:eventId" element={<EventWork />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default EmployeeLayout