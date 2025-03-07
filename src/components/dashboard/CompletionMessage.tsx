
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, Sparkles, CheckCheck, Star, Medal } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CompletionMessage() {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  
  useEffect(() => {
    // Déclencher l'animation après un court délai pour permettre le rendu initial
    const timer = setTimeout(() => setShowCelebration(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  const handleViewProfile = () => {
    // Ici, on naviguerait vers le profil public de l'utilisateur
    // Pour l'instant, redirigeons simplement vers la page d'accueil
    navigate('/');
  };
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-gazouyi-50 border border-green-200 rounded-xl p-8 text-center relative overflow-hidden shadow-md my-6">
      {showCelebration && (
        <>
          <div className="absolute -top-4 left-1/4 animate-bounce delay-100">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="absolute top-10 right-1/4 animate-bounce delay-300">
            <Star className="h-8 w-8 text-gazouyi-400" />
          </div>
          <div className="absolute bottom-0 left-1/3 animate-bounce delay-500">
            <Medal className="h-8 w-8 text-blue-400" />
          </div>
          <div className="absolute bottom-0 right-1/3 animate-bounce delay-700">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
        </>
      )}
      
      <div className={`flex justify-center mb-6 ${showCelebration ? 'animate-scale-in' : ''}`}>
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCheck className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <Badge className={`bg-green-100 text-green-800 hover:bg-green-200 mb-4 py-1.5 px-3 text-sm ${showCelebration ? 'animate-fade-in' : ''}`}>
        Profil complété à 100%
      </Badge>
      
      <h3 className={`text-2xl font-bold text-green-800 mb-3 mt-2 ${showCelebration ? 'animate-fade-in' : ''}`}>
        Félicitations !
      </h3>
      
      <p className={`text-green-700 mb-4 text-lg ${showCelebration ? 'animate-fade-in' : ''}`}>
        Votre profil est complet ! Vous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme.
      </p>
      
      <div className={`bg-white p-4 rounded-lg mb-6 max-w-lg mx-auto border border-green-200 ${showCelebration ? 'animate-fade-in' : ''}`}>
        <p className="text-green-600 text-sm">
          Nous vous recontacterons dès que des offres correspondant à votre profil seront disponibles.
          En attendant, vous pouvez explorer les opportunités sur la plateforme.
        </p>
      </div>
      
      <Button 
        className={`mt-2 bg-green-600 hover:bg-green-700 px-6 py-6 h-auto ${showCelebration ? 'animate-fade-in hover:scale-105 transition-all' : ''}`}
        onClick={handleViewProfile}
      >
        <span className="flex items-center gap-2">
          <CircleCheck className="h-5 w-5" />
          Voir mon profil public
        </span>
      </Button>
    </div>
  );
}
