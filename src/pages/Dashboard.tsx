
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfileContent from '@/components/dashboard/ProfileContent';
import CompletionMessage from '@/components/dashboard/CompletionMessage';
import { useProfileManager } from '@/components/dashboard/ProfileManager';

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
    <div className="min-h-screen bg-gazouyi-50">
      <DashboardHeader />

      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gazouyi-900 mb-8">Votre espace personnel</h1>
          
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
      </main>
    </div>
  );
}
