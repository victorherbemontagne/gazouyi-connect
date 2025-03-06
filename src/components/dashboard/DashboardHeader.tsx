
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
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
  );
}
