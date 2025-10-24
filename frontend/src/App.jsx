import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/public/Home'
import EventDetails from './pages/public/Eventdetails'
import Checkout from './pages/public/checkout'
import TicketConfirmation from './pages/public/TicketConfirmation'
import Login from './pages/authentication/Login'
import Register from './pages/authentication/Register'
import OrganizerLayout from './pages/organizer/{components}/OrganizerLayout'
import EmployeeLayout from './pages/employee/EmployeeLayout'
import AdminLayout from './pages/admin/{components}/AdminLayout'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-matte text-white font-inter">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/ticket/:id" element={<TicketConfirmation />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Organizer Routes */}
          <Route path="/organizer/*" element={<OrganizerLayout />} />
          
          {/* Protected Employee Routes */}
          <Route path="/employee/*" element={<EmployeeLayout />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App