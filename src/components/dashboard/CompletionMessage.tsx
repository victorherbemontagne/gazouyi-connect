
import { Button } from '@/components/ui/button';

export default function CompletionMessage() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <h3 className="text-xl font-semibold text-green-800 mb-2">Félicitations !</h3>
      <p className="text-green-700">
        Votre profil est complet ! Vous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme.
      </p>
      <Button className="mt-4 bg-green-600 hover:bg-green-700">
        Voir mon profil public
      </Button>
    </div>
  );
}
