import { useState, useEffect } from 'react';
import { Globe, Copy } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getFullUrl } from '@/utils/environment';

interface ProfileVisibilityToggleProps {
  profileData: any;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  fetchProfileData: () => void;
}

const ProfileVisibilityToggle = ({ 
  profileData, 
  isPublic, 
  setIsPublic, 
  fetchProfileData 
}: ProfileVisibilityToggleProps) => {
  const { toast } = useToast();
  const profileSlug = profileData?.unique_profile_slug || '';

  const togglePublicProfile = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({ public_profile_enabled: checked })
        .eq('id', profileData.id);
        
      if (error) throw error;
      
      setIsPublic(checked);
      toast({
        title: checked ? "Profil public activé" : "Profil public désactivé",
        description: checked 
          ? "Votre profil est maintenant visible publiquement."
          : "Votre profil n'est plus visible publiquement.",
      });
      
      fetchProfileData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité du profil: " + error.message,
        variant: "destructive",
      });
    }
  };

  const getPublicProfileUrl = () => {
    return getFullUrl(`profile/${profileSlug}`);
  };

  const handleCopyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(getPublicProfileUrl());
      toast({
        title: "Lien copié !",
        description: "Le lien vers votre profil public a été copié dans votre presse-papier.",
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
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gazouyi-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-gazouyi-600" />
          <h3 className="text-lg font-medium text-gazouyi-800">Visibilité du profil</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="public-profile-switch" className="text-sm text-gazouyi-600">
            {isPublic ? 'Profil public' : 'Profil privé'}
          </Label>
          <Switch 
            id="public-profile-switch" 
            checked={isPublic}
            onCheckedChange={togglePublicProfile}
          />
        </div>
      </div>
      
      {isPublic && profileSlug && (
        <div className="mt-4 pt-4 border-t border-gazouyi-100">
          <p className="text-sm text-gazouyi-600 mb-2">
            Partagez votre profil professionnel avec ce lien :
          </p>
          <div className="flex items-center">
            <div className="flex-1 bg-gazouyi-50 rounded-l-md border border-r-0 border-gazouyi-200 p-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gazouyi-500">
              {getPublicProfileUrl()}
            </div>
            <Button 
              type="button" 
              onClick={handleCopyProfileLink}
              className="rounded-l-none bg-gazouyi-600 hover:bg-gazouyi-700"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copier
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileVisibilityToggle;
