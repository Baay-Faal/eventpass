import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import logoUrl from '../../../../logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Événements', path: '/events' },
  ];

  if (user?.role === 'VISITOR') {
    navLinks.push({ name: 'Mes Billets', path: '/my-tickets' });
  } else if (user?.role === 'ORGANIZER') {
    navLinks.push({ name: 'Dashboard', path: '/dashboard' });
    navLinks.push({ name: 'Créer un événement', path: '/dashboard/create' });
  } else if (user?.role === 'AGENT') {
    navLinks.push({ name: 'Scan', path: '/scan' });
  } else if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <nav className="bg-white border-b-2 border-brand-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="EventPass" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className="text-brand-black hover:text-brand-red py-2 font-bold uppercase tracking-wide text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-6 ml-4 pl-6 border-l-2 border-brand-border">
                <span className="font-bold text-sm uppercase tracking-wide">{user.firstName}</span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 mr-2" />
                  Quitter
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4 pl-6 border-l-2 border-brand-border">
                <Link to="/login">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Créer un compte</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-black focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t-2 border-brand-black">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-xl font-black uppercase text-brand-black hover:text-brand-red"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-brand-border my-6" />

            {user ? (
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="block text-xl font-black uppercase text-brand-error"
              >
                Déconnexion
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  to="/login"
                  className="block text-xl font-black uppercase text-brand-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block text-xl font-black uppercase text-brand-red"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
