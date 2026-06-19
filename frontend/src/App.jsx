import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Catalog from './pages/events/Catalog';
import EventDetail from './pages/events/EventDetail';
import MyTickets from './pages/visitor/MyTickets';
import LiveTicket from './pages/visitor/LiveTicket';
import Dashboard from './pages/organizer/Dashboard';
import EventForm from './pages/organizer/EventForm';
import EventTickets from './pages/organizer/EventTickets';
import CheckinScanner from './pages/agent/CheckinScanner';
import AdminPanel from './pages/admin/AdminPanel';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Conteneur principal qui prend la hauteur restante */}
      <main className="flex-grow">
        <Routes>
          {/* Routes Publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/events" element={<Catalog />} />
          <Route path="/events/:id" element={<EventDetail />} />
          
          {/* Routes Visiteur */}
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/my-tickets/:id" element={<LiveTicket />} />
          
          {/* Routes Organisateur */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create" element={<EventForm />} />
          <Route path="/dashboard/edit/:id" element={<EventForm />} />
          <Route path="/dashboard/events/:id/tickets" element={<EventTickets />} />

          {/* Routes Agent */}
          <Route path="/scan" element={<CheckinScanner />} />

          {/* Routes Admin */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Les autres routes (Events, Dashboard, Checkin) viendront ici plus tard */}
        </Routes>
      </main>

      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm mt-auto">
        © {new Date().getFullYear()} EventPass. Tous droits réservés.
      </footer>
    </div>
  );
}

export default App;
