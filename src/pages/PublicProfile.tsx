
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicProfileBySlug } from '@/services/publicProfileService';
import { ProfileHeader } from '@/components/public-profile/ProfileHeader';
import { ProfileCard } from '@/components/public-profile/ProfileCard';
import { ExperiencesList } from '@/components/public-profile/ExperiencesList';
import { CredentialsList } from '@/components/public-profile/CredentialsList';
import { ProfileFooter } from '@/components/public-profile/ProfileFooter';
import { ErrorState } from '@/components/public-profile/ErrorState';
import { LoadingState } from '@/components/public-profile/LoadingState';

interface Experience {
  id: string;
  job_title: string;
  company_name: string | null;
  job_duration: string | null;
  job_description: string | null;
}

interface AcademicCredential {
  id: string;
  credential_type: string;
  title: string;
  institution: string | null;
  completion_date: string | null;
  description: string | null;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  department: string | null;
  profile_photo_url: string | null;
  currently_employed: boolean | null;
  current_job_title: string | null;
  current_job_duration: string | null;
  current_job_description: string | null;
  public_profile_enabled: boolean | null;
}

export default function PublicProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [academicCredentials, setAcademicCredentials] = useState<AcademicCredential[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!slug) return;
      
      console.log('Attempting to fetch profile with slug:', slug);
      
      try {
        setLoading(true);
        const { profile, experiences, academicCredentials } = await getPublicProfileBySlug(slug);
        
        if (!profile) {
          console.error('Profile not found or not public for slug:', slug);
          setError("Ce profil n'existe pas ou n'est pas public");
          setLoading(false);
          return;
        }
        
        console.log('Successfully loaded profile:', profile.id);
        console.log('Public profile enabled:', profile.public_profile_enabled);
        
        setProfile(profile);
        setExperiences(experiences);
        setAcademicCredentials(academicCredentials);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || "Une erreur est survenue lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [slug]);

  const handlePrintProfile = () => {
    window.print();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !profile) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gazouyi-50 to-white py-10 px-4 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader handlePrintProfile={handlePrintProfile} />
        
        <ProfileCard profile={profile} />
        
        {/* Two column layout for experiences and education on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExperiencesList experiences={experiences} />
          <CredentialsList credentials={academicCredentials} />
        </div>
        
        <ProfileFooter />
      </div>
    </div>
  );
}
