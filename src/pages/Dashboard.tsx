
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfileContent from '@/components/dashboard/ProfileContent';
import CompletionMessage from '@/components/dashboard/CompletionMessage';
import { useProfileManager } from '@/components/dashboard/ProfileManager';
import { CircleUserRound, Award, EyeIcon, CheckCircle, AlertCircle } from 'lucide-react';
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
            <div className="bg-gazouyi-100 p-2 rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
              {profileData?.profile_photo_url ? (
                <img 
                  src={profileData.profile_photo_url} 
                  alt="Photo de profil" 
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <CircleUserRound className="h-6 w-6 text-gazouyi-700" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gazouyi-900 bg-gradient-to-r from-gazouyi-800 to-gazouyi-600 bg-clip-text text-transparent">
              Votre espace personnel
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Carte 1: Statut de complétion du profil */}
            <div className="bg-white rounded-lg shadow-sm border border-gazouyi-100 p-4 flex items-center hover:shadow-md transition">
              <div className={`p-2 rounded-full mr-3 ${completionPercentage === 100 ? 'bg-green-100' : 'bg-gazouyi-100'}`}>
                {completionPercentage === 100 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gazouyi-600" />
                )}
              </div>
              <div>
                <h3 className="text-xs font-medium text-gazouyi-500">Statut du profil</h3>
                <p className="text-sm font-semibold">
                  {completionPercentage === 100 ? "Profil complet" : `${completionPercentage}% complété`}
                </p>
              </div>
            </div>
            
            {/* Carte 2: Nombre de vues de la page */}
            <div className="bg-white rounded-lg shadow-sm border border-gazouyi-100 p-4 flex items-center hover:shadow-md transition">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <EyeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-gazouyi-500">Visites du profil</h3>
                {profileData?.public_profile_enabled ? (
                  <p className="text-sm font-semibold">{profileData?.profile_views || 0} visites</p>
                ) : (
                  <p className="text-sm font-semibold text-gazouyi-500">Page pas encore publiée</p>
                )}
              </div>
            </div>
            
            {/* Carte 3: Objectif de vues */}
            <div className="bg-white rounded-lg shadow-sm border border-gazouyi-100 p-4 flex items-center hover:shadow-md transition">
              <div className="bg-gazouyi-100 p-2 rounded-full mr-3">
                <Award className="h-5 w-5 text-gazouyi-700" />
              </div>
              <div className="w-full">
                <h3 className="text-xs font-medium text-gazouyi-500">Objectif de vues</h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold">100 vues</p>
                  <span className="text-xs text-gazouyi-500">
                    {profileData?.profile_views || 0}/100
                  </span>
                </div>
                <div className="w-full bg-gazouyi-100 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-gradient-to-r from-gazouyi-500 to-custom-accent2 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, ((profileData?.profile_views || 0) / 100) * 100)}%` }}
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
