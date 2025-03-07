
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm from '@/components/PersonalInfoForm';
import ProfessionalInfoForm from '@/components/ProfessionalInfoForm';
import AcademicInfoForm from '@/components/AcademicInfoForm';
import ProfileCompletion from '@/components/ProfileCompletion';
import { UserCircle, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';

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
    { id: 1, name: 'Informations personnelles', icon: UserCircle, completed: completionPercentage >= 30 },
    { id: 2, name: 'Informations professionnelles', icon: Briefcase, completed: completionPercentage >= 60 },
    { id: 3, name: 'Informations académiques', icon: GraduationCap, completed: completionPercentage >= 90 },
  ];

  return (
    <>
      <ProfileCompletion percentage={completionPercentage} />
      
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
      </div>
    </>
  );
}
