
import { Briefcase, Calendar } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface Experience {
  id: string;
  job_title: string;
  company_name: string | null;
  job_duration: string | null;
  job_description: string | null;
}

interface ExperiencesListProps {
  experiences: Experience[];
}

export const ExperiencesList = ({ experiences }: ExperiencesListProps) => {
  return (
    <Card className="shadow-md border-none">
      <CardContent className="pt-6">
        <h2 className="flex items-center text-xl font-bold text-gazouyi-800 mb-4">
          <Briefcase className="h-5 w-5 mr-2 text-custom-primary" />
          Expériences professionnelles
        </h2>
        
        {experiences.length > 0 ? (
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-gazouyi-200 pl-4 pb-2">
                <h3 className="font-semibold text-gazouyi-800">{exp.job_title}</h3>
                {exp.company_name && (
                  <p className="text-gazouyi-600">{exp.company_name}</p>
                )}
                {exp.job_duration && (
                  <p className="text-sm text-gazouyi-500 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {exp.job_duration}
                  </p>
                )}
                {exp.job_description && (
                  <p className="text-gazouyi-600 mt-2 text-sm">{exp.job_description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gazouyi-500 italic">Aucune expérience professionnelle ajoutée</p>
        )}
      </CardContent>
    </Card>
  );
};
