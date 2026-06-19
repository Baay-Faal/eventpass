import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // URL de reset simulée en dev
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('L\'email est requis.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setDevResetUrl('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      if (response.data.resetUrl) {
        setDevResetUrl(response.data.resetUrl);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la demande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 py-12 bg-white">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-10">
          <h1 className="uppercase tracking-tight leading-none mb-4">Mot de Passe Oublié</h1>
          <p className="text-brand-gray text-lg">Entrez votre email pour recevoir un lien de réinitialisation.</p>
        </div>

        <div className="bg-brand-light p-8 border-4 border-brand-black shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] mb-8">
          {error && (
            <div className="mb-6 p-4 bg-brand-error text-white font-bold uppercase tracking-wide border-2 border-brand-black">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-brand-success text-white font-bold uppercase tracking-wide border-2 border-brand-black">
              {message}
            </div>
          )}

          {devResetUrl && (
            <div className="mb-6 p-4 bg-yellow-200 text-brand-black font-bold border-2 border-brand-black break-words">
              <p className="uppercase text-sm mb-2 text-brand-error">Lien de test (Mode Dev uniquement) :</p>
              <a href={devResetUrl} className="underline text-blue-600 break-all">{devResetUrl}</a>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Adresse Email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Button 
              type="submit" 
              variant="accent" 
              className="w-full h-[56px] text-lg"
              isLoading={loading}
            >
              Envoyer le lien
            </Button>
          </form>
        </div>

        <div className="text-center">
          <Link to="/login" className="font-bold text-brand-black hover:text-brand-red uppercase tracking-wide transition-colors">
            ← Retour à la connexion
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
