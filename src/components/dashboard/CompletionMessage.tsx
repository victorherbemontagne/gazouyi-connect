
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CompletionMessage() {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    // Ici, on naviguerait vers le profil public de l'utilisateur
    // Pour l'instant, redirigeons simplement vers la page d'accueil
    navigate('/');
  };
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <h3 className="text-xl font-semibold text-green-800 mb-2">Félicitations !</h3>
      <p className="text-green-700 mb-2">
        Votre profil est complet ! Vous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme.
      </p>
      <p className="text-green-600 text-sm mb-4">
        Nous vous recontacterons dès que des offres correspondant à votre profil seront disponibles.
      </p>
      <Button 
        className="mt-2 bg-green-600 hover:bg-green-700"
        onClick={handleViewProfile}
      >
        Voir mon profil public
      </Button>
    </div>
  );
}
