
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ProfessionalInfoForm from '@/components/ProfessionalInfoForm';
import AcademicInfoForm from '@/components/AcademicInfoForm';
import ProfileCompletion from '@/components/ProfileCompletion';
import { UserCircle, Briefcase, GraduationCap, CheckCircle2, Edit2, Globe, Copy, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ProfileViewsCard from './ProfileViewsCard';

interface ProfileContentProps {
  loading: boolean;
  profileData: any;
  completionPercentage: number;
  activeStep: number;
  setActiveStep: (step: number) => void;
  handleStepComplete: () => void;
  fetchProfileData: () => void;
}

export default function ProfileContent({
  loading,
  profileData,
  completionPercentage,
  activeStep,
  setActiveStep,
  handleStepComplete,
  fetchProfileData
}: ProfileContentProps) {
  const [showFormWhenComplete, setShowFormWhenComplete] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [profileSlug, setProfileSlug] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    if (profileData) {
      setIsPublic(profileData.public_profile_enabled || false);
      setProfileSlug(profileData.unique_profile_slug || '');
    }
  }, [profileData]);

  const togglePublicProfile = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({ public_profile_enabled: checked })
        .eq('id', profileData.id);
        
      if (error) throw error;
      
      setIsPublic(checked);
      toast({
        title: checked ? "Profil public activé" : "Profil public désactivé",
        description: checked 
          ? "Votre profil est maintenant visible publiquement."
          : "Votre profil n'est plus visible publiquement.",
      });
      
      fetchProfileData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité du profil: " + error.message,
        variant: "destructive",
      });
    }
  };

  const getPublicProfileUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/profile/${profileSlug}`;
  };

  const handleCopyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(getPublicProfileUrl());
      toast({
        title: "Lien copié !",
        description: "Le lien vers votre profil public a été copié dans votre presse-papier.",
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
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gazouyi-500"></div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Informations personnelles', icon: UserCircle, completed: completionPercentage >= 30 },
    { id: 2, name: 'Informations professionnelles', icon: Briefcase, completed: completionPercentage >= 60 },
    { id: 3, name: 'Informations académiques', icon: GraduationCap, completed: completionPercentage >= 90 },
  ];

  return (
    <>
      <ProfileCompletion percentage={completionPercentage} />
      
      {/* Public Profile Toggle */}
      {completionPercentage === 100 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gazouyi-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-gazouyi-600" />
              <h3 className="text-lg font-medium text-gazouyi-800">Visibilité du profil</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="public-profile-switch" className="text-sm text-gazouyi-600">
                {isPublic ? 'Profil public' : 'Profil privé'}
              </Label>
              <Switch 
                id="public-profile-switch" 
                checked={isPublic}
                onCheckedChange={togglePublicProfile}
              />
            </div>
          </div>
          
          {isPublic && profileSlug && (
            <div className="mt-4 pt-4 border-t border-gazouyi-100">
              <p className="text-sm text-gazouyi-600 mb-2">
                Partagez votre profil professionnel avec ce lien :
              </p>
              <div className="flex items-center">
                <div className="flex-1 bg-gazouyi-50 rounded-l-md border border-r-0 border-gazouyi-200 p-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gazouyi-500">
                  {getPublicProfileUrl()}
                </div>
                <Button 
                  type="button" 
                  onClick={handleCopyProfileLink}
                  className="rounded-l-none bg-gazouyi-600 hover:bg-gazouyi-700"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copier
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Profile Views Card */}
      {completionPercentage === 100 && profileData && (
        <div className="mb-6">
          <ProfileViewsCard 
            userId={profileData.id} 
            isPublic={isPublic}
          />
        </div>
      )}
      
      {/* Show edit button when profile is complete and form is hidden */}
      {completionPercentage === 100 && !showFormWhenComplete && (
        <div className="text-center mb-8">
          <Button 
            onClick={() => setShowFormWhenComplete(true)}
            className="bg-green-600 hover:bg-green-700 transition-all"
          >
            <span className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Modifier mes informations
            </span>
          </Button>
        </div>
      )}
      
      {/* Show the form if profile is not complete OR user clicked the edit button */}
      {(completionPercentage < 100 || showFormWhenComplete) && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gazouyi-100">
          <Tabs defaultValue={`step-${activeStep}`} onValueChange={(value) => setActiveStep(parseInt(value.split('-')[1]))}>
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-gazouyi-50 p-1 rounded-lg gap-2">
              {steps.map((step) => (
                <TabsTrigger 
                  key={step.id}
                  value={`step-${step.id}`} 
                  disabled={!step.completed && activeStep !== step.id && (step.id > 1 && !steps[step.id-2].completed)}
                  className={`flex items-center gap-2 ${
                    step.completed ? "data-[state=active]:bg-white text-green-600" : "data-[state=active]:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                    <span className="hidden md:inline">{step.name}</span>
                    <span className="inline md:hidden">Étape {step.id}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="step-1" className="mt-0 animate-fade-in">
              <PersonalInfoForm 
                initialData={profileData} 
                onComplete={handleStepComplete}
                calculateCompletion={fetchProfileData}
              />
            </TabsContent>
            
            <TabsContent value="step-2" className="mt-0 animate-fade-in">
              <ProfessionalInfoForm 
                initialData={profileData}
                onComplete={handleStepComplete}
                calculateCompletion={fetchProfileData}
              />
            </TabsContent>
            
            <TabsContent value="step-3" className="mt-0 animate-fade-in">
              <AcademicInfoForm 
                initialData={profileData}
                onComplete={handleStepComplete}
                calculateCompletion={fetchProfileData}
              />
            </TabsContent>
          </Tabs>
          
          {/* Show close button if in editing mode after completion */}
          {completionPercentage === 100 && showFormWhenComplete && (
            <div className="text-center mt-6">
              <Button 
                onClick={() => setShowFormWhenComplete(false)}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Masquer le formulaire
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
