import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token de réinitialisation manquant.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4">
        <div className="text-brand-error font-black uppercase text-2xl mb-4">Lien Invalide</div>
        <Link to="/login" className="font-bold underline">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 py-12 bg-white">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <h1 className="uppercase tracking-tight leading-none mb-4">Nouveau Mot de Passe</h1>
          <p className="text-brand-gray text-lg">Choisissez un nouveau mot de passe pour votre compte.</p>
        </div>

        <div className="bg-brand-light p-8 border-4 border-brand-black shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] mb-8">
          {error && (
            <div className="mb-6 p-4 bg-brand-error text-white font-bold uppercase tracking-wide border-2 border-brand-black">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 p-4 bg-brand-success text-white font-bold uppercase tracking-wide border-2 border-brand-black">
                Mot de passe réinitialisé avec succès !
              </div>
              <p className="font-bold">Redirection vers la connexion...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nouveau mot de passe"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirmez le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              
              <Button 
                type="submit" 
                variant="accent" 
                className="w-full h-[56px] text-lg"
                isLoading={loading}
              >
                Réinitialiser
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
