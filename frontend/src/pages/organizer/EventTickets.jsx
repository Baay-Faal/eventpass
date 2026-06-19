import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios';
import Button from '../../components/ui/Button';

const EventTickets = () => {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await api.get(`/organizer/events/${id}/tickets`);
      setTickets(res.data.data);
    } catch (err) {
      setError("Impossible de charger les billets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [id]);

  const handleApprove = async (ticketId) => {
    try {
      await api.patch(`/organizer/tickets/${ticketId}/approve`);
      // Mettre à jour l'état local
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'VALID' } : t));
    } catch (err) {
      alert("Erreur lors de l'approbation.");
    }
  };

  const handleReject = async (ticketId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir refuser ce billet ?")) return;
    try {
      await api.patch(`/organizer/tickets/${ticketId}/reject`);
      // Mettre à jour l'état local
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'CANCELLED' } : t));
    } catch (err) {
      alert("Erreur lors du refus.");
    }
  };

  if (loading) return <div className="text-center py-32 font-black uppercase text-2xl tracking-widest">Chargement...</div>;

  const pendingTickets = tickets.filter(t => t.status === 'PENDING');
  const otherTickets = tickets.filter(t => t.status !== 'PENDING');

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Organizer */}
      <div className="border-b-2 border-brand-black bg-brand-light py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center text-brand-black hover:text-brand-red font-bold uppercase tracking-wide mb-6 transition-colors">
            <ArrowLeft className="mr-2" size={20} />
            Retour au Dashboard
          </Link>
          <h1 className="uppercase mb-2 text-brand-black">Gestion des Billets</h1>
          <p className="text-brand-gray font-bold uppercase tracking-widest text-sm">
            Total : {tickets.length} billet(s) | En attente : {pendingTickets.length}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 border-2 border-brand-error text-brand-error p-4 font-bold uppercase tracking-wide text-sm">
            {error}
          </div>
        )}

        {/* Section Billets en attente */}
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center">
          <span className="bg-yellow-400 text-black px-3 py-1 mr-3 text-lg">!</span>
          En attente d'approbation ({pendingTickets.length})
        </h2>
        
        {pendingTickets.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-brand-border mb-12">
            <p className="text-brand-gray font-bold uppercase tracking-widest">Aucune demande en attente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {pendingTickets.map(ticket => (
              <div key={ticket.id} className="border-4 border-yellow-400 p-6 bg-white shadow-[8px_8px_0px_0px_#facc15]">
                <div className="mb-4">
                  <p className="font-black uppercase text-xl mb-1">{ticket.user.firstName} {ticket.user.lastName}</p>
                  <p className="text-brand-gray font-medium text-sm">{ticket.user.email}</p>
                </div>
                <p className="text-xs font-mono bg-gray-100 p-2 mb-6">Code: {ticket.code}</p>
                <div className="flex gap-3">
                  <Button variant="accent" className="flex-1 !px-2" onClick={() => handleApprove(ticket.id)}>
                    <CheckCircle className="mr-2" size={18} />
                    Approuver
                  </Button>
                  <Button variant="outline" className="flex-1 !px-2 text-brand-error border-brand-error hover:bg-brand-error hover:text-white" onClick={() => handleReject(ticket.id)}>
                    <XCircle className="mr-2" size={18} />
                    Refuser
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Autres billets */}
        <h2 className="text-2xl font-black uppercase mb-6 border-t-4 border-brand-black pt-12">
          Autres Billets ({otherTickets.length})
        </h2>

        {otherTickets.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-brand-border">
            <p className="text-brand-gray font-bold uppercase tracking-widest">Aucun billet validé ou refusé pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-brand-black">
                  <th className="py-4 px-4 font-black uppercase text-sm tracking-widest text-brand-gray">Visiteur</th>
                  <th className="py-4 px-4 font-black uppercase text-sm tracking-widest text-brand-gray">Code</th>
                  <th className="py-4 px-4 font-black uppercase text-sm tracking-widest text-brand-gray">Statut</th>
                  <th className="py-4 px-4 font-black uppercase text-sm tracking-widest text-brand-gray text-right">Date d'achat</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-brand-border">
                {otherTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-brand-light transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold uppercase mb-1">{ticket.user.firstName} {ticket.user.lastName}</div>
                      <div className="text-brand-gray text-xs">{ticket.user.email}</div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-sm">
                      {ticket.code}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-black uppercase border-2 ${
                        ticket.status === 'VALID' ? 'border-brand-success text-brand-success' : 
                        ticket.status === 'USED' ? 'border-brand-black text-brand-black bg-brand-light' : 
                        'border-brand-error text-brand-error'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-sm text-brand-gray">
                      {new Date(ticket.purchasedAt).toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default EventTickets;
