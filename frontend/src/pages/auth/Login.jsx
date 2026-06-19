import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'VISITOR') navigate('/events');
      else if (user.role === 'ORGANIZER') navigate('/dashboard');
      else if (user.role === 'AGENT') navigate('/scan');
      else if (user.role === 'ADMIN') navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase text-brand-black tracking-tight mb-2">Connexion</h2>
          <div className="w-12 h-2 bg-brand-red"></div>
        </div>

        {error && (
          <div className="mb-8 bg-brand-black text-white p-4 font-bold uppercase tracking-wide text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <Input
            label="Adresse Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Mot de passe"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-full mt-4" size="lg" isLoading={isLoading}>
            S'identifier
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t-2 border-brand-border">
          <Link to="/register" className="font-bold text-brand-gray hover:text-brand-black uppercase tracking-wide transition-colors">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
