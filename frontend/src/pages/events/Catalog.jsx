import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const Catalog = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      
      const response = await api.get('/events', { params });
      setEvents(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des événements', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Petit délai (debounce) pour éviter d'appeler l'API à chaque frappe au clavier
    const delayDebounceFn = setTimeout(() => {
      fetchEvents();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  const categories = ['CONCERT', 'MATCH', 'CONFERENCE', 'SPECTACLE', 'AUTRE'];

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Header Brutaliste */}
      <div className="border-b-2 border-brand-black bg-brand-light py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="uppercase mb-6">Tous les événements</h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-grow">
              <Input
                label="Rechercher"
                placeholder="Ex: Paris, Concert, Finale..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setCategory('')}
                className={`px-4 py-2 border-2 font-bold uppercase tracking-wide text-sm transition-colors ${!category ? 'bg-brand-black text-white border-brand-black' : 'bg-transparent text-brand-black border-brand-black hover:bg-brand-light'}`}
              >
                TOUT
              </button>
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 border-2 font-bold uppercase tracking-wide text-sm transition-colors ${category === c ? 'bg-brand-black text-white border-brand-black' : 'bg-transparent text-brand-black border-brand-border hover:border-brand-black'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid des Événements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="text-center py-20 text-brand-gray font-bold uppercase tracking-widest">
            Chargement...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-brand-gray mb-4">Aucun résultat.</h3>
            <p className="text-brand-black font-medium">Essayez d'autres critères de recherche.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="group">
                <Card className="h-full flex flex-col hover:border-brand-black transition-colors" noPadding>
                  
                  {/* Image Placeholder ou Vraie Image */}
                  <div className="aspect-video bg-brand-light border-b-2 border-brand-border group-hover:border-brand-black transition-colors relative overflow-hidden">
                    {event.image ? (
                      <img 
                        src={`http://localhost:3000/uploads/${event.image}`} 
                        alt={event.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-black text-white font-black text-4xl opacity-10 group-hover:opacity-100 transition-opacity uppercase">
                        {event.category}
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-white text-brand-black px-3 py-1 font-bold text-xs uppercase tracking-wider border-2 border-brand-black">
                      {event.category}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <div className="text-brand-red font-bold text-sm uppercase tracking-wider mb-2">
                      {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    <h3 className="text-2xl uppercase mb-4 group-hover:text-brand-red transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="mt-auto pt-6 flex justify-between items-end">
                      <div className="text-brand-gray font-medium text-sm">
                        {event.venue}
                      </div>
                      <div className="text-2xl font-black">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(event.price)}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
