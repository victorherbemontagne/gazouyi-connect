
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface AcademicCredentialFormProps {
  onCancel: () => void;
  onSave: () => void;
  credential?: any;
}

const AcademicCredentialForm = ({ 
  onCancel, 
  onSave,
  credential 
}: AcademicCredentialFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentialType, setCredentialType] = useState<string>(credential?.credential_type || 'degree');
  const [title, setTitle] = useState<string>(credential?.title || '');
  const [institution, setInstitution] = useState<string>(credential?.institution || '');
  const [completionDate, setCompletionDate] = useState<Date | undefined>(
    credential?.completion_date ? new Date(credential.completion_date) : undefined
  );
  const [description, setDescription] = useState<string>(credential?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez saisir l'intitulé du diplôme ou de la formation",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newCredential = {
        user_id: user?.id,
        credential_type: credentialType,
        title,
        institution: institution || null,
        completion_date: completionDate || null,
        description: description || null
      };
      
      let action;
      
      if (credential?.id) {
        // Mise à jour
        action = supabase
          .from('academic_credentials')
          .update(newCredential)
          .eq('id', credential.id);
      } else {
        // Création
        action = supabase
          .from('academic_credentials')
          .insert([newCredential]);
      }
      
      const { error } = await action;
      
      if (error) throw error;
      
      toast({
        title: credential?.id ? "Mis à jour avec succès" : "Ajouté avec succès",
        description: credential?.id 
          ? "Le diplôme ou la formation a été mis à jour." 
          : "Le diplôme ou la formation a été ajouté à votre profil.",
      });
      
      onSave();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le diplôme ou la formation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-md p-4 bg-white">
      <div className="space-y-1">
        <Label htmlFor="credentialType">Type</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            type="button"
            variant={credentialType === 'degree' ? 'default' : 'outline'} 
            onClick={() => setCredentialType('degree')}
            className={credentialType === 'degree' ? 'bg-gazouyi' : ''}
          >
            Diplôme
          </Button>
          <Button 
            type="button"
            variant={credentialType === 'training' ? 'default' : 'outline'} 
            onClick={() => setCredentialType('training')}
            className={credentialType === 'training' ? 'bg-gazouyi' : ''}
          >
            Formation
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="title">Intitulé*</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder={credentialType === 'degree' 
            ? "Ex: CAP Petite Enfance, Éducateur de Jeunes Enfants" 
            : "Ex: Formation premiers secours, Formation Montessori"
          }
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="institution">Établissement / Organisme</Label>
        <Input 
          id="institution" 
          value={institution} 
          onChange={(e) => setInstitution(e.target.value)} 
          placeholder="Nom de l'école, université ou organisme de formation"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="date">Date d'obtention</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !completionDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {completionDate ? (
                format(completionDate, "PPP", { locale: fr })
              ) : (
                <span>Sélectionner une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={completionDate}
              onSelect={setCompletionDate}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Décrivez brièvement votre diplôme ou formation"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⊛</span>
              Enregistrement...
            </>
          ) : (
            credential?.id ? "Mettre à jour" : "Ajouter"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AcademicCredentialForm;
