
import { supabase } from '@/integrations/supabase/client';
import { calculateCompletionPercentage, updateCompletionPercentage } from '@/utils/profileCompletionCalculator';

export const createProfileIfNotExists = async (userId: string, userMetadata?: any) => {
  if (!userId) return null;
  
  try {
    console.log('Checking if profile exists for user:', userId);
    // Check if profile exists
    const { data, error } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('id', userId);
    
    if (error) {
      console.error('Error checking profile:', error);
      throw error;
    }
    
    // If no profile exists, create one
    if (!data || data.length === 0) {
      console.log('No profile found, creating new profile for user', userId);
      const newProfile = {
        id: userId,
        profile_completion_percentage: 0,
        first_name: userMetadata?.first_name || '',
        last_name: userMetadata?.last_name || ''
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
    return null;
  }
};

export const getProfileWithCounts = async (userId: string) => {
  if (!userId) return { profile: null, experiencesCount: 0, academicCredentialsCount: 0 };

  try {
    // Get or create profile
    const profile = await createProfileIfNotExists(userId);
    
    if (!profile) {
      throw new Error("Impossible de récupérer ou créer le profil");
    }
    
    // Fetch experiences count
    const { count: expCount, error: countError } = await supabase
      .from('professional_experiences')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (countError) throw countError;
    
    // Fetch academic credentials count
    const { count: acadCount, error: acadError } = await supabase
      .from('academic_credentials')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    if (acadError) throw acadError;
    
    // Calculate and update the completion percentage
    const percentage = calculateCompletionPercentage(profile, expCount || 0, acadCount || 0);
    await updateCompletionPercentage(userId, percentage);
    
    return { 
      profile,
      experiencesCount: expCount || 0, 
      academicCredentialsCount: acadCount || 0,
      completionPercentage: percentage
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
