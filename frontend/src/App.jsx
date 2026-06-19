import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Catalog from './pages/events/Catalog';
import EventDetail from './pages/events/EventDetail';
import MyTickets from './pages/visitor/MyTickets';
import LiveTicket from './pages/visitor/LiveTicket';

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
          <Route path="/events" element={<Catalog />} />
          <Route path="/events/:id" element={<EventDetail />} />
          
          {/* Routes Visiteur */}
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/my-tickets/:id" element={<LiveTicket />} />
          
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
