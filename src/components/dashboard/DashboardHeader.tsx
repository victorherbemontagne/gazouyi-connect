
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export default function DashboardHeader() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="py-4 px-6 border-b border-gazouyi-100 bg-white sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/d66888ab-cdcf-4c38-a6e4-85c1c632c6ae.png" 
              alt="Gazouyi Connect Logo" 
              className="h-10 mr-2 cursor-pointer"
            />
          </Link>
        </div>
        <nav className="flex space-x-4 items-center">
          <Button 
            variant="ghost" 
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="flex items-center gap-2 text-gazouyi-700 hover:text-gazouyi-900 hover:bg-gazouyi-50"
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Mon compte</span>
          </Button>
          <Button 
            onClick={handleSignOut} 
            variant="outline"
            className="flex items-center gap-2 border-gazouyi-200 text-gazouyi-700 hover:bg-gazouyi-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Déconnexion</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
