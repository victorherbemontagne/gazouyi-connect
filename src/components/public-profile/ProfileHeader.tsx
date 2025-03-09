
import { Share2, Printer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface ProfileHeaderProps {
  handlePrintProfile: () => void;
}

export const ProfileHeader = ({ handlePrintProfile }: ProfileHeaderProps) => {
  const { toast } = useToast();

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié !",
        description: "Le lien vers ce profil a été copié dans votre presse-papier.",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center mb-6 print:hidden">
      <h1 className="text-xl font-medium text-gazouyi-600">CV Digital</h1>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handlePrintProfile} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Imprimer ce CV
        </Button>
        <Button variant="outline" size="sm" onClick={handleShareProfile} className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Partager ce profil
        </Button>
      </div>
    </div>
  );
};
