import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EyeIcon, Share2, ArrowUpRight, Copy, Lightbulb, Check } from 'lucide-react';
import { getProfileViewCount } from '@/services/publicProfileService';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { getFullUrl } from '@/utils/environment';

interface ProfileViewsCardProps {
  userId: string;
  isPublic: boolean;
  profileSlug?: string;
}

export default function ProfileViewsCard({
  userId,
  isPublic,
  profileSlug
}: ProfileViewsCardProps) {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchViewCount = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const count = await getProfileViewCount(userId);
        setViewCount(count);
      } catch (error: any) {
        console.error('Error fetching view count:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les statistiques de vues.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchViewCount();
  }, [userId, toast]);

  const handleCopyLink = async () => {
    if (!isPublic || !profileSlug) return;
    try {
      const profileLink = getFullUrl(`profile/${profileSlug}`);
      await navigator.clipboard.writeText(profileLink);
      setIsCopied(true);
      toast({
        title: "Lien copié !",
        description: "Le lien de votre profil a été copié dans votre presse-papier."
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive"
      });
    }
  };

  if (!isPublic) {
    return <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 mr-4">
              <EyeIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gazouyi-800">Statistiques de vues</h3>
              <p className="text-sm text-gazouyi-500">
                Activez votre profil public pour commencer à voir les statistiques.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>;
  }

  return <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-4">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gazouyi-800">Statistiques de vues</h3>
              <p className="text-sm text-gazouyi-500">
                Suivez combien de personnes visitent votre profil
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="h-12 flex items-center justify-center">
              <p className="text-sm text-gazouyi-500">Chargement des statistiques...</p>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-3 bg-gazouyi-50 rounded-lg">
              <div>
                <p className="text-sm text-gazouyi-600">Total des vues</p>
                <p className="text-2xl font-bold text-gazouyi-800">{viewCount || 0}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleCopyLink}
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {isCopied ? "Copié" : "Copier le lien"}
              </Button>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gazouyi-600 mt-2">
            <Lightbulb className="h-4 w-4" />
            <p>Partagez votre profil pour augmenter votre visibilité.</p>
          </div>
        </div>
      </CardContent>
    </Card>;
}
