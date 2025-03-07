
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { CircleCheck, Circle } from "lucide-react";

interface ProfileCompletionProps {
  percentage: number;
}

const ProfileCompletion = ({ percentage }: ProfileCompletionProps) => {
  const [progress, setProgress] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Réinitialiser l'animation lorsque le pourcentage change
    if (percentage !== progress) {
      setAnimate(true);
      
      // Attendre que l'animation soit terminée avant de la réinitialiser
      const timer = setTimeout(() => setAnimate(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [percentage, progress]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Définir les étapes du parcours avec leurs seuils de progression
  const steps = [
    { label: "Informations personnelles", threshold: 30 },
    { label: "Expériences professionnelles", threshold: 60 },
    { label: "Diplômes et formations", threshold: 90 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gazouyi-800">Complétez votre profil</h3>
        <span className={`text-gazouyi-600 font-medium ${animate ? 'animate-scale-in' : ''}`}>{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className={`h-2 bg-gazouyi-100 ${animate ? 'after:animate-pulse' : ''}`}
      />
      
      <div className="mt-6 space-y-3">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex items-center ${progress >= step.threshold ? 'animate-fade-in' : ''}`}
          >
            {progress >= step.threshold ? (
              <CircleCheck className={`h-5 w-5 text-green-500 mr-2 ${animate && progress >= step.threshold ? 'animate-scale-in' : ''}`} />
            ) : (
              <Circle className="h-5 w-5 text-gazouyi-300 mr-2" />
            )}
            <span className={`text-sm ${progress >= step.threshold ? 'text-green-600 font-medium' : 'text-gazouyi-600'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      <div className={`mt-4 text-sm text-gazouyi-600 ${animate ? 'animate-fade-in' : ''}`}>
        {progress < 30 && "Démarrez en ajoutant vos informations personnelles"}
        {progress >= 30 && progress < 60 && "Vous avancez bien ! Continuez avec vos informations professionnelles"}
        {progress >= 60 && progress < 90 && "Presque terminé ! Ajoutez vos diplômes et formations"}
        {progress >= 90 && progress < 100 && "Plus que quelques détails à compléter !"}
        {progress === 100 && "Félicitations ! Votre profil est complet 🎉"}
      </div>
    </div>
  );
};

export default ProfileCompletion;
