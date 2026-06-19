/**
 * Seed — Données initiales de la base de données
 * 
 * Insère les 4 comptes de démonstration définis dans le cahier des charges.
 * Exécution : node src/seed.js
 * 
 * Le compte Admin est obligatoire car il ne peut pas être créé via l'interface.
 * Les mots de passe sont hashés avec bcrypt avant insertion.
 */

const bcrypt = require('bcryptjs');
const { User, Event, sequelize } = require('./models');

const seed = async () => {
  try {
    // Connexion à la base
    await sequelize.authenticate();
    console.log('✅ Connexion à MySQL réussie');

    // Synchroniser les tables
    await sequelize.sync({ alter: true });

    console.log('🌱 Démarrage du seed...\n');

    // ─── Hashage des mots de passe ─────────────────────────────────────
    const adminPassword = await bcrypt.hash('Admin1234!', 10);
    const orgaPassword = await bcrypt.hash('Orga1234!', 10);
    const visitorPassword = await bcrypt.hash('Visit1234!', 10);
    const agentPassword = await bcrypt.hash('Agent1234!', 10);

    // ─── Création des comptes ──────────────────────────────────────────
    // findOrCreate → crée seulement si l'email n'existe pas déjà
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@eventpass.fr' },
      defaults: {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@eventpass.fr',
        password: adminPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log(`✅ Admin : ${admin.email}`);

    const [organisateur] = await User.findOrCreate({
      where: { email: 'organisateur@eventpass.fr' },
      defaults: {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'organisateur@eventpass.fr',
        password: orgaPassword,
        role: 'ORGANIZER',
        isActive: true,
      },
    });
    console.log(`✅ Organisateur : ${organisateur.email}`);

    const [visiteur] = await User.findOrCreate({
      where: { email: 'visiteur@eventpass.fr' },
      defaults: {
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'visiteur@eventpass.fr',
        password: visitorPassword,
        role: 'VISITOR',
        isActive: true,
      },
    });
    console.log(`✅ Visiteur : ${visiteur.email}`);

    const [agent] = await User.findOrCreate({
      where: { email: 'agent@eventpass.fr' },
      defaults: {
        firstName: 'Pierre',
        lastName: 'Durand',
        email: 'agent@eventpass.fr',
        password: agentPassword,
        role: 'AGENT',
        isActive: true,
      },
    });
    console.log(`✅ Agent : ${agent.email}`);

    // ─── Événements de démonstration ───────────────────────────────────
    const [event1] = await Event.findOrCreate({
      where: { title: 'Rock en Seine 2026' },
      defaults: {
        title: 'Rock en Seine 2026',
        description: 'Le plus grand festival rock de la région parisienne revient pour une édition exceptionnelle. Trois jours de musique au Domaine national de Saint-Cloud.',
        category: 'FESTIVAL',
        date: new Date('2026-08-28T14:00:00'),
        venue: 'Domaine national de Saint-Cloud',
        address: '92210 Saint-Cloud, France',
        capacity: 5000,
        price: 89.00,
        status: 'PUBLISHED',
        organizerId: organisateur.id,
      },
    });
    console.log(`✅ Événement : ${event1.title}`);

    const [event2] = await Event.findOrCreate({
      where: { title: 'PSG vs Marseille — Ligue 1' },
      defaults: {
        title: 'PSG vs Marseille — Ligue 1',
        description: 'Le classique du football français. Paris Saint-Germain reçoit l\'Olympique de Marseille au Parc des Princes.',
        category: 'MATCH',
        date: new Date('2026-09-15T21:00:00'),
        venue: 'Parc des Princes',
        address: '24 Rue du Commandant Guilbaud, 75016 Paris',
        capacity: 48000,
        price: 45.00,
        status: 'PUBLISHED',
        organizerId: organisateur.id,
      },
    });
    console.log(`✅ Événement : ${event2.title}`);

    const [event3] = await Event.findOrCreate({
      where: { title: 'DevFest Paris 2026' },
      defaults: {
        title: 'DevFest Paris 2026',
        description: 'Conférence tech pour les développeurs. Talks, workshops et networking autour des dernières technologies web, cloud et IA.',
        category: 'CONFERENCE',
        date: new Date('2026-10-10T09:00:00'),
        venue: 'Palais des Congrès',
        address: '2 Place de la Porte Maillot, 75017 Paris',
        capacity: 2000,
        price: 35.00,
        status: 'PUBLISHED',
        organizerId: organisateur.id,
      },
    });
    console.log(`✅ Événement : ${event3.title}`);

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('\n📋 Comptes de démonstration :');
    console.log('   Admin        → admin@eventpass.fr / Admin1234!');
    console.log('   Organisateur → organisateur@eventpass.fr / Orga1234!');
    console.log('   Visiteur     → visiteur@eventpass.fr / Visit1234!');
    console.log('   Agent        → agent@eventpass.fr / Agent1234!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error.message);
    process.exit(1);
  }
};

seed();
