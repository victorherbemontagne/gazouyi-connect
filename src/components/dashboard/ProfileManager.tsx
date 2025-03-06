
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useProfileManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [experiencesCount, setExperiencesCount] = useState(0);
  const [academicCredentialsCount, setAcademicCredentialsCount] = useState(0);

  const createProfileIfNotExists = async () => {
    if (!user?.id) return null;
    
    try {
      console.log('Checking if profile exists for user:', user.id);
      // Check if profile exists
      const { data, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', user.id);
      
      if (error) {
        console.error('Error checking profile:', error);
        throw error;
      }
      
      // If no profile exists, create one
      if (!data || data.length === 0) {
        console.log('No profile found, creating new profile for user', user.id);
        const newProfile = {
          id: user.id,
          profile_completion_percentage: 0,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || ''
        };
        
        console.log('Inserting new profile:', newProfile);
        const { data: createdProfile, error: insertError } = await supabase
          .from('candidate_profiles')
          .insert([newProfile])
          .select();
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }
        
        console.log('New profile created:', createdProfile);
        return createdProfile?.[0] || null;
      }
      
      console.log('Existing profile found:', data[0]);
      return data[0];
    } catch (error: any) {
      console.error('Error in createProfileIfNotExists:', error.message);
      toast({
        title: "Erreur",
        description: "Impossible de créer votre profil: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const fetchProfileData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log('Fetching profile for user:', user.id);
      
      // Get or create profile
      const profile = await createProfileIfNotExists();
      
      if (!profile) {
        console.error('Failed to get or create profile');
        throw new Error("Impossible de récupérer ou créer le profil");
      }
      
      setProfileData(profile);
      
      // Fetch experiences count
      const { count: expCount, error: countError } = await supabase
        .from('professional_experiences')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (countError) throw countError;
      
      setExperiencesCount(expCount || 0);
      
      // Fetch academic credentials count
      const { count: acadCount, error: acadError } = await supabase
        .from('academic_credentials')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (acadError) throw acadError;
      
      setAcademicCredentialsCount(acadCount || 0);
      
      calculateCompletionPercentage(profile, expCount || 0, acadCount ||1);
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

  const calculateCompletionPercentage = (data: any, experiencesCount: number, academicCredentialsCount: number) => {
    if (!data) return 0;
    
    let completed = 0;
    let total = 0;
    
    // Informations personnelles
    if (data.first_name) completed++;
    if (data.last_name) completed++;
    if (data.city) completed++;
    if (data.department) completed++;
    if (data.profile_photo_url) completed++;
    total += 5;
    
    // Informations professionnelles
    if (data.currently_employed !== null) completed++;
    if (data.currently_employed) {
      if (data.current_job_title) completed++;
      if (data.current_job_duration) completed++;
      if (data.current_job_description) completed++;
      total += 3;
    }
    total += 1;
    
    // Expériences professionnelles
    if (experiencesCount > 0) {
      // Ajouter des points pour chaque expérience, avec un maximum de 3 expériences comptabilisées
      completed += Math.min(experiencesCount, 3);
    }
    total += 3; // On considère que l'idéal est d'avoir au moins 3 expériences
    
    // Informations académiques
    if (academicCredentialsCount > 0) {
      // Ajouter des points pour chaque diplôme/formation, avec un maximum de
      completed += Math.min(academicCredentialsCount, 2);
    }
    total += 2; // On considère que l'idéal est d'avoir au moins 2 diplômes/formations
    
    const percentage = Math.round((completed / total) * 100);
    setCompletionPercentage(percentage);
    
    // Mettre à jour le pourcentage dans la base de données
    updateCompletionPercentage(percentage);
    
    return percentage;
  };

  const updateCompletionPercentage = async (percentage: number) => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('candidate_profiles')
        .update({ profile_completion_percentage: percentage })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error updating completion percentage:', error);
    }
  };

  const handleStepComplete = () => {
    fetchProfileData();
    
    // Passer à l'étape suivante si ce n'est pas la dernière
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      toast({
        title: "Profil complété !",
        description: "Toutes les étapes ont été complétées avec succès.",
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
