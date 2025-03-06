
import { Check, Circle } from "lucide-react";

interface ProfileStepsProps {
  currentStep: number;
  steps: Array<{ id: number; name: string; completed: boolean }>;
  onSelectStep: (step: number) => void;
}

const ProfileSteps = ({ currentStep, steps, onSelectStep }: ProfileStepsProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <button
              onClick={() => onSelectStep(step.id)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step.completed
                  ? "border-green-500 bg-green-50 text-green-500"
                  : currentStep === step.id
                  ? "border-gazouyi-500 bg-gazouyi-50 text-gazouyi-500"
                  : "border-gray-300 bg-white text-gray-400"
              } transition-colors`}
              disabled={!step.completed && step.id !== currentStep}
            >
              {step.completed ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{step.id}</span>
              )}
            </button>
            <span
              className={`mt-2 text-sm font-medium ${
                step.completed
                  ? "text-green-500"
                  : currentStep === step.id
                  ? "text-gazouyi-600"
                  : "text-gray-500"
              }`}
            >
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 h-0.5 w-32 -translate-y-1/2 ${
                  step.completed ? "bg-green-500" : "bg-gray-300"
                }`}
                style={{ left: `${(index + 0.5) * 100}%` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSteps;
