import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';

const LiveTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fonction pour récupérer les infos du billet
  const fetchTicketDetails = useCallback(async () => {
    try {
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data.data);
      if (response.data.data.status !== 'VALID') {
        setError("Ce billet n'est plus valide pour le scan.");
      }
    } catch (err) {
      setError("Impossible de charger le billet.");
    }
  }, [id]);

  // 2. Fonction pour récupérer le QR Code dynamique depuis le backend
  const fetchDynamicQR = useCallback(async () => {
    try {
      const response = await api.get(`/tickets/${id}/qr`);
      setQrCodeData(response.data.data.qrCode);
      setTimeLeft(60); // Réinitialiser le compteur à 60 secondes
    } catch (err) {
      setError("Erreur de génération du QR Code sécurisé.");
    }
  }, [id]);

  // Initialisation
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchTicketDetails();
      await fetchDynamicQR();
      setLoading(false);
    };
    init();
  }, [fetchTicketDetails, fetchDynamicQR]);

  // Compteur et rafraîchissement auto
  useEffect(() => {
    if (!qrCodeData || error || ticket?.status !== 'VALID') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchDynamicQR(); // Renouvellement auto
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [qrCodeData, error, ticket, fetchDynamicQR]);

  if (loading) return <div className="min-h-screen bg-brand-black flex items-center justify-center text-white font-black uppercase text-2xl tracking-widest">Initialisation Securité...</div>;

  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col">
      {/* Header mobile-friendly */}
      <div className="p-4 flex items-center justify-between border-b-2 border-gray-800">
        <button onClick={() => navigate('/my-tickets')} className="text-gray-400 hover:text-white flex items-center gap-2 font-bold uppercase text-sm tracking-wider">
          <ArrowLeft size={20} /> Retour
        </button>
        <div className="flex items-center gap-2">
          {/* Indicateur LIVE animé */}
          <motion.div 
            animate={{ opacity: [1, 0.2, 1] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-3 h-3 rounded-full bg-brand-red"
          />
          <span className="font-black uppercase tracking-widest text-brand-red text-sm">Live Pass</span>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-6">
        
        {error ? (
          <div className="text-center p-8 border-2 border-brand-error text-brand-error font-black uppercase text-xl">
            {error}
          </div>
        ) : (
          <div className="w-full max-w-sm">
            
            {/* L'enveloppe du QR Code avec bordure animée (anti screenshot) */}
            <div className="relative p-1 overflow-hidden bg-brand-light mb-8">
              
              {/* Ligne animée qui tourne autour */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#E63946_360deg)]"
              />
              
              {/* Le contenu (QR Code) qui masque l'intérieur du conic-gradient */}
              <div className="relative bg-white p-6 w-full flex flex-col items-center">
                <img src={qrCodeData} alt="QR Code Sécurisé" className="w-full max-w-[250px] aspect-square object-contain mb-4" />
                
                {/* Numéro du billet */}
                <div className="font-mono text-brand-black font-black text-2xl tracking-widest mb-1">
                  {ticket?.code}
                </div>
              </div>
            </div>

            {/* Compteur de renouvellement */}
            <div className="text-center mb-12">
              <p className="text-gray-400 font-bold uppercase text-sm tracking-widest mb-2">Renouvellement de sécurité dans</p>
              <div className="text-5xl font-black font-mono text-brand-red">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </div>
            </div>

            {/* Infos de l'événement */}
            <div className="border-l-4 border-brand-red pl-4">
              <h2 className="text-2xl font-black uppercase leading-tight mb-2">{ticket?.event?.title}</h2>
              <p className="text-gray-400 font-bold uppercase text-sm">
                {ticket?.event ? new Date(ticket.event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' }) : ''}
              </p>
              <p className="text-gray-500 font-medium text-sm mt-1">{ticket?.event?.venue}</p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default LiveTicket;
