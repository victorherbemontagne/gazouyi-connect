
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Briefcase, Clock } from "lucide-react";

interface ProfessionalInfoFormProps {
  initialData: {
    currently_employed?: boolean | null;
    current_job_title?: string | null;
    current_job_duration?: string | null;
    current_job_description?: string | null;
  };
  onComplete: () => void;
  calculateCompletion: () => void;
}

const ProfessionalInfoForm = ({ initialData, onComplete, calculateCompletion }: ProfessionalInfoFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currently_employed: initialData.currently_employed || false,
    current_job_title: initialData.current_job_title || "",
    current_job_duration: initialData.current_job_duration || "",
    current_job_description: initialData.current_job_description || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, currently_employed: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("candidate_profiles")
        .update({
          currently_employed: formData.currently_employed,
          current_job_title: formData.currently_employed ? formData.current_job_title : null,
          current_job_duration: formData.currently_employed ? formData.current_job_duration : null,
          current_job_description: formData.currently_employed ? formData.current_job_description : null,
        })
        .eq("id", user.id);

      if (error) throw error;
      
      toast({
        title: "Informations enregistrées",
        description: "Vos informations professionnelles ont été mises à jour avec succès.",
      });
      
      calculateCompletion();
      onComplete();
    } catch (error: any) {
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-gazouyi-800">Informations professionnelles</CardTitle>
        <CardDescription>
          Parlez-nous de votre situation professionnelle actuelle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="currently_employed" 
              checked={formData.currently_employed}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="currently_employed">Je travaille actuellement</Label>
          </div>
          
          {formData.currently_employed && (
            <>
              <div className="mt-4">
                <label htmlFor="current_job_title" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Intitulé de votre poste actuel
                </label>
                <div className="relative">
                  <Input
                    id="current_job_title"
                    name="current_job_title"
                    value={formData.current_job_title}
                    onChange={handleChange}
                    placeholder="Ex: Assistant(e) maternel(le)"
                    className="w-full pl-10"
                    required
                  />
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gazouyi-400" />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="current_job_duration" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Depuis combien de temps ?
                </label>
                <div className="relative">
                  <Input
                    id="current_job_duration"
                    name="current_job_duration"
                    value={formData.current_job_duration}
                    onChange={handleChange}
                    placeholder="Ex: 2 ans, 6 mois, etc."
                    className="w-full pl-10"
                    required
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gazouyi-400" />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="current_job_description" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Décrivez brièvement ce que vous y faites
                </label>
                <textarea
                  id="current_job_description"
                  name="current_job_description"
                  value={formData.current_job_description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Décrivez vos responsabilités et réalisations..."
                  required
                />
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Sauvegarder et continuer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfessionalInfoForm;
