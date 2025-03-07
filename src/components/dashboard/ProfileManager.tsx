import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getProfileWithCounts } from '@/services/profileService';
import { supabase } from '@/integrations/supabase/client';

export function useProfileManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  const fetchProfileData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log('Fetching profile for user:', user.id);
      
      const { profile, completionPercentage } = await getProfileWithCounts(user.id);
      
      setProfileData(profile);
      setCompletionPercentage(completionPercentage);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = async () => {
    // Force a refetch of the profile data to ensure we have the most up-to-date completion percentage
    await fetchProfileData();
    
    // Afficher un toast de célébration pour l'étape complétée
    let stepName = "";
    switch (activeStep) {
      case 1:
        stepName = "personnelles";
        break;
      case 2:
        stepName = "professionnelles";
        break;
      case 3:
        stepName = "académiques";
        // When completing the academic step, ensure we set the completion to 100%
        if (completionPercentage >= 90) {
          await updateProfileCompletionTo100();
        }
        break;
    }
    
    toast({
      title: "Étape complétée !",
      description: `Vos informations ${stepName} ont été enregistrées avec succès.`,
      variant: "default",
    });
    
    // Passer à l'étape suivante si ce n'est pas la dernière
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else if (completionPercentage === 100) {
      toast({
        title: "Félicitations !",
        description: "Votre profil est maintenant complet !",
      });
    }
  };

  // New function to ensure completion percentage is set to 100% when academic step is completed
  const updateProfileCompletionTo100 = async () => {
    if (!user?.id) return;
    
    try {
      // Update the completion percentage directly in the database
      const { error } = await supabase
        .from('candidate_profiles')
        .update({ profile_completion_percentage: 100 })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setCompletionPercentage(100);
    } catch (error: any) {
      console.error('Error updating completion percentage:', error.message);
    }
  };

  return {
    loading,
    profileData,
    completionPercentage,
    activeStep,
    setActiveStep,
    fetchProfileData,
    handleStepComplete
  };
}
