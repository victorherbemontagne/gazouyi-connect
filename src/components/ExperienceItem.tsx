
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Briefcase } from "lucide-react";

interface Experience {
  id: string;
  job_title: string;
  company_name?: string | null;
  job_duration?: string | null;
  job_description?: string | null;
}

interface ExperienceItemProps {
  experience: Experience;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ExperienceItem = ({ experience, onEdit, onDelete }: ExperienceItemProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-gazouyi-600" />
            <CardTitle className="text-lg text-gazouyi-800">{experience.job_title}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(experience.id)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(experience.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {experience.company_name && (
          <p className="text-sm text-gazouyi-700 mb-1">
            Entreprise: {experience.company_name}
          </p>
        )}
        {experience.job_duration && (
          <p className="text-sm text-gazouyi-700 mb-1">
            Durée: {experience.job_duration}
          </p>
        )}
        {experience.job_description && (
          <div className="mt-2">
            <p className="text-sm text-gazouyi-600">{experience.job_description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceItem;
