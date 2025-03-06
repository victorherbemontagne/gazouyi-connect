
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AcademicCredentialItemProps {
  credential: {
    id: string;
    credential_type: string;
    title: string;
    institution: string | null;
    completion_date: string | null;
    description: string | null;
  };
  onDelete: () => void;
}

const AcademicCredentialItem = ({ credential, onDelete }: AcademicCredentialItemProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch (error) {
      console.error('Date format error:', error);
      return dateString;
    }
  };

  const getCredentialTypeLabel = (type: string) => {
    return type === 'degree' ? 'Diplôme' : 'Formation';
  };

  return (
    <div className="bg-white border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 text-xs rounded-full bg-gazouyi-100 text-gazouyi-800">
              {getCredentialTypeLabel(credential.credential_type)}
            </span>
            {credential.completion_date && (
              <span className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(credential.completion_date)}
              </span>
            )}
          </div>
          
          <h4 className="font-medium text-base">{credential.title}</h4>
          
          {credential.institution && (
            <p className="text-sm text-gray-700 mt-1">{credential.institution}</p>
          )}
          
          {credential.description && (
            <p className="text-sm text-gray-600 mt-2">{credential.description}</p>
          )}
        </div>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela supprimera définitivement 
                ce diplôme ou cette formation de votre profil.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AcademicCredentialItem;
