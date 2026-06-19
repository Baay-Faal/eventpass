import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Calendar, Ticket } from 'lucide-react';
import api from '../../api/axios';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const [eventsRes, statsRes] = await Promise.all([
          api.get('/organizer/events'),
          api.get('/organizer/dashboard')
        ]);
        setEvents(eventsRes.data.data);
        setStats(statsRes.data.data);
      } catch (error) {
        console.error('Erreur', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  if (loading) return <div className="text-center py-32 font-black uppercase text-2xl tracking-widest">Chargement...</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Header Organizer */}
      <div className="border-b-2 border-brand-black bg-brand-light py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="uppercase mb-2 text-brand-black">Dashboard</h1>
            <p className="text-brand-gray font-bold uppercase tracking-widest text-sm">Gestion de vos événements</p>
          </div>
          <Link to="/dashboard/create">
            <Button variant="accent" size="lg">
              <Plus className="mr-2" size={20} />
              Nouvel Événement
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* STATISTIQUES */}
        <div className="mb-12">
          <h2 className="text-2xl font-black uppercase mb-6">Vos Statistiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border-2 border-brand-black p-4 bg-brand-black text-white">
              <p className="text-gray-400 font-bold uppercase text-xs mb-2">Revenus Générés</p>
              <p className="text-2xl font-black font-mono">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats?.totalRevenue || 0)}</p>
            </div>
            <div className="border-2 border-brand-black p-4 bg-brand-light">
              <p className="text-brand-gray font-bold uppercase text-xs mb-2">Billets Vendus</p>
              <p className="text-2xl font-black font-mono text-brand-black">{stats?.totalTicketsSold || 0}</p>
            </div>
            <div className="border-2 border-brand-black p-4 bg-brand-light">
              <p className="text-brand-gray font-bold uppercase text-xs mb-2">Taux de présence</p>
              <p className="text-2xl font-black font-mono text-brand-black">{stats?.scanRate || '0%'}</p>
            </div>
            <div className="border-2 border-brand-black p-4 bg-brand-light">
              <p className="text-brand-gray font-bold uppercase text-xs mb-2">Billets Scannés</p>
              <p className="text-2xl font-black font-mono text-brand-black">{stats?.totalScanned || 0}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black uppercase mb-6 border-t-4 border-brand-black pt-12">Liste de vos Événements</h2>

        {events.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-brand-border">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-brand-border" />
            <h3 className="text-xl font-bold uppercase text-brand-gray mb-4">Aucun événement organisé.</h3>
            <p className="text-brand-black mb-8 font-medium">Commencez par créer votre premier événement.</p>
            <Link to="/dashboard/create">
              <Button>Créer maintenant</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-brand-black">
                  <th className="py-4 px-4 font-black uppercase text-sm tracking-widest text-brand-gray">Événement</th>
                  <th className="py-4 px-4 font-black uppercase text-sm tracking-widest text-brand-gray">Date</th>
                  <th className="py-4 px-4 font-black uppercase text-sm tracking-widest text-brand-gray">Statut</th>
                  <th className="py-4 px-4 font-black uppercase text-sm tracking-widest text-brand-gray">Capacité</th>
                  <th className="py-4 px-4 font-black uppercase text-sm tracking-widest text-brand-gray text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-brand-border">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-brand-light transition-colors">
                    <td className="py-6 px-4">
                      <div className="font-bold uppercase text-lg mb-1">{event.title}</div>
                      <div className="text-brand-gray text-sm font-medium">{event.category} - {event.venue}</div>
                    </td>
                    <td className="py-6 px-4 font-bold">
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-6 px-4">
                      <span className={`px-2 py-1 text-xs font-black uppercase border-2 ${
                        event.status === 'PUBLISHED' ? 'border-brand-black text-brand-black bg-brand-light' : 
                        event.status === 'DRAFT' ? 'border-brand-gray text-brand-gray' : 
                        'border-brand-error text-brand-error'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-6 px-4 font-bold font-mono">
                      {event.capacity}
                    </td>
                    <td className="py-6 px-4 text-right flex items-center justify-end gap-2">
                      {event.status === 'DRAFT' && (
                        <Button 
                          variant="accent" 
                          size="sm" 
                          className="!px-4 font-bold text-xs"
                          onClick={async () => {
                            try {
                              await api.patch(`/organizer/events/${event.id}/publish`);
                              window.location.reload();
                            } catch (err) {
                              console.error(err);
                              alert("Erreur lors de la publication");
                            }
                          }}
                        >
                          Publier
                        </Button>
                      )}
                      <Link to={`/dashboard/events/${event.id}/tickets`}>
                        <Button variant="ghost" size="sm" className="!px-3 text-brand-black hover:bg-brand-black hover:text-white transition-colors" title="Gérer les billets">
                          <Ticket size={18} />
                        </Button>
                      </Link>
                      <Link to={`/dashboard/edit/${event.id}`}>
                        <Button variant="ghost" size="sm" className="!px-3" title="Modifier">
                          <Edit2 size={18} />
                        </Button>
                      </Link>
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

export default Dashboard;
