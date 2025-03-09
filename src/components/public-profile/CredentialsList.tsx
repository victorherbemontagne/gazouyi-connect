
import { GraduationCap, Calendar, FileCheck, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AcademicCredential {
  id: string;
  credential_type: string;
  title: string;
  institution: string | null;
  completion_date: string | null;
  description: string | null;
  proof_document_url: string | null;
}

interface CredentialsListProps {
  credentials: AcademicCredential[];
}

export const CredentialsList = ({ credentials }: CredentialsListProps) => {
  return (
    <Card className="shadow-md border-none">
      <CardContent className="pt-6">
        <h2 className="flex items-center text-xl font-bold text-gazouyi-800 mb-4">
          <GraduationCap className="h-5 w-5 mr-2 text-custom-primary" />
          Formation et diplômes
        </h2>
        
        {credentials.length > 0 ? (
          <div className="space-y-6">
            {credentials.map((cred) => (
              <div key={cred.id} className="border-l-2 border-gazouyi-200 pl-4 pb-2">
                <h3 className="font-semibold text-gazouyi-800 flex items-center">
                  {cred.title}
                  {cred.proof_document_url && (
                    <span className="inline-flex items-center ml-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">Vérifié</span>
                    </span>
                  )}
                </h3>
                {cred.institution && (
                  <p className="text-gazouyi-600">{cred.institution}</p>
                )}
                {cred.completion_date && (
                  <p className="text-sm text-gazouyi-500 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(cred.completion_date).getFullYear()}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-gazouyi-100 text-gazouyi-700 border-gazouyi-200">
                    {cred.credential_type === 'degree' ? 'Diplôme' : 'Formation'}
                  </Badge>
                  
                  {cred.proof_document_url && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                      <a 
                        href={cred.proof_document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        <FileCheck className="h-3 w-3 mr-1" />
                        Voir le document
                      </a>
                    </Badge>
                  )}
                </div>
                {cred.description && (
                  <p className="text-gazouyi-600 mt-2 text-sm">{cred.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gazouyi-500 italic">Aucun diplôme ou formation ajouté</p>
        )}
      </CardContent>
    </Card>
  );
};
