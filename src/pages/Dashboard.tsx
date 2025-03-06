
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gazouyi-50">
      <header className="py-4 px-6 border-b border-gazouyi-100 bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gazouyi-900">Gazouyi Connect</div>
          <nav className="flex space-x-8 items-center">
            <Button onClick={handleSignOut} variant="outline">
              Déconnexion
            </Button>
          </nav>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gazouyi-900 mb-8">Votre espace personnel</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gazouyi-800 mb-4">Bienvenue !</h2>
            <p className="text-gazouyi-600 mb-4">
              Vous êtes maintenant connecté à votre espace personnel. Ici, vous pourrez créer et gérer votre page professionnelle.
            </p>
            <div className="bg-gazouyi-50 p-4 rounded-md">
              <p className="text-sm text-gazouyi-500">Email : {user?.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gazouyi-800 mb-4">Prochaines étapes</h2>
            <p className="text-gazouyi-600 mb-6">
              Complétez votre profil professionnel en plusieurs étapes pour créer une page qui vous représente.
            </p>
            <Button className="bg-gazouyi-600 hover:bg-gazouyi-700">
              Commencer mon profil
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
