import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/my-tickets');
        setTickets(response.data.data);
      } catch (error) {
        console.error('Erreur', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <div className="text-center py-32 font-black uppercase text-2xl tracking-widest">Chargement...</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b-2 border-brand-black bg-brand-light py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="uppercase mb-2 text-brand-black">Mes Billets</h1>
          <p className="text-brand-gray font-bold uppercase tracking-widest text-sm">Vos accès sécurisés</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tickets.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-brand-border">
            <h3 className="text-xl font-bold uppercase text-brand-gray mb-4">Vous n'avez aucun billet.</h3>
            <Link to="/events" className="text-brand-red font-black uppercase hover:underline">
              Explorer les événements
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tickets.map((ticket) => (
              <Link to={`/my-tickets/${ticket.id}`} key={ticket.id} className="block group">
                <div className={`border-2 ${ticket.status === 'VALID' ? 'border-brand-black hover:border-brand-red' : ticket.status === 'PENDING' ? 'border-yellow-400' : 'border-brand-border opacity-50'} transition-colors flex flex-col h-full bg-white`}>
                  
                  <div className="p-6 border-b-2 border-brand-border flex justify-between items-center bg-brand-light">
                    <span className="font-black font-mono text-lg">{ticket.code}</span>
                    <span className={`px-2 py-1 text-xs font-black uppercase border-2 ${
                      ticket.status === 'VALID' ? 'border-brand-black text-brand-black' : 
                      ticket.status === 'PENDING' ? 'border-yellow-400 bg-yellow-400 text-black' :
                      ticket.status === 'USED' ? 'border-brand-gray text-brand-gray' : 'border-brand-error text-brand-error'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-center">
                    <h3 className="text-2xl font-black uppercase leading-none mb-4 group-hover:text-brand-red transition-colors">
                      {ticket.event?.title}
                    </h3>
                    <div className="text-brand-gray font-bold uppercase text-sm mb-1">
                      {ticket.event ? new Date(ticket.event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Date inconnue'}
                    </div>
                    <div className="text-brand-gray text-sm font-medium">
                      {ticket.event?.venue}
                    </div>
                  </div>

                  {ticket.status === 'VALID' && (
                    <div className="p-4 bg-brand-black text-white text-center font-black uppercase text-sm tracking-widest group-hover:bg-brand-red transition-colors">
                      Afficher le Pass
                    </div>
                  )}
                  {ticket.status === 'PENDING' && (
                    <div className="p-4 bg-yellow-400 text-black text-center font-black uppercase text-sm tracking-widest cursor-not-allowed">
                      Approbation requise
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
