
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfileContent from '@/components/dashboard/ProfileContent';
import CompletionMessage from '@/components/dashboard/CompletionMessage';
import { useProfileManager } from '@/components/dashboard/ProfileManager';
import { CircleUserRound, Award } from 'lucide-react';
import Footer from '@/components/Footer';
import ProfileViewsCard from '@/components/dashboard/ProfileViewsCard';

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ProfileViewsCard 
              userId={profileData?.id || ''} 
              isPublic={profileData?.public_profile_enabled || false}
              profileSlug={profileData?.unique_profile_slug}
            />
            
            <div className="bg-white rounded-xl shadow-sm border border-gazouyi-100 p-5 flex items-center hover:shadow-md transition">
              <div className="bg-gazouyi-100 p-3 rounded-full mr-4">
                <Award className="h-6 w-6 text-gazouyi-700" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gazouyi-500">Objectif de vues</h3>
                <p className="text-xl font-semibold">100 vues</p>
                <div className="w-full bg-gazouyi-100 rounded-full h-2 mt-1">
                  <div 
                    className="bg-gradient-to-r from-gazouyi-500 to-custom-accent2 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, ((profileData?.viewCount || 0) / 100) * 100)}%` }}
                  ></div>
                </div>
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
