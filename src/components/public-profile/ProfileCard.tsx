
import { MapPin } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { ProfilePhoto } from './ProfilePhoto';

interface ProfileCardProps {
  profile: {
    first_name: string | null;
    last_name: string | null;
    city: string | null;
    department: string | null;
    profile_photo_url: string | null;
    currently_employed: boolean | null;
    current_job_title: string | null;
    current_job_description: string | null;
  };
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

  return (
    <Card className="mb-8 overflow-hidden border-none shadow-lg print:shadow-none print:border">
      {/* Header banner */}
      <div className="h-32 bg-gradient-to-r from-custom-primary to-custom-primary/80 print:h-24"></div>
      
      <div className="relative px-6 pb-6">
        <ProfilePhoto photoUrl={profile.profile_photo_url} fullName={fullName} />
        
        {/* Profile info */}
        <div className="pt-20 print:pt-16">
          <h1 className="text-3xl font-bold text-gazouyi-900">{fullName}</h1>
          
          {profile.current_job_title && (
            <p className="text-xl text-gazouyi-700 mt-1">{profile.current_job_title}</p>
          )}
          
          <div className="mt-4 space-y-2">
            {(profile.city || profile.department) && (
              <div className="flex items-center text-gazouyi-600">
                <MapPin className="h-5 w-5 mr-2 text-gazouyi-500" />
                <span>{[profile.city, profile.department].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>
          
          {profile.currently_employed && profile.current_job_description && (
            <div className="mt-6">
              <h2 className="font-medium text-gazouyi-800 mb-2">À propos</h2>
              <p className="text-gazouyi-600">{profile.current_job_description}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
