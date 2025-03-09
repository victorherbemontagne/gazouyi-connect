import { GraduationCap, Calendar, CheckCircle } from 'lucide-react';
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
export const CredentialsList = ({
  credentials
}: CredentialsListProps) => {
  return <Card className="shadow-md border-none">
      <CardContent className="pt-6">
        <h2 className="flex items-center text-xl font-bold text-gazouyi-800 mb-4">
          <GraduationCap className="h-5 w-5 mr-2 text-custom-primary" />
          Formation et diplômes
        </h2>
        
        {credentials.length > 0 ? <div className="space-y-6">
            {credentials.map(cred => <div key={cred.id} className="border-l-2 border-gazouyi-200 pl-4 pb-2">
                <h3 className="font-semibold text-gazouyi-800 flex items-center">
                  {cred.title}
                  {cred.proof_document_url && <span className="inline-flex items-center ml-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">Vérifié</span>
                    </span>}
                </h3>
                {cred.institution && <p className="text-gazouyi-600">{cred.institution}</p>}
                {cred.completion_date && <p className="text-sm text-gazouyi-500 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(cred.completion_date).getFullYear()}
                  </p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-gazouyi-100 text-gazouyi-700 border-gazouyi-200">
                    {cred.credential_type === 'degree' ? 'Diplôme' : 'Formation'}
                  </Badge>
                </div>
                {cred.description && <p className="text-gazouyi-600 mt-2 text-sm">{cred.description}</p>}
              </div>)}
          </div> : <p className="text-gazouyi-500 italic">Aucun diplôme ou formation ajouté</p>}
        
        <div className="mt-6 text-xs text-gazouyi-500 bg-gazouyi-50 p-3 rounded-md">
          <span className="flex items-center">
            <CheckCircle className="h-3 w-3 text-green-500 mr-1 inline" />
            <span className="text-green-600 font-medium">Vérifié</span>
            <span className="ml-1">signifie que l'utilisateur a fourni un fichier comme preuve</span>
          </span>
        </div>
      </CardContent>
    </Card>;
};