
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfileContent from '@/components/dashboard/ProfileContent';
import CompletionMessage from '@/components/dashboard/CompletionMessage';
import { useProfileManager } from '@/components/dashboard/ProfileManager';
import { DeleteAccountDialog } from '@/components/dashboard/DeleteAccountDialog';
import { CircleUserRound, Clock, Award } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gazouyi-50 to-white">
      <DashboardHeader />

      <main className="py-10 px-4 md:py-12">
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
              <div className="bg-gazouyi-100 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-gazouyi-700" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gazouyi-500">Étape actuelle</h3>
                <p className="text-xl font-semibold">Étape {activeStep}/3</p>
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
          
          <div className="mt-16 border-t pt-8 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Paramètres du compte</h2>
            <div className="w-full max-w-md">
              <DeleteAccountDialog />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
