
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
import { CalendarIcon, FileCheck, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFullUrl } from '@/utils/environment';

interface AcademicCredentialFormProps {
  initialData?: {
    id: string;
    credential_type: string;
    title: string;
    institution?: string | null;
    completion_date?: string | null;
    description?: string | null;
    proof_document_url?: string | null;
  };
  onCancel: () => void;
  onSave: () => void;
}

const diplomeOptions = [
  "CAP AEPE",
  "AP - Auxiliaire de Puériculture",
  "Aide Soignant",
  "EJE - Éducateur de Jeunes Enfants",
  "Bac Pro ASSP",
  "Autre"
];

const AcademicCredentialForm = ({ initialData, onCancel, onSave }: AcademicCredentialFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    credential_type: initialData?.credential_type || 'degree',
    title: initialData?.title || '',
    institution: initialData?.institution || '',
    completion_date: initialData?.completion_date ? new Date(initialData.completion_date) : undefined,
    description: initialData?.description || '',
    proof_document_url: initialData?.proof_document_url || '',
  });

  const [filePreview, setFilePreview] = useState<{ name: string; size: string } | null>(
    formData.proof_document_url ? { name: 'Document existant', size: '' } : null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date?: Date) => {
    setFormData({ ...formData, completion_date: date });
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, credential_type: value });
  };

  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Vérifier la taille du fichier (limite à 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille du fichier ne doit pas dépasser 5 Mo.",
        variant: "destructive",
      });
      return;
    }

    // Vérifier le type de fichier (PDF ou images)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non pris en charge",
        description: "Veuillez télécharger un fichier PDF ou une image (JPEG, PNG).",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadLoading(true);
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Télécharger le fichier
      const { error: uploadError, data } = await supabase.storage
        .from('credential_proofs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('credential_proofs')
        .getPublicUrl(filePath);
        
      // Mettre à jour l'état
      setFormData({ ...formData, proof_document_url: publicUrl });
      
      // Afficher l'aperçu du fichier
      const fileSize = (file.size / 1024).toFixed(2) + ' KB';
      setFilePreview({ name: file.name, size: fileSize });
      
      toast({
        title: "Document téléchargé",
        description: "Votre document a été téléchargé avec succès.",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur de téléchargement",
        description: error.message || "Une erreur s'est produite lors du téléchargement du document.",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, proof_document_url: '' });
    setFilePreview(null);
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
        proof_document_url: formData.proof_document_url || null,
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

  // Determine if we should show the diploma dropdown or free text input
  const isDiploma = formData.credential_type === 'degree';

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
        {isDiploma ? (
          <Select
            value={formData.title}
            onValueChange={handleTitleChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez un diplôme" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {diplomeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder={
              formData.credential_type === 'training' 
                ? "Ex: Formation aux premiers secours, BAFA..." 
                : "Ex: HACCP, Certification Montessori..."
            }
          />
        )}
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
      
      {/* Ajout du champ pour télécharger un document */}
      <div className="space-y-2">
        <Label htmlFor="proof_document">Document justificatif (facultatif)</Label>
        {filePreview ? (
          <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
            <FileCheck className="h-5 w-5 text-green-500" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{filePreview.name}</p>
              {filePreview.size && <p className="text-xs text-muted-foreground">{filePreview.size}</p>}
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleRemoveFile}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <label htmlFor="proof_document" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 hover:border-gazouyi-400 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-1 text-sm text-gray-500">
                  <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500">PDF, PNG ou JPG (max. 5MB)</p>
              </div>
              <Input
                id="proof_document"
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                disabled={uploadLoading}
              />
            </label>
          </div>
        )}
        {uploadLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gazouyi-500"></div>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Ajoutez une copie de votre diplôme ou attestation pour renforcer votre profil
        </p>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading || uploadLoading}>
          {loading ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
};

export default AcademicCredentialForm;
