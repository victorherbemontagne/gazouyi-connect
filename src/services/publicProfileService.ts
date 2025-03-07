
import { supabase } from '@/integrations/supabase/client';

export const getPublicProfileBySlug = async (slug: string) => {
  try {
    // Log profile view attempt
    console.log('Fetching profile with slug:', slug);
    
    // Get the profile by slug
    const { data: profile, error: profileError } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('unique_profile_slug', slug)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }
    
    console.log('Profile query result:', profile);
    
    if (!profile) {
      console.log('No profile found with slug:', slug);
      return { profile: null, experiences: [], academicCredentials: [] };
    }
    
    // Check if the profile is public
    if (profile.public_profile_enabled !== true) {
      console.log('Profile exists but is not public, slug:', slug, 'Public status:', profile.public_profile_enabled);
      return { profile: null, experiences: [], academicCredentials: [] };
    }
    
    // Get professional experiences
    const { data: experiences, error: expError } = await supabase
      .from('professional_experiences')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    
    if (expError) {
      console.error('Error fetching experiences:', expError);
      throw expError;
    }
    
    // Get academic credentials
    const { data: academicCredentials, error: acadError } = await supabase
      .from('academic_credentials')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    
    if (acadError) {
      console.error('Error fetching academic credentials:', acadError);
      throw acadError;
    }
    
    // Log profile view (anonymously)
    const { error: viewError } = await supabase
      .from('profile_views')
      .insert({
        profile_id: profile.id,
      });
    
    if (viewError) {
      console.error('Error logging profile view:', viewError);
      // We don't throw here as this is not critical
    }
    
    // Get profile view count
    const { count, error: countError } = await supabase
      .from('profile_views')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);
      
    if (countError) {
      console.error('Error counting profile views:', countError);
      // We don't throw here as this is not critical
    }
    
    console.log('Successfully returning profile data for:', profile.id);
    
    return {
      profile,
      experiences: experiences || [],
      academicCredentials: academicCredentials || [],
      viewCount: count || 0
    };
  } catch (error) {
    console.error('Error in getPublicProfileBySlug:', error);
    throw error;
  }
};

export const getProfileViewCount = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from('profile_views')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', userId);
      
    if (error) {
      console.error('Error counting profile views:', error);
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getProfileViewCount:', error);
    throw error;
  }
};
