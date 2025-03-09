
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileVisibilityToggleProps {
  profileData: any;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  fetchProfileData: () => void;
}

const ProfileVisibilityToggle: React.FC<ProfileVisibilityToggleProps> = ({
  profileData,
  isPublic,
  setIsPublic,
  fetchProfileData,
}) => {
  const { toast } = useToast();

  const handleToggleVisibility = async (checked: boolean) => {
    if (!profileData?.id) return;
    
    try {
      const { error } = await supabase
        .from("candidate_profiles")
        .update({
          public_profile_enabled: checked
        })
        .eq("id", profileData.id);
      
      if (error) throw error;
      
      setIsPublic(checked);
      fetchProfileData();
      
      toast({
        title: checked ? "Profil public activé" : "Profil public désactivé",
        description: checked 
          ? "Votre profil est maintenant visible publiquement." 
          : "Votre profil n'est plus visible publiquement.",
      });
    } catch (error: any) {
      console.error('Error toggling profile visibility:', error);
      toast({
        title: "Erreur",
        description: `Impossible de modifier la visibilité du profil: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="mb-6 border border-gazouyi-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isPublic ? (
              <EyeIcon className="h-5 w-5 text-gazouyi-700" />
            ) : (
              <EyeOffIcon className="h-5 w-5 text-gazouyi-400" />
            )}
            <div>
              <h3 className="text-sm font-medium text-gazouyi-900">Visibilité du profil</h3>
              <p className="text-xs text-gazouyi-500">
                {isPublic 
                  ? "Votre profil est visible publiquement" 
                  : "Votre profil est privé"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="profile-visibility" className="text-xs font-medium">
              {isPublic ? "Visible" : "Privé"}
            </Label>
            <Switch 
              id="profile-visibility" 
              checked={isPublic}
              onCheckedChange={handleToggleVisibility}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileVisibilityToggle;
