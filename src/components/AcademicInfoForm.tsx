
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AcademicCredentialItem from './AcademicCredentialItem';
import AcademicCredentialForm from './AcademicCredentialForm';

interface AcademicInfoFormProps {
  initialData: any;
  onComplete: () => void;
  calculateCompletion: () => void;
}

const AcademicInfoForm = ({ onComplete, calculateCompletion }: AcademicInfoFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [academicCredentials, setAcademicCredentials] = useState<any[]>([]);
  const [isAddingCredential, setIsAddingCredential] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAcademicCredentials();
    }
  }, [user]);

  const fetchAcademicCredentials = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('academic_credentials')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setAcademicCredentials(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des diplômes et formations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos diplômes et formations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialAdded = () => {
    fetchAcademicCredentials();
    setIsAddingCredential(false);
    calculateCompletion();
  };

  const handleCredentialDeleted = async (id: string) => {
    try {
      const { error } = await supabase
        .from('academic_credentials')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Supprimé avec succès",
        description: "Le diplôme ou la formation a été supprimé.",
      });
      
      fetchAcademicCredentials();
      calculateCompletion();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le diplôme ou la formation.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Vos diplômes et formations</h3>
        <p className="text-sm text-gray-500">
          Ajoutez vos diplômes en lien avec la petite enfance et vos formations professionnelles.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gazouyi-500"></div>
        </div>
      ) : (
        <>
          {academicCredentials.length > 0 ? (
            <div className="space-y-4">
              {academicCredentials.map((credential) => (
                <AcademicCredentialItem 
                  key={credential.id}
                  credential={credential}
                  onDelete={() => handleCredentialDeleted(credential.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-md">
              <p className="text-sm text-gray-500">
                Vous n'avez pas encore ajouté de diplôme ou de formation.
              </p>
            </div>
          )}

          {isAddingCredential ? (
            <AcademicCredentialForm 
              onCancel={() => setIsAddingCredential(false)}
              onSave={handleCredentialAdded}
            />
          ) : (
            <Button 
              type="button" 
              onClick={() => setIsAddingCredential(true)}
              className="bg-gazouyi-100 text-gazouyi-800 hover:bg-gazouyi-200"
            >
              Ajouter un diplôme ou une formation
            </Button>
          )}

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button type="button" onClick={handleSubmit}>
              Terminer cette étape
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AcademicInfoForm;
