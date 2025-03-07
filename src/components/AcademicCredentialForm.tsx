
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar } from '@/components/ui/calendar';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademicCredentialFormProps {
  initialData?: {
    id: string;
    credential_type: string;
    title: string;
    institution?: string | null;
    completion_date?: string | null;
    description?: string | null;
  };
  onCancel: () => void;
  onSave: () => void;
}

const AcademicCredentialForm = ({ initialData, onCancel, onSave }: AcademicCredentialFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    credential_type: initialData?.credential_type || 'degree',
    title: initialData?.title || '',
    institution: initialData?.institution || '',
    completion_date: initialData?.completion_date ? new Date(initialData.completion_date) : undefined,
    description: initialData?.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date?: Date) => {
    setFormData({ ...formData, completion_date: date });
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, credential_type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Formatter la date au format ISO string pour Supabase
      const formattedData = {
        user_id: user.id,
        credential_type: formData.credential_type,
        title: formData.title,
        institution: formData.institution,
        completion_date: formData.completion_date ? format(formData.completion_date, 'yyyy-MM-dd') : null,
        description: formData.description,
      };
      
      if (initialData?.id) {
        // Update
        const { error } = await supabase
          .from('academic_credentials')
          .update(formattedData)
          .eq('id', initialData.id);
          
        if (error) throw error;
        
        toast({
          title: "Diplôme/formation mis à jour !",
          description: "Votre diplôme ou formation a été modifié avec succès.",
          variant: "default",
        });
      } else {
        // Insert
        const { error } = await supabase
          .from('academic_credentials')
          .insert([formattedData]);
          
        if (error) throw error;
        
        toast({
          title: "Diplôme/formation ajouté !",
          description: "Votre diplôme ou formation a été ajouté avec succès.",
          variant: "default",
        });
      }
      
      onSave();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-md border">
      <div className="space-y-2">
        <Label htmlFor="credential_type">Type</Label>
        <Select 
          defaultValue={formData.credential_type} 
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="degree">Diplôme</SelectItem>
            <SelectItem value="training">Formation</SelectItem>
            <SelectItem value="certification">Certification</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Titre du diplôme / formation</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Ex: CAP Petite Enfance, Formation aux premiers secours..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="institution">Établissement / Organisme</Label>
        <Input
          id="institution"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          placeholder="Nom de l'établissement ou de l'organisme"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="completion_date">Date d'obtention</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.completion_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.completion_date ? (
                format(formData.completion_date, 'dd MMMM yyyy', { locale: fr })
              ) : (
                <span>Sélectionnez une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.completion_date}
              onSelect={handleDateChange}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnelle)</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Décrivez brièvement ce diplôme ou cette formation..."
          rows={4}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
};

export default AcademicCredentialForm;
