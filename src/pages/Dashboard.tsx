
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProfileCompletion from '@/components/ProfileCompletion';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ProfessionalInfoForm from '@/components/ProfessionalInfoForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [experiencesCount, setExperiencesCount] = useState(0);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
      const { count, error: countError } = await supabase
        .from('professional_experiences')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (countError) throw countError;
      
      setExperiencesCount(count || 0);
      
      calculateCompletionPercentage(profile, count || 0);
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

  const calculateCompletionPercentage = (data: any, experiencesCount: number) => {
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
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    } else {
      toast({
        title: "Profil complété !",
        description: "Toutes les étapes ont été complétées avec succès.",
      });
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching profile data');
      fetchProfileData();
    } else {
      console.log('No user logged in');
    }
  }, [user]);

  const steps = [
    { id: 1, name: 'Informations personnelles', completed: completionPercentage >= 30 },
    { id: 2, name: 'Informations professionnelles', completed: completionPercentage >= 60 },
  ];

  return (
    <div className="min-h-screen bg-gazouyi-50">
      <header className="py-4 px-6 border-b border-gazouyi-100 bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gazouyi-900">Gazouyi Connect</div>
          <nav className="flex space-x-8 items-center">
            <Button onClick={handleSignOut} variant="outline">
              Déconnexion
            </Button>
          </nav>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gazouyi-900 mb-8">Votre espace personnel</h1>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gazouyi-500"></div>
            </div>
          ) : (
            <>
              <ProfileCompletion percentage={completionPercentage} />
              
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <Tabs defaultValue={`step-${activeStep}`} onValueChange={(value) => setActiveStep(parseInt(value.split('-')[1]))}>
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger 
                      value="step-1" 
                      disabled={!steps[0].completed && activeStep !== 1}
                      className={steps[0].completed ? "text-green-500" : ""}
                    >
                      Étape 1: Informations personnelles
                    </TabsTrigger>
                    <TabsTrigger 
                      value="step-2" 
                      disabled={!steps[1].completed && activeStep !== 2 && !steps[0].completed}
                      className={steps[1].completed ? "text-green-500" : ""}
                    >
                      Étape 2: Informations professionnelles
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="step-1" className="mt-0">
                    <PersonalInfoForm 
                      initialData={profileData} 
                      onComplete={handleStepComplete}
                      calculateCompletion={fetchProfileData}
                    />
                  </TabsContent>
                  
                  <TabsContent value="step-2" className="mt-0">
                    <ProfessionalInfoForm 
                      initialData={profileData}
                      onComplete={handleStepComplete}
                      calculateCompletion={fetchProfileData}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              
              {completionPercentage === 100 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Félicitations !</h3>
                  <p className="text-green-700">
                    Votre profil est complet ! Vous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme.
                  </p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Voir mon profil public
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
