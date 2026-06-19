import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // S'il y a un ID, c'est le mode édition
  const isEditMode = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '', // vide par défaut, sera défini après le fetch
    date: '',
    venue: '',
    address: '',
    capacity: '',
    price: '',
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    // 1. Récupérer les catégories
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
        if (!isEditMode && res.data.data.length > 0) {
          setFormData(prev => ({ ...prev, category: res.data.data[0].name }));
        }
      } catch (err) {
        console.error("Erreur chargement catégories", err);
      }
    };

    fetchCategories();

    // 2. Si mode édition, récupérer l'événement
    if (isEditMode) {
      const fetchEvent = async () => {
        try {
          const response = await api.get(`/events/${id}`);
          const event = response.data.data;
          const formattedDate = new Date(event.date).toISOString().slice(0, 16);
          
          setFormData({
            title: event.title,
            description: event.description,
            category: event.category,
            date: formattedDate,
            venue: event.venue,
            address: event.address,
            capacity: event.capacity,
            price: event.price,
          });
        } catch (err) {
          setError("Impossible de charger les données de l'événement.");
        }
      };
      fetchEvent();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Puisqu'on envoie un fichier, on doit utiliser FormData
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (image) {
        data.append('image', image);
      }

      if (isEditMode) {
        await api.put(`/organizer/events/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/organizer/events', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || `Erreur lors de la ${isEditMode ? 'modification' : 'création'} de l'événement.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="border-b-2 border-brand-black bg-brand-light py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="uppercase mb-2 text-brand-black">{isEditMode ? 'Modifier l\'événement' : 'Nouvel Événement'}</h1>
          <p className="text-brand-gray font-bold uppercase tracking-widest text-sm">
            {isEditMode ? 'Ajustez les détails de votre événement en brouillon' : 'Créez et publiez votre événement'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 border-2 border-brand-error text-brand-error p-4 font-bold uppercase tracking-wide text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-8 p-8 border-2 border-brand-border bg-white">
            <h2 className="text-2xl font-black uppercase border-b-2 border-brand-border pb-4">Informations Générales</h2>
            
            <Input
              label="Titre de l'événement"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full px-4 py-3 bg-brand-light border-b-2 border-transparent focus:border-brand-black focus:bg-white focus:outline-none transition-colors"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Catégorie</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-brand-black focus:outline-none font-bold uppercase"
                  required
                >
                  <option value="" disabled>-- Choisir une catégorie --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Date et Heure"
                type="datetime-local"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-8 p-8 border-2 border-brand-border bg-white">
            <h2 className="text-2xl font-black uppercase border-b-2 border-brand-border pb-4">Lieu & Billetterie</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Lieu (Nom de la salle)"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
              />
              <Input
                label="Adresse complète"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Capacité (Nombre de places)"
                type="number"
                name="capacity"
                required
                min={1}
                value={formData.capacity}
                onChange={handleChange}
              />
              <Input
                label="Prix unitaire (FCFA)"
                type="number"
                name="price"
                required
                min={0}
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-8 p-8 border-2 border-brand-border bg-white">
            <h2 className="text-2xl font-black uppercase border-b-2 border-brand-border pb-4">Visuel</h2>
            
            <div>
              <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">
                {isEditMode ? 'Nouvelle affiche (optionnel)' : 'Affiche de l\'événement (Image)'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!isEditMode}
                className="w-full text-brand-gray file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-brand-black file:text-white hover:file:bg-gray-800 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
              Annuler
            </Button>
            <Button type="submit" variant="accent" size="lg" isLoading={isLoading}>
              {isEditMode ? 'Enregistrer les modifications' : 'Créer l\'événement'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
