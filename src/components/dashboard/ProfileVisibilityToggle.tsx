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
  const {
    toast
  } = useToast();
  const profileSlug = profileData?.unique_profile_slug || '';
  const togglePublicProfile = async (checked: boolean) => {
    try {
      const {
        error
      } = await supabase.from('candidate_profiles').update({
        public_profile_enabled: checked
      }).eq('id', profileData.id);
      if (error) throw error;
      setIsPublic(checked);
      toast({
        title: checked ? "Profil public activé" : "Profil public désactivé",
        description: checked ? "Votre profil est maintenant visible publiquement." : "Votre profil n'est plus visible publiquement."
      });
      fetchProfileData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité du profil: " + error.message,
        variant: "destructive"
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
        description: "Le lien vers votre profil public a été copié dans votre presse-papier."
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive"
      });
    }
  };
  return;
};
export default ProfileVisibilityToggle;