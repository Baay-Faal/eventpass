import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.data);
      } catch (err) {
        setError('Impossible de charger cet événement.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'VISITOR') {
      setError('Seuls les visiteurs peuvent acheter des billets.');
      return;
    }

    setPurchaseLoading(true);
    setError('');
    
    try {
      await api.post('/tickets/purchase', { eventId: event.id, quantity });
      setSuccess(`${quantity} billet(s) acheté(s) avec succès !`);
      setTimeout(() => {
        navigate('/my-tickets');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'achat.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) return <div className="text-center py-32 font-black uppercase text-2xl tracking-widest">Chargement...</div>;
  if (!event) return <div className="text-center py-32 font-black uppercase text-2xl text-brand-error">{error}</div>;

  const isPastEvent = new Date(event.date) < new Date();
  const isSoldOut = event.availableTickets <= 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Colonne Gauche : Visuel */}
          <div>
            <div className="aspect-square bg-brand-light border-4 border-brand-black relative">
              {event.image ? (
                <img 
                  src={`http://localhost:3000/uploads/${event.image}`} 
                  alt={event.title} 
                  className="w-full h-full object-cover grayscale"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-black text-6xl font-black opacity-10 uppercase transform -rotate-45">
                  {event.category}
                </div>
              )}
              <div className="absolute top-0 left-0 flex flex-col">
                <div className="bg-brand-red text-white px-4 py-2 font-black uppercase tracking-widest border-b-4 border-r-4 border-brand-black">
                  {event.category}
                </div>
                {isPastEvent && (
                  <div className="bg-brand-black text-white px-4 py-2 font-black uppercase tracking-widest border-b-4 border-r-4 border-brand-black inline-block mt-[-4px]">
                    TERMINÉ
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonne Droite : Infos et Achat */}
          <div className="flex flex-col justify-center">
            
            <div className="mb-4 text-brand-red font-bold uppercase tracking-widest">
              {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            
            <h1 className="uppercase mb-8 leading-none">{event.title}</h1>
            
            <div className="text-4xl font-black mb-8 border-b-2 border-brand-border pb-8">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(event.price)}
            </div>

            <div className="space-y-4 mb-12 text-brand-gray font-medium text-lg">
              <p><strong className="text-brand-black uppercase text-sm mr-2">Lieu:</strong> {event.venue}</p>
              <p><strong className="text-brand-black uppercase text-sm mr-2">Adresse:</strong> {event.address}</p>
              <p><strong className="text-brand-black uppercase text-sm mr-2">Organisateur:</strong> {event.organizer?.firstName} {event.organizer?.lastName}</p>
              <p>
                <strong className="text-brand-black uppercase text-sm mr-2">Disponibilité:</strong> 
                {isSoldOut ? (
                  <span className="bg-brand-black text-white px-3 py-1 font-bold text-sm uppercase">Complet</span>
                ) : (
                  <span className="bg-brand-light border-2 border-brand-black text-brand-black px-3 py-1 font-bold text-sm uppercase">
                    {event.availableTickets} Billet(s) Restant(s)
                  </span>
                )}
              </p>
            </div>

            <p className="text-lg leading-relaxed mb-12">
              {event.description}
            </p>

            {/* Zone d'achat */}
            <div className="bg-brand-light p-8 border-2 border-brand-black">
              {error && <div className="mb-6 text-brand-error font-bold uppercase">{error}</div>}
              {success && <div className="mb-6 text-brand-success font-bold uppercase">{success}</div>}
              
              <div className="flex items-end gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">
                    Quantité (Max 3)
                  </label>
                  <select 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border-2 border-brand-black focus:outline-none text-xl font-bold"
                    disabled={purchaseLoading || success}
                  >
                    <option value={1}>1 Billet</option>
                    <option value={2}>2 Billets</option>
                    <option value={3}>3 Billets</option>
                  </select>
                </div>
                
                <div className="flex-[2]">
                  {isPastEvent ? (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full h-[56px]" 
                      disabled={true}
                    >
                      Événement Terminé
                    </Button>
                  ) : isSoldOut ? (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full h-[56px] opacity-50 cursor-not-allowed" 
                      disabled={true}
                    >
                      Complet
                    </Button>
                  ) : (
                    <Button 
                      variant="accent" 
                      size="lg" 
                      className="w-full h-[56px]" 
                      onClick={handlePurchase}
                      isLoading={purchaseLoading}
                      disabled={success}
                    >
                      {!user ? 'Se connecter pour acheter' : 'Commander'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default EventDetail;
