
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EyeIcon, Share2, ArrowUpRight, Copy } from 'lucide-react';
import { getProfileViewCount } from '@/services/publicProfileService';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

interface ProfileViewsCardProps {
  userId: string;
  isPublic: boolean;
}

export default function ProfileViewsCard({ userId, isPublic }: ProfileViewsCardProps) {
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
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchViewCount();
  }, [userId, toast]);

  const handleCopyLink = async () => {
    if (!isPublic) return;
    
    try {
      const origin = window.location.origin;
      const profileLink = `${origin}/profile/${profileData?.unique_profile_slug}`;
      await navigator.clipboard.writeText(profileLink);
      
      setIsCopied(true);
      toast({
        title: "Lien copié !",
        description: "Le lien de votre profil a été copié dans votre presse-papier.",
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  if (!isPublic) {
    return (
      <Card className="shadow-sm border border-gazouyi-100">
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
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-sm border border-gazouyi-100">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-4">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gazouyi-800">Statistiques de vues</h3>
              {loading ? (
                <p className="text-sm text-gazouyi-500">Chargement des statistiques...</p>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-gazouyi-900">{viewCount}</p>
                  <p className="text-sm text-gazouyi-500">
                    {viewCount === 1 ? 'visite' : 'visites'} sur votre profil public
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Nouvelle carte de partage avec animation */}
      <Card className="shadow-sm border border-gazouyi-100 overflow-hidden">
        <CardContent className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gazouyi-800 mb-2">Partagez votre profil</h3>
              <p className="text-sm text-gazouyi-600 mb-4">
                Augmentez votre visibilité en partageant votre profil avec votre réseau
              </p>
              <Button 
                onClick={handleCopyLink}
                className="group relative overflow-hidden bg-gazouyi-500 hover:bg-gazouyi-600 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  {isCopied ? (
                    <>
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copier le lien</span>
                    </>
                  )}
                </div>
                <span className="absolute inset-0 bg-custom-primary opacity-0 group-hover:opacity-10 transition-opacity"></span>
              </Button>
            </div>
            <div className="animate-pulse-soft p-3 bg-white rounded-full shadow-md">
              <div className="rounded-full bg-gazouyi-100 p-3">
                <Share2 className="h-6 w-6 text-gazouyi-500" />
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gazouyi-100/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gazouyi-500">Objectif: 100 visites</span>
              <span className="flex items-center text-xs text-gazouyi-500 hover:text-gazouyi-700 transition-colors cursor-pointer">
                Voir les statistiques <ArrowUpRight className="ml-1 h-3 w-3" />
              </span>
            </div>
            <div className="w-full bg-gazouyi-100 rounded-full h-2 mt-1">
              <div 
                className="bg-gradient-to-r from-gazouyi-500 to-custom-accent2 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (viewCount || 0) / 100 * 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
