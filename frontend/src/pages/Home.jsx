import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { ArrowRight, Ticket, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Brutalist Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center border-b-2 border-brand-black bg-brand-light overflow-hidden">
        
        {/* Grille de fond subtile */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 w-full mt-10 lg:mt-0">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[14vw] lg:text-[7.5rem] font-black uppercase leading-[0.85] text-brand-black mb-8 tracking-tighter"
            >
              Vivez<br />
              <span className="text-brand-red">L'Instant.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-brand-gray font-medium max-w-lg mb-10 leading-relaxed"
            >
              La billetterie nouvelle génération. Fini les fraudes et les faux billets. Accédez aux plus grands événements en toute sécurité.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/events">
                <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 group">
                  Voir les événements
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Image Brutaliste Hero */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full flex justify-end"
          >
            <div className="w-full max-w-[600px] aspect-[4/5] bg-brand-black relative group overflow-hidden border-4 border-brand-black shadow-[12px_12px_0_0_rgba(17,17,17,1)] transition-all hover:shadow-[16px_16px_0_0_rgba(230,57,70,1)]">
              <img 
                src="/images/hero.png" 
                alt="Foule de concert"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90"
              />
              <div className="absolute top-4 left-4 bg-brand-red text-white px-4 py-2 font-black uppercase text-sm tracking-widest">
                En direct
              </div>
              <div className="absolute bottom-4 right-4 bg-white text-brand-black px-4 py-2 font-black uppercase text-sm tracking-widest border-2 border-brand-black">
                100% Sécurisé
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Marquee Banner */}
      <div className="w-full border-b-2 border-brand-black bg-brand-black overflow-hidden flex whitespace-nowrap py-4">
        <div className="animate-marquee inline-block text-white font-black uppercase text-2xl tracking-widest">
          BILLETTERIE SÉCURISÉE • SCANS INSTANTANÉS • ZÉRO FRAUDE • TECHNOLOGIE QR DYNAMIQUE • EXPÉRIENCE PREMIUM •
          BILLETTERIE SÉCURISÉE • SCANS INSTANTANÉS • ZÉRO FRAUDE • TECHNOLOGIE QR DYNAMIQUE • EXPÉRIENCE PREMIUM •
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 lg:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 md:mb-32">
          <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-black uppercase text-brand-black mb-6 leading-none tracking-tighter">
            Conçu pour<br/>l'impact.
          </h2>
          <div className="w-32 h-3 bg-brand-red"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
          
          <div className="flex flex-col group">
            <div className="w-full aspect-square mb-8 overflow-hidden border-2 border-brand-black bg-brand-light">
              <img 
                src="/images/security.png" 
                alt="Sécurité"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck className="text-brand-red" size={32} />
              <h3 className="text-3xl font-black uppercase">Zéro Fraude.</h3>
            </div>
            <p className="text-lg text-brand-gray leading-relaxed font-medium">
              Le QR Code EventPass se renouvelle toutes les minutes. Les captures d'écran sont obsolètes. La revente illégale est impossible.
            </p>
          </div>

          <div className="flex flex-col group lg:mt-20">
            <div className="w-full aspect-square mb-8 overflow-hidden border-2 border-brand-black bg-brand-light">
              <img 
                src="/images/vip.png" 
                alt="Expérience"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Ticket className="text-brand-red" size={32} />
              <h3 className="text-3xl font-black uppercase">L'Élite des Événements.</h3>
            </div>
            <p className="text-lg text-brand-gray leading-relaxed font-medium">
              Des concerts intimistes aux stades bondés, accédez aux meilleures places. Achat fluide en 2 clics et disponibilité instantanée sur votre smartphone.
            </p>
          </div>

          <div className="flex flex-col group">
            <div className="w-full aspect-square mb-8 overflow-hidden border-2 border-brand-black bg-brand-light">
              <img 
                src="/images/scan.png" 
                alt="Rapidité"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Zap className="text-brand-red" size={32} />
              <h3 className="text-3xl font-black uppercase">Contrôle Total.</h3>
            </div>
            <p className="text-lg text-brand-gray leading-relaxed font-medium">
              Les agents scannent à une vitesse éclair. La fluidité à l'entrée garantit une expérience premium dès les premières secondes.
            </p>
          </div>

        </div>
      </section>

      {/* Value Proposition: Visiteurs & Organisateurs */}
      <section className="w-full border-y-2 border-brand-black flex flex-col md:flex-row">
        
        {/* Côté Visiteur */}
        <div className="flex-1 bg-white p-12 md:p-24 border-b-2 md:border-b-0 md:border-r-2 border-brand-black">
          <div className="inline-block bg-brand-black text-white px-4 py-2 font-black uppercase text-sm mb-12">
            Pour les Visiteurs
          </div>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-8 text-brand-black leading-none">
            La fin du billet papier.
          </h2>
          <ul className="space-y-8">
            <li className="flex flex-col gap-2">
              <span className="text-2xl font-black text-brand-red uppercase">01. Impossible à perdre.</span>
              <p className="text-brand-gray font-medium text-lg leading-relaxed">
                Votre billet est stocké en toute sécurité dans votre compte. Oubliez la panique du ticket papier oublié sur la table ou perdu dans la foule.
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-2xl font-black text-brand-red uppercase">02. Fini le vol et l'arnaque.</span>
              <p className="text-brand-gray font-medium text-lg leading-relaxed">
                Fausse revente sur internet ? Impossible. Votre QR code tourne toutes les 60 secondes. Un voleur ne peut rien faire avec une simple capture d'écran.
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-2xl font-black text-brand-red uppercase">03. Zéro file d'attente inutile.</span>
              <p className="text-brand-gray font-medium text-lg leading-relaxed">
                Le scan à l'entrée prend une fraction de seconde. Vous entrez plus vite, vous profitez plus longtemps.
              </p>
            </li>
          </ul>
        </div>

        {/* Côté Organisateur */}
        <div className="flex-1 bg-brand-light p-12 md:p-24">
          <div className="inline-block bg-brand-red text-white px-4 py-2 font-black uppercase text-sm mb-12">
            Pour les Organisateurs
          </div>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-8 text-brand-black leading-none">
            Reprenez le pouvoir.
          </h2>
          <ul className="space-y-8">
            <li className="flex flex-col gap-2">
              <span className="text-2xl font-black text-brand-black uppercase">01. Mort au marché noir.</span>
              <p className="text-brand-gray font-medium text-lg leading-relaxed">
                Mettez fin aux revendeurs illégaux qui gonflent vos prix. Les billets EventPass sont liés au compte de l'acheteur et non duplicables.
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-2xl font-black text-brand-black uppercase">02. Maîtrise financière totale.</span>
              <p className="text-brand-gray font-medium text-lg leading-relaxed">
                Gérez vos tarifs, fixez des prix homologués et suivez vos revenus en temps réel depuis un tableau de bord analytique ultra-précis.
              </p>
            </li>
            <li className="flex flex-col gap-2">
              <span className="text-2xl font-black text-brand-black uppercase">03. Sécurité d'entrée blindée.</span>
              <p className="text-brand-gray font-medium text-lg leading-relaxed">
                Déployez vos agents avec notre application de scan. Vous savez exactement qui est entré, à quelle heure, et stoppez la fraude net.
              </p>
            </li>
          </ul>
        </div>

      </section>

      {/* CTA Section */}
      <section className="w-full bg-brand-black py-32 px-4 sm:px-6 lg:px-8 border-b-8 border-brand-red">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase text-white mb-8 tracking-tighter">
            Prêt à rejoindre le mouvement ?
          </h2>
          <p className="text-xl text-gray-400 font-medium mb-12 max-w-2xl mx-auto">
            Organisateur ou festivalier, rejoignez la billetterie la plus innovante et sécurisée du marché.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/events">
              <Button variant="accent" size="lg" className="w-full sm:w-auto text-lg py-4 px-10">
                Explorer le catalogue
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-lg py-4 px-10 bg-white hover:bg-gray-200 text-brand-black border-none">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
