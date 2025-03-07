
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EyeIcon } from 'lucide-react';
import { getProfileViewCount } from '@/services/publicProfileService';
import { useToast } from '@/hooks/use-toast';

interface ProfileViewsCardProps {
  userId: string;
  isPublic: boolean;
}

export default function ProfileViewsCard({ userId, isPublic }: ProfileViewsCardProps) {
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
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
  );
}
