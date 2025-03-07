
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EyeIcon, Share2, ArrowUpRight, Copy, Lightbulb } from 'lucide-react';
import { getProfileViewCount } from '@/services/publicProfileService';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
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
  const {
    toast
  } = useToast();
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
      const origin = window.location.origin;
      const profileLink = `${origin}/profile/${profileSlug}`;
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
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gazouyi-500"></div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-4">
                  <EyeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gazouyi-800">Statistiques de vues</h3>
                  <p className="text-sm text-gazouyi-500">
                    {viewCount !== null ? `Votre profil a été vu ${viewCount} fois.` : 'Aucune vue pour le moment.'}
                  </p>
                </div>
              </div>
              {profileSlug && (
                <Button 
                  variant="outline" 
                  onClick={handleCopyLink}
                  className="border-gazouyi-300 text-gazouyi-600 hover:bg-gazouyi-50"
                >
                  {isCopied ? (
                    <span className="flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Copié !
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Copy className="h-4 w-4 mr-1" />
                      Copier le lien
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>;
}
