
import { supabase } from '@/integrations/supabase/client';

export const calculateCompletionPercentage = (data: any, experiencesCount: number, academicCredentialsCount: number) => {
  if (!data) return 0;
  
  let completed = 0;
  let total = 0;
  
  // Informations personnelles (5 champs à remplir)
  if (data.first_name) completed++;
  if (data.last_name) completed++;
  if (data.city) completed++;
  if (data.department) completed++;
  if (data.profile_photo_url) completed++;
  total += 5;
  
  // Informations professionnelles (4 champs incluant le statut d'emploi actuel)
  if (data.currently_employed !== null) completed++;
  if (data.currently_employed) {
    if (data.current_job_title) completed++;
    if (data.current_job_duration) completed++;
    if (data.current_job_description) completed++;
    total += 3;
  }
  total += 1;
  
  // Expériences professionnelles (au moins 1, idéalement 3)
  const maxExperiences = 3;
  if (experiencesCount > 0) {
    // Ajouter des points pour chaque expérience, avec un maximum de 3
    completed += Math.min(experiencesCount, maxExperiences);
  }
  total += maxExperiences;
  
  // Diplômes et formations (au moins 1, idéalement 2)
  const maxCredentials = 2;
  if (academicCredentialsCount > 0) {
    // Ajouter des points pour chaque diplôme, avec un maximum de 2
    completed += Math.min(academicCredentialsCount, maxCredentials);
  }
  total += maxCredentials;
  
  return Math.round((completed / total) * 100);
};

export const updateCompletionPercentage = async (userId: string, percentage: number) => {
  if (!userId) return;
  
  try {
    await supabase
      .from('candidate_profiles')
      .update({ profile_completion_percentage: percentage })
      .eq('id', userId);
  } catch (error) {
    console.error('Error updating completion percentage:', error);
  }
};
