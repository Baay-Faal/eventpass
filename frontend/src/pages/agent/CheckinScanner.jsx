import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const CheckinScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [processing, setProcessing] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isScanning) return;

    // Configuration du scanner
    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
    };

    // On instancie le scanner
    const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", config, false);
    scannerRef.current = html5QrcodeScanner;

    const onScanSuccess = async (decodedText) => {
      // On stop le scanner dès qu'on a lu un code pour éviter les doubles requêtes
      html5QrcodeScanner.clear();
      setIsScanning(false);
      setProcessing(true);

      try {
        // Envoi au backend pour vérification (HMAC + Timestamp)
        const response = await api.post('/checkin/scan', { payloadStr: decodedText });
        setScanResult({
          success: true,
          message: response.data.message,
          data: response.data.data
        });
      } catch (error) {
        setScanResult({
          success: false,
          message: error.response?.data?.message || 'Erreur lors du scan (Réseau/Serveur).',
          data: null
        });
      } finally {
        setProcessing(false);
      }
    };

    html5QrcodeScanner.render(onScanSuccess, (errorMessage) => {
      // Ignorer les erreurs de lecture continues (cadre vide, etc.)
    });

    return () => {
      // Nettoyage à la fermeture du composant
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Erreur nettoyage scanner", error);
        });
      }
    };
  }, [isScanning]);

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-brand-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 md:p-8 border-4 border-brand-border">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase text-brand-black tracking-tight mb-2">Check-in</h1>
          <div className="w-12 h-2 bg-brand-red mx-auto"></div>
        </div>

        {isScanning ? (
          <div className="scanner-container">
            {/* L'élément où Html5QrcodeScanner va s'injecter */}
            <div id="qr-reader" className="w-full rounded-none overflow-hidden border-2 border-brand-black"></div>
            <p className="text-center text-brand-gray font-bold uppercase mt-6 text-sm tracking-widest">
              Pointez la caméra vers le QR Code EventPass
            </p>
          </div>
        ) : processing ? (
          <div className="text-center py-20">
            <RefreshCw className="w-12 h-12 text-brand-black animate-spin mx-auto mb-4" />
            <h2 className="font-black uppercase tracking-widest text-xl">Vérification...</h2>
          </div>
        ) : (
          <div className="text-center py-8">
            {scanResult?.success ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-24 h-24 text-brand-success mb-6" />
                <h2 className="text-3xl font-black uppercase text-brand-success mb-2">Validé</h2>
                <p className="text-brand-black font-bold uppercase tracking-widest mb-6">Accès Autorisé</p>
                
                <div className="bg-brand-light p-4 w-full border-2 border-brand-border text-left mb-8">
                  <p className="text-sm font-bold uppercase text-brand-gray">Code Billet</p>
                  <p className="font-mono text-xl font-black text-brand-black mb-4">{scanResult.data?.ticket?.code}</p>
                  <p className="text-sm font-bold uppercase text-brand-gray">Bénéficiaire</p>
                  <p className="text-xl font-black text-brand-black uppercase">{scanResult.data?.ticket?.user?.firstName} {scanResult.data?.ticket?.user?.lastName}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-24 h-24 text-brand-error mb-6" />
                <h2 className="text-3xl font-black uppercase text-brand-error mb-2">Rejeté</h2>
                <p className="text-brand-black font-bold uppercase tracking-widest mb-6 px-4">
                  {scanResult?.message}
                </p>
              </div>
            )}

            <Button onClick={resetScanner} size="lg" className="w-full">
              Scanner un autre billet
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckinScanner;
