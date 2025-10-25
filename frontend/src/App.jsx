import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/public/Home'
import EventDetails from './pages/public/Eventdetails'
import Checkout from './pages/public/checkout'
import TicketConfirmation from './pages/public/TicketConfirmation'
import Login from './pages/authentication/Login'
import Register from './pages/authentication/Register'
import SelectOrganization from './pages/authentication/SelectOrganization'
import EmployeeLayout from './pages/employee/EmployeeLayout'
import AdminLayout from './pages/admin/{components}/AdminLayout'

// Layout wrapper to conditionally show footer
function Layout({ children }) {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/employee') || 
                      location.pathname.startsWith('/admin')

  return (
    <>
      {children}
      {!isDashboard && <Footer />}
    </>
  )
}

function App() {
  console.log('App component rendering...')
  
  try {
    return (
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-matte text-white font-inter">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                },
                success: {
                  iconTheme: {
                    primary: '#D4AF37',
                    secondary: '#1a1a1a',
                  },
                },
              }}
            />
            <Navbar />
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/checkout/:id" element={<Checkout />} />
                <Route path="/ticket/:id" element={<TicketConfirmation />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/select-organization" element={<SelectOrganization />} />
                
                {/* Protected Employee Routes */}
                <Route path="/employee/*" element={<EmployeeLayout />} />
                
                {/* Protected Admin Routes */}
                <Route path="/admin/*" element={<AdminLayout />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('Error in App component:', error)
    return <div style={{color: 'red', padding: '50px'}}>Error: {error.message}</div>
  }
}

export default App