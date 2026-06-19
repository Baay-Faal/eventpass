import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AdminPanel = () => {
  const [organizers, setOrganizers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulaire générique pour créer un compte
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ORGANIZER' // ou 'AGENT'
  });
  
  // Formulaire de catégorie
  const [categoryName, setCategoryName] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orgsRes, agentsRes, statsRes, catRes] = await Promise.all([
        api.get('/admin/organizers'),
        api.get('/admin/agents'),
        api.get('/admin/stats'),
        api.get('/categories') // Route publique mais utile ici
      ]);
      setOrganizers(orgsRes.data.data);
      setAgents(agentsRes.data.data);
      setStats(statsRes.data.data);
      setCategories(catRes.data.data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormLoading(true);

    try {
      const endpoint = formData.role === 'ORGANIZER' ? '/admin/organizers' : '/admin/agents';
      await api.post(endpoint, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      setSuccess(`Compte ${formData.role} créé avec succès.`);
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: formData.role });
      fetchData(); // Rafraîchir les listes
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du compte.");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleOrganizer = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/organizers/${id}/status`, { isActive: !currentStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAgent = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/agents/${id}/status`, { isActive: !currentStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/categories', { name: categoryName });
      setCategoryName('');
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors de la création de la catégorie');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-32 font-black uppercase text-2xl tracking-widest">Chargement...</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b-2 border-brand-black bg-brand-light py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="uppercase mb-2 text-brand-black">Administration</h1>
          <p className="text-brand-gray font-bold uppercase tracking-widest text-sm">Vue Financière & Plateforme</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* STATISTIQUES FINANCIERES */}
        <div className="mb-12">
          <h2 className="text-2xl font-black uppercase mb-6">Tableau de Bord</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border-2 border-brand-black p-4 bg-brand-black text-white">
              <p className="text-gray-400 font-bold uppercase text-xs mb-2">Total Revenus</p>
              <p className="text-2xl font-black font-mono">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(stats?.totalRevenue || 0)}</p>
            </div>
            <div className="border-2 border-brand-black p-4 bg-brand-light">
              <p className="text-brand-gray font-bold uppercase text-xs mb-2">Billets Vendus</p>
              <p className="text-2xl font-black font-mono text-brand-black">{stats?.totalTickets || 0}</p>
            </div>
            <div className="border-2 border-brand-black p-4 bg-brand-light">
              <p className="text-brand-gray font-bold uppercase text-xs mb-2">Événements</p>
              <p className="text-2xl font-black font-mono text-brand-black">{stats?.totalEvents || 0}</p>
            </div>
            <div className="border-2 border-brand-black p-4 bg-brand-light">
              <p className="text-brand-gray font-bold uppercase text-xs mb-2">Scans d'Entrée</p>
              <p className="text-2xl font-black font-mono text-brand-black">{stats?.totalScans || 0}</p>
            </div>
          </div>
        </div>

        <div className="mb-12 grid lg:grid-cols-2 gap-8">
          {/* Revenus par Organisateur */}
          <div className="border-2 border-brand-black p-6">
            <h3 className="font-black uppercase mb-4">Revenus par Organisateur</h3>
            <div className="divide-y-2 divide-brand-border">
              {stats?.organizerStats?.map((org, idx) => (
                <div key={idx} className="py-3 flex justify-between">
                  <span className="font-bold uppercase text-sm">{org.name}</span>
                  <span className="font-mono font-bold text-brand-black">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(org.revenue)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ventes par Événement */}
          <div className="border-2 border-brand-black p-6">
            <h3 className="font-black uppercase mb-4">Top Événements</h3>
            <div className="divide-y-2 divide-brand-border">
              {stats?.eventStats?.slice(0, 5).map((evt, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold uppercase text-sm block">{evt.title}</span>
                    <span className="text-xs text-brand-gray uppercase">{evt.ticketsSold} billets vendus</span>
                  </div>
                  <span className="font-mono font-bold text-brand-black">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(evt.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GESTION UTILISATEURS */}
        <h2 className="text-2xl font-black uppercase mb-6 border-t-4 border-brand-black pt-12">Gestion des Équipes</h2>
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Formulaire de création */}
          <div className="lg:col-span-1 border-2 border-brand-black p-8 h-fit bg-brand-light">
            <h2 className="text-xl font-black uppercase border-b-2 border-brand-border pb-4 mb-8">Créer un profil</h2>
            
            {error && <div className="mb-6 bg-brand-error text-white font-bold p-3 uppercase text-xs">{error}</div>}
            {success && <div className="mb-6 bg-brand-success text-white font-bold p-3 uppercase text-xs">{success}</div>}

            <form onSubmit={handleCreateAccount} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-brand-black mb-2 uppercase tracking-wide">Rôle</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-brand-black focus:outline-none font-bold uppercase"
                >
                  <option value="ORGANIZER">Organisateur</option>
                  <option value="AGENT">Agent de Sécurité</option>
                </select>
              </div>

              <Input label="Prénom" name="firstName" required value={formData.firstName} onChange={handleChange} />
              <Input label="Nom" name="lastName" required value={formData.lastName} onChange={handleChange} />
              <Input label="Email" type="email" name="email" required value={formData.email} onChange={handleChange} />
              <Input label="Mot de passe" type="password" name="password" required value={formData.password} onChange={handleChange} />

              <Button type="submit" variant="accent" className="w-full mt-4" isLoading={formLoading}>
                Générer l'accès
              </Button>
            </form>
          </div>

          {/* Listes */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Organisateurs */}
            <div>
              <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-4">
                Organisateurs <span className="bg-brand-black text-white px-3 py-1 text-sm">{organizers.length}</span>
              </h2>
              <div className="border-2 border-brand-border">
                {organizers.length === 0 ? (
                  <div className="p-6 text-brand-gray font-bold uppercase text-sm">Aucun organisateur</div>
                ) : (
                  <div className="divide-y-2 divide-brand-border">
                    {organizers.map(org => (
                      <div key={org.id} className={`p-4 flex justify-between items-center transition-colors ${org.isActive ? 'bg-white' : 'bg-gray-50 opacity-75'}`}>
                        <div>
                          <div className="font-bold text-lg uppercase">{org.firstName} {org.lastName}</div>
                          <div className="text-brand-gray font-medium">{org.email}</div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <div className={`text-xs font-black uppercase px-2 py-1 ${org.isActive ? 'bg-brand-light text-brand-success' : 'bg-brand-error text-white'}`}>
                            {org.isActive ? 'Actif' : 'Désactivé'}
                          </div>
                          <button 
                            onClick={() => toggleOrganizer(org.id, org.isActive)}
                            className="text-xs font-bold uppercase underline hover:text-brand-red cursor-pointer"
                          >
                            {org.isActive ? 'Désactiver' : 'Activer'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Agents */}
            <div>
              <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-4">
                Agents de Sécurité <span className="bg-brand-black text-white px-3 py-1 text-sm">{agents.length}</span>
              </h2>
              <div className="border-2 border-brand-border">
                {agents.length === 0 ? (
                  <div className="p-6 text-brand-gray font-bold uppercase text-sm">Aucun agent</div>
                ) : (
                  <div className="divide-y-2 divide-brand-border">
                    {agents.map(agent => (
                      <div key={agent.id} className={`p-4 flex justify-between items-center transition-colors ${agent.isActive ? 'bg-white' : 'bg-gray-50 opacity-75'}`}>
                        <div>
                          <div className="font-bold text-lg uppercase">{agent.firstName} {agent.lastName}</div>
                          <div className="text-brand-gray font-medium">{agent.email}</div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <div className={`text-xs font-black uppercase px-2 py-1 ${agent.isActive ? 'bg-brand-light text-brand-success' : 'bg-brand-error text-white'}`}>
                            {agent.isActive ? 'Actif' : 'Désactivé'}
                          </div>
                          <button 
                            onClick={() => toggleAgent(agent.id, agent.isActive)}
                            className="text-xs font-bold uppercase underline hover:text-brand-red cursor-pointer"
                          >
                            {agent.isActive ? 'Désactiver' : 'Activer'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
        
        {/* GESTION DES CATEGORIES */}
        <h2 className="text-2xl font-black uppercase mb-6 border-t-4 border-brand-black pt-12">Gestion des Catégories</h2>
        <div className="grid lg:grid-cols-3 gap-12 mb-12">
          {/* Ajouter catégorie */}
          <div className="lg:col-span-1 border-2 border-brand-black p-8 h-fit bg-brand-light">
            <h2 className="text-xl font-black uppercase border-b-2 border-brand-border pb-4 mb-8">Nouvelle Catégorie</h2>
            <form onSubmit={handleCreateCategory} className="space-y-6">
              <Input 
                label="Nom de la catégorie" 
                name="categoryName" 
                required 
                value={categoryName} 
                onChange={(e) => setCategoryName(e.target.value)} 
                placeholder="Ex: HUMOUR, GALA..."
              />
              <Button type="submit" variant="accent" className="w-full mt-4">
                Ajouter
              </Button>
            </form>
          </div>
          {/* Liste catégories */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-4">
              Catégories Actives <span className="bg-brand-black text-white px-3 py-1 text-sm">{categories.length}</span>
            </h2>
            <div className="border-2 border-brand-border">
              {categories.length === 0 ? (
                <div className="p-6 text-brand-gray font-bold uppercase text-sm">Aucune catégorie</div>
              ) : (
                <div className="divide-y-2 divide-brand-border">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-4 flex justify-between items-center transition-colors hover:bg-gray-50">
                      <div className="font-bold text-lg uppercase">{cat.name}</div>
                      <button 
                        onClick={() => deleteCategory(cat.id)}
                        className="text-xs font-bold uppercase underline hover:text-brand-red cursor-pointer text-brand-error"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
