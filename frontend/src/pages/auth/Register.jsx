import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase text-brand-black tracking-tight mb-2">Inscription</h2>
          <div className="w-12 h-2 bg-brand-red"></div>
        </div>

        {error && (
          <div className="mb-8 bg-brand-black text-white p-4 font-bold uppercase tracking-wide text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 border-2 border-brand-success text-brand-success p-4 font-bold uppercase tracking-wide text-sm">
            Création réussie. Redirection...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Prénom"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <Input
              label="Nom"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Mot de passe"
            type="password"
            name="password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
          />

          <Button type="submit" className="w-full mt-4" size="lg" isLoading={isLoading} disabled={success}>
            Rejoindre
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t-2 border-brand-border">
          <Link to="/login" className="font-bold text-brand-gray hover:text-brand-black uppercase tracking-wide transition-colors">
            J'ai déjà un compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
