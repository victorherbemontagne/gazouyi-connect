
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ProfessionalInfoForm from '@/components/ProfessionalInfoForm';
import AcademicInfoForm from '@/components/AcademicInfoForm';
import ProfileCompletion from '@/components/ProfileCompletion';

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
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gazouyi-500"></div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Informations personnelles', completed: completionPercentage >= 30 },
    { id: 2, name: 'Informations professionnelles', completed: completionPercentage >= 60 },
    { id: 3, name: 'Informations académiques', completed: completionPercentage >= 90 },
  ];

  return (
    <>
      <ProfileCompletion percentage={completionPercentage} />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Tabs defaultValue={`step-${activeStep}`} onValueChange={(value) => setActiveStep(parseInt(value.split('-')[1]))}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
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
            <TabsTrigger 
              value="step-3" 
              disabled={!steps[2].completed && activeStep !== 3 && !steps[1].completed}
              className={steps[2].completed ? "text-green-500" : ""}
            >
              Étape 3: Informations académiques
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
          
          <TabsContent value="step-3" className="mt-0">
            <AcademicInfoForm 
              initialData={profileData}
              onComplete={handleStepComplete}
              calculateCompletion={fetchProfileData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
