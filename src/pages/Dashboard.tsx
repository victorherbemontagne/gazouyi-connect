
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfileContent from '@/components/dashboard/ProfileContent';
import CompletionMessage from '@/components/dashboard/CompletionMessage';
import { useProfileManager } from '@/components/dashboard/ProfileManager';
import { CircleUserRound, Clock, Award, CheckCircle } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    loading,
    profileData,
    completionPercentage,
    activeStep,
    setActiveStep,
    fetchProfileData,
    handleStepComplete
  } = useProfileManager();

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching profile data');
      fetchProfileData();
    } else {
      console.log('No user logged in');
    }
  }, [user]);

  // Determine which steps are completed based on completion percentage
  const step1Completed = completionPercentage >= 30;
  const step2Completed = completionPercentage >= 60;
  const step3Completed = completionPercentage >= 90;
  
  // Calculate how many steps are completed
  const completedStepsCount = [step1Completed, step2Completed, step3Completed].filter(Boolean).length;
  
  // Get appropriate text for current step status
  const getStepStatusText = () => {
    if (completionPercentage === 100) return "Toutes les étapes complétées";
    if (completedStepsCount === 0) return "Étape 1/3";
    return `${completedStepsCount} étape${completedStepsCount > 1 ? 's' : ''} complétée${completedStepsCount > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gazouyi-50 to-white flex flex-col">
      <DashboardHeader />

      <main className="py-10 px-4 md:py-12 flex-grow">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-8 space-x-3">
            <div className="bg-gazouyi-100 p-2 rounded-full">
              <CircleUserRound className="h-6 w-6 text-gazouyi-700" />
            </div>
            <h1 className="text-3xl font-bold text-gazouyi-900 bg-gradient-to-r from-gazouyi-800 to-gazouyi-600 bg-clip-text text-transparent">
              Votre espace personnel
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gazouyi-100 p-5 flex items-center hover:shadow-md transition">
              <div className="bg-gazouyi-100 p-3 rounded-full mr-4">
                <CircleUserRound className="h-6 w-6 text-gazouyi-700" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gazouyi-500">Profil</h3>
                <p className="text-xl font-semibold">{completionPercentage}% complété</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gazouyi-100 p-5 flex items-center hover:shadow-md transition">
              <div className={`p-3 rounded-full mr-4 ${completedStepsCount > 0 ? 'bg-green-100' : 'bg-gazouyi-100'}`}>
                {completedStepsCount > 0 ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Clock className="h-6 w-6 text-gazouyi-700" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gazouyi-500">Étape actuelle</h3>
                <p className="text-xl font-semibold">{getStepStatusText()}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gazouyi-100 p-5 flex items-center hover:shadow-md transition">
              <div className="bg-gazouyi-100 p-3 rounded-full mr-4">
                <Award className="h-6 w-6 text-gazouyi-700" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gazouyi-500">Statut</h3>
                <p className="text-xl font-semibold">
                  {completionPercentage === 100 ? "Profil complet" : "En cours"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <ProfileContent 
              loading={loading}
              profileData={profileData}
              completionPercentage={completionPercentage}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              handleStepComplete={handleStepComplete}
              fetchProfileData={fetchProfileData}
            />
            
            {completionPercentage === 100 && <CompletionMessage />}
          </div>
        </div>
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );
}
