
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getProfileWithCounts } from '@/services/profileService';

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
    // Récupérer les données à jour avant de procéder
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
