
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { CircleCheck, Circle, Sparkles, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileCompletionProps {
  percentage: number;
  onEditClick?: () => void;
}

const ProfileCompletion = ({ percentage, onEditClick }: ProfileCompletionProps) => {
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
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gazouyi-100 relative overflow-hidden">
      {percentage === 100 && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2 animate-bounce">
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </div>
      )}
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gazouyi-800 flex items-center gap-2">
          <span className="bg-gazouyi-100 p-1.5 rounded-full inline-flex">
            <CircleCheck className="h-4 w-4 text-gazouyi-700" />
          </span>
          Complétez votre profil
        </h3>
        <div className={`text-lg font-bold ${animate ? 'animate-pulse' : ''} ${
          percentage === 100 
            ? 'text-green-600' 
            : percentage >= 60 
              ? 'text-gazouyi-600' 
              : 'text-gazouyi-500'
        }`}>
          {progress}%
        </div>
      </div>
      
      <Progress 
        value={progress} 
        className={`h-3 bg-gazouyi-100 mb-6 rounded-full overflow-hidden ${animate ? 'after:animate-pulse' : ''}`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex items-center p-3 rounded-lg ${
              progress >= step.threshold 
                ? 'bg-green-50 border border-green-100' 
                : 'bg-gazouyi-50 border border-gazouyi-100'
            } transition-all duration-300 ${animate && progress >= step.threshold ? 'scale-105' : ''}`}
          >
            {progress >= step.threshold ? (
              <CircleCheck className={`h-5 w-5 text-green-500 mr-3 flex-shrink-0 ${animate && progress >= step.threshold ? 'animate-pulse' : ''}`} />
            ) : (
              <Circle className="h-5 w-5 text-gazouyi-400 mr-3 flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${progress >= step.threshold ? 'text-green-700' : 'text-gazouyi-700'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      <div className={`mt-4 text-sm p-3 rounded-lg ${
        progress === 100 
          ? 'bg-green-50 text-green-700 border border-green-100' 
          : 'bg-gazouyi-50 text-gazouyi-700 border border-gazouyi-100'
      } ${animate ? 'animate-fade-in' : ''}`}>
        {progress < 30 && "Démarrez en ajoutant vos informations personnelles pour débloquer les autres sections."}
        {progress >= 30 && progress < 60 && "Vous avancez bien ! Continuez avec vos informations professionnelles pour améliorer votre profil."}
        {progress >= 60 && progress < 90 && "Presque terminé ! Ajoutez vos diplômes et formations pour finaliser votre profil."}
        {progress >= 90 && progress < 100 && "Plus que quelques détails à compléter pour finaliser votre profil !"}
        {progress === 100 && "Félicitations ! Votre profil est complet. Vous pourrez maintenant accéder à toutes les fonctionnalités 🎉"}
      </div>
      
      {percentage === 100 && onEditClick && (
        <div className="text-center mt-6">
          <Button 
            onClick={onEditClick}
            className="bg-green-600 hover:bg-green-700 transition-all"
          >
            <span className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Modifier mes informations
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletion;
