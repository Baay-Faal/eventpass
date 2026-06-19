import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Brutalist Hero Section */}
      <section className="relative w-full min-h-[85vh] flex items-center border-b-2 border-brand-black bg-brand-light overflow-hidden">
        
        {/* Un fond très graphique, des lignes diagonales ou de gros blocs */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#111 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[12vw] md:text-8xl font-black uppercase leading-[0.85] text-brand-black mb-8"
            >
              Le Pass.<br />
              <span className="text-brand-red">L'Événement.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-brand-gray font-medium max-w-xl mb-12"
            >
              Achetez vos billets avec une sécurité cryptographique absolue.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link to="/events">
                <Button size="lg" className="w-full sm:w-auto">
                  Découvrir
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Bloc visuel brutaliste (Image ou composition typographique) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 hidden lg:flex justify-end"
          >
            <div className="w-[500px] h-[600px] bg-brand-black relative">
               <div className="absolute inset-4 border-4 border-white flex flex-col justify-between p-8">
                  <div className="text-white text-6xl font-black uppercase break-all leading-none opacity-20">
                    ANTI<br/>FRAUDE<br/>QR<br/>DYNAMIC
                  </div>
                  <div className="text-brand-red text-8xl font-black text-right">
                    #01
                  </div>
               </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Editorial Features Section */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-black uppercase text-brand-black mb-6">Conçu pour l'impact.</h2>
          <div className="w-24 h-2 bg-brand-red"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-20 gap-y-24">
          
          <div className="flex flex-col">
            <div className="text-brand-gray text-xl font-black mb-4">01</div>
            <h3 className="text-3xl font-black uppercase mb-6">Zéro Capture d'écran.</h3>
            <p className="text-lg text-brand-gray leading-relaxed">
              Le QR Code EventPass se renouvelle toutes les minutes grâce à une signature cryptographique avancée. Toute capture d'écran est instantanément rejetée à l'entrée. La fraude disparaît.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="text-brand-gray text-xl font-black mb-4">02</div>
            <h3 className="text-3xl font-black uppercase mb-6">Contrôle Total.</h3>
            <p className="text-lg text-brand-gray leading-relaxed">
              De l'achat à l'entrée, chaque étape est maîtrisée. L'application scanne et valide les billets en temps réel, garantissant une fluidité absolue pour l'organisateur.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
