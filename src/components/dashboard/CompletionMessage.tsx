
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, Sparkles } from 'lucide-react';
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
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center relative overflow-hidden">
      {showCelebration && (
        <>
          <div className="absolute -top-4 left-1/4 animate-bounce delay-100">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="absolute -top-4 right-1/4 animate-bounce delay-300">
            <Sparkles className="h-8 w-8 text-green-400" />
          </div>
          <div className="absolute bottom-0 left-1/3 animate-bounce delay-500">
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
          <div className="absolute bottom-0 right-1/3 animate-bounce delay-700">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
        </>
      )}
      
      <div className={`flex justify-center mb-3 ${showCelebration ? 'animate-scale-in' : ''}`}>
        <CircleCheck className="h-12 w-12 text-green-600" />
      </div>
      
      <Badge className={`bg-green-100 text-green-800 hover:bg-green-200 mb-2 ${showCelebration ? 'animate-fade-in' : ''}`}>
        Profil complété à 100%
      </Badge>
      
      <h3 className={`text-xl font-semibold text-green-800 mb-2 mt-2 ${showCelebration ? 'animate-fade-in' : ''}`}>
        Félicitations !
      </h3>
      
      <p className={`text-green-700 mb-2 ${showCelebration ? 'animate-fade-in' : ''}`}>
        Votre profil est complet ! Vous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme.
      </p>
      
      <p className={`text-green-600 text-sm mb-4 ${showCelebration ? 'animate-fade-in' : ''}`}>
        Nous vous recontacterons dès que des offres correspondant à votre profil seront disponibles.
      </p>
      
      <Button 
        className={`mt-2 bg-green-600 hover:bg-green-700 ${showCelebration ? 'animate-fade-in hover-scale' : ''}`}
        onClick={handleViewProfile}
      >
        Voir mon profil public
      </Button>
    </div>
  );
}
