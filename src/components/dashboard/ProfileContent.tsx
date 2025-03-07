
import { useState, useEffect } from 'react';
import ProfileCompletion from '@/components/ProfileCompletion';
import ProfileViewsCard from './ProfileViewsCard';
import ProfileVisibilityToggle from './ProfileVisibilityToggle';
import ProfileFormTabs from './ProfileFormTabs';

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
  
  useEffect(() => {
    if (profileData) {
      setIsPublic(profileData.public_profile_enabled || false);
    }
  }, [profileData]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gazouyi-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Only show ProfileCompletion when profile is not complete or when in edit mode */}
      {(completionPercentage < 100 || showFormWhenComplete) && (
        <ProfileCompletion 
          percentage={completionPercentage} 
          onEditClick={completionPercentage === 100 ? () => setShowFormWhenComplete(true) : undefined}
        />
      )}
      
      {/* Public Profile Toggle */}
      {completionPercentage === 100 && (
        <ProfileVisibilityToggle
          profileData={profileData}
          isPublic={isPublic}
          setIsPublic={setIsPublic}
          fetchProfileData={fetchProfileData}
        />
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
      
      {/* Show the form if profile is not complete OR user clicked the edit button */}
      {(completionPercentage < 100 || showFormWhenComplete) && (
        <ProfileFormTabs
          profileData={profileData}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          handleStepComplete={handleStepComplete}
          fetchProfileData={fetchProfileData}
          completionPercentage={completionPercentage}
          showFormWhenComplete={showFormWhenComplete}
          setShowFormWhenComplete={setShowFormWhenComplete}
        />
      )}
    </>
  );
}
