
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Building, Clock, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ExperienceFormProps {
  initialData?: {
    id?: string;
    job_title?: string;
    company_name?: string;
    job_duration?: string;
    job_description?: string;
  };
  onComplete: () => void;
  onCancel: () => void;
}

const ExperienceForm = ({ initialData, onComplete, onCancel }: ExperienceFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    job_title: initialData?.job_title || "",
    company_name: initialData?.company_name || "",
    job_duration: initialData?.job_duration || "",
    job_description: initialData?.job_description || "",
  });

  const isEditing = !!initialData?.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    if (!formData.job_title.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez saisir l'intitulé du poste",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      if (isEditing && initialData?.id) {
        // Update existing experience
        const { error } = await supabase
          .from("professional_experiences")
          .update({
            job_title: formData.job_title,
            company_name: formData.company_name || null,
            job_duration: formData.job_duration || null,
            job_description: formData.job_description || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id)
          .eq("user_id", user.id);

        if (error) throw error;
        
        toast({
          title: "Expérience mise à jour",
          description: "Votre expérience professionnelle a été mise à jour avec succès.",
        });
      } else {
        // Create new experience
        const { error } = await supabase
          .from("professional_experiences")
          .insert([
            {
              user_id: user.id,
              job_title: formData.job_title,
              company_name: formData.company_name || null,
              job_duration: formData.job_duration || null,
              job_description: formData.job_description || null,
            },
          ]);

        if (error) throw error;
        
        toast({
          title: "Expérience ajoutée",
          description: "Votre expérience professionnelle a été ajoutée avec succès.",
        });
      }
      
      onComplete();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de l'expérience:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-gazouyi-800">
            {isEditing ? "Modifier l'expérience" : "Ajouter une expérience"}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {isEditing 
            ? "Modifiez les détails de votre expérience professionnelle" 
            : "Ajoutez une nouvelle expérience professionnelle à votre profil"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="job_title" className="block text-sm font-medium text-gazouyi-700 mb-1">
              Intitulé du poste *
            </Label>
            <div className="relative">
              <Input
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="Ex: Assistant(e) maternel(le)"
                className="w-full pl-10"
                required
              />
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gazouyi-400" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="company_name" className="block text-sm font-medium text-gazouyi-700 mb-1">
              Nom de l'entreprise
            </Label>
            <div className="relative">
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Ex: Nom de l'entreprise"
                className="w-full pl-10"
              />
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gazouyi-400" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="job_duration" className="block text-sm font-medium text-gazouyi-700 mb-1">
              Durée
            </Label>
            <div className="relative">
              <Input
                id="job_duration"
                name="job_duration"
                value={formData.job_duration}
                onChange={handleChange}
                placeholder="Ex: 2 ans, 6 mois, etc."
                className="w-full pl-10"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gazouyi-400" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="job_description" className="block text-sm font-medium text-gazouyi-700 mb-1">
              Description du poste
            </Label>
            <textarea
              id="job_description"
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Décrivez vos responsabilités et réalisations..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExperienceForm;
