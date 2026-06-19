import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const EventForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'CONCERT',
    date: '',
    venue: '',
    address: '',
    capacity: '',
    price: '',
  });
  const [image, setImage] = useState(null);

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

      await api.post('/organizer/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'événement.');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['CONCERT', 'MATCH', 'CONFERENCE', 'SPECTACLE', 'AUTRE'];

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="border-b-2 border-brand-black bg-brand-light py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="uppercase mb-2 text-brand-black">Nouvel Événement</h1>
          <p className="text-brand-gray font-bold uppercase tracking-widest text-sm">Créez et publiez votre événement</p>
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
                <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">
                  Catégorie
                </label>
                <select
                  name="category"
                  className="w-full px-4 py-3 bg-brand-light border-b-2 border-transparent focus:border-brand-black focus:bg-white focus:outline-none transition-colors"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
                Affiche de l'événement (Image)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full text-brand-gray file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-brand-black file:text-white hover:file:bg-gray-800 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
              Annuler
            </Button>
            <Button type="submit" variant="accent" size="lg" isLoading={isLoading}>
              Créer l'événement
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
