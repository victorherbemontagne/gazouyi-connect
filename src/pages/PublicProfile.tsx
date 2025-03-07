
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicProfileBySlug } from '@/services/publicProfileService';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap, MapPin, Calendar, Mail, Phone, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
}

export default function PublicProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [academicCredentials, setAcademicCredentials] = useState<AcademicCredential[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const { profile, experiences, academicCredentials } = await getPublicProfileBySlug(slug);
        
        if (!profile) {
          setError("Ce profil n'existe pas ou n'est pas public");
          return;
        }
        
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

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié !",
        description: "Le lien vers ce profil a été copié dans votre presse-papier.",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gazouyi-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gazouyi-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gazouyi-50 to-white flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-gazouyi-800 mb-4">Profil non disponible</h1>
          <p className="text-gazouyi-600 mb-6">{error || "Ce profil n'existe pas ou n'est pas public."}</p>
          <Button onClick={() => window.location.href = '/'}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gazouyi-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with share button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium text-gazouyi-600">CV Digital</h1>
          <Button variant="outline" size="sm" onClick={handleShareProfile} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Partager ce profil
          </Button>
        </div>
        
        {/* Main profile card */}
        <Card className="mb-8 overflow-hidden border-none shadow-lg">
          {/* Header banner */}
          <div className="h-32 bg-gradient-to-r from-custom-primary to-custom-primary/80"></div>
          
          <div className="relative px-6 pb-6">
            {/* Profile photo */}
            <div className="absolute -top-16 left-6 h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
              {profile.profile_photo_url ? (
                <img 
                  src={profile.profile_photo_url} 
                  alt={fullName} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gazouyi-100">
                  <User className="h-16 w-16 text-gazouyi-400" />
                </div>
              )}
            </div>
            
            {/* Profile info */}
            <div className="pt-20">
              <h1 className="text-3xl font-bold text-gazouyi-900">{fullName}</h1>
              
              {profile.current_job_title && (
                <p className="text-xl text-gazouyi-700 mt-1">{profile.current_job_title}</p>
              )}
              
              <div className="mt-4 space-y-2">
                {(profile.city || profile.department) && (
                  <div className="flex items-center text-gazouyi-600">
                    <MapPin className="h-5 w-5 mr-2 text-gazouyi-500" />
                    <span>{[profile.city, profile.department].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>
              
              {profile.currently_employed && profile.current_job_description && (
                <div className="mt-6">
                  <h2 className="font-medium text-gazouyi-800 mb-2">À propos</h2>
                  <p className="text-gazouyi-600">{profile.current_job_description}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* Two column layout for experiences and education on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professional experiences */}
          <div>
            <Card className="shadow-md border-none">
              <CardContent className="pt-6">
                <h2 className="flex items-center text-xl font-bold text-gazouyi-800 mb-4">
                  <Briefcase className="h-5 w-5 mr-2 text-custom-primary" />
                  Expériences professionnelles
                </h2>
                
                {experiences.length > 0 ? (
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-l-2 border-gazouyi-200 pl-4 pb-2">
                        <h3 className="font-semibold text-gazouyi-800">{exp.job_title}</h3>
                        {exp.company_name && (
                          <p className="text-gazouyi-600">{exp.company_name}</p>
                        )}
                        {exp.job_duration && (
                          <p className="text-sm text-gazouyi-500 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {exp.job_duration}
                          </p>
                        )}
                        {exp.job_description && (
                          <p className="text-gazouyi-600 mt-2 text-sm">{exp.job_description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gazouyi-500 italic">Aucune expérience professionnelle ajoutée</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Academic credentials */}
          <div>
            <Card className="shadow-md border-none">
              <CardContent className="pt-6">
                <h2 className="flex items-center text-xl font-bold text-gazouyi-800 mb-4">
                  <GraduationCap className="h-5 w-5 mr-2 text-custom-primary" />
                  Formation et diplômes
                </h2>
                
                {academicCredentials.length > 0 ? (
                  <div className="space-y-6">
                    {academicCredentials.map((cred) => (
                      <div key={cred.id} className="border-l-2 border-gazouyi-200 pl-4 pb-2">
                        <h3 className="font-semibold text-gazouyi-800">{cred.title}</h3>
                        {cred.institution && (
                          <p className="text-gazouyi-600">{cred.institution}</p>
                        )}
                        {cred.completion_date && (
                          <p className="text-sm text-gazouyi-500 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(cred.completion_date).getFullYear()}
                          </p>
                        )}
                        <p className="text-xs bg-gazouyi-100 text-gazouyi-700 px-2 py-0.5 rounded inline-block mt-2">
                          {cred.credential_type === 'degree' ? 'Diplôme' : 'Formation'}
                        </p>
                        {cred.description && (
                          <p className="text-gazouyi-600 mt-2 text-sm">{cred.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gazouyi-500 italic">Aucun diplôme ou formation ajouté</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-10 text-center text-gazouyi-500 text-sm">
          <p>Profil créé avec Gazouyi Connect</p>
          <a href="/" className="text-gazouyi-600 hover:text-gazouyi-700 underline">Créez votre propre CV digital</a>
        </div>
      </div>
    </div>
  );
}
