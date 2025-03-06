
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface ProfileCompletionProps {
  percentage: number;
}

const ProfileCompletion = ({ percentage }: ProfileCompletionProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gazouyi-800">Complétez votre profil</h3>
        <span className="text-gazouyi-600 font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-gazouyi-100" />
      
      <div className="mt-4 text-sm text-gazouyi-600">
        {progress < 30 && "Démarrez en ajoutant vos informations personnelles"}
        {progress >= 30 && progress < 60 && "Vous avancez bien ! Continuez avec vos informations professionnelles"}
        {progress >= 60 && progress < 100 && "Presque terminé !"}
        {progress === 100 && "Félicitations ! Votre profil est complet"}
      </div>
    </div>
  );
};

export default ProfileCompletion;
