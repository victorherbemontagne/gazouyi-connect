
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Briefcase, Clock, Plus } from "lucide-react";
import ExperienceItem from "./ExperienceItem";
import ExperienceForm from "./ExperienceForm";

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

interface Experience {
  id: string;
  job_title: string;
  company_name?: string | null;
  job_duration?: string | null;
  job_description?: string | null;
}

const ProfessionalInfoForm = ({ initialData, onComplete, calculateCompletion }: ProfessionalInfoFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    currently_employed: initialData.currently_employed || false,
    current_job_title: initialData.current_job_title || "",
    current_job_duration: initialData.current_job_duration || "",
    current_job_description: initialData.current_job_description || "",
  });

  const fetchExperiences = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("professional_experiences")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setExperiences(data || []);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des expériences:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos expériences professionnelles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [user]);

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

  const handleAddExperience = () => {
    setCurrentExperience(null);
    setShowExperienceForm(true);
  };

  const handleEditExperience = (id: string) => {
    const expToEdit = experiences.find(exp => exp.id === id);
    if (expToEdit) {
      setCurrentExperience(expToEdit);
      setShowExperienceForm(true);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from("professional_experiences")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      
      // Mettre à jour la liste locale
      setExperiences(experiences.filter(exp => exp.id !== id));
      
      toast({
        title: "Expérience supprimée",
        description: "L'expérience professionnelle a été supprimée avec succès.",
      });
      
      calculateCompletion();
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'expérience:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceComplete = () => {
    fetchExperiences();
    setShowExperienceForm(false);
    calculateCompletion();
  };

  return (
    <>
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="text-gazouyi-800">Situation professionnelle actuelle</CardTitle>
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
                {loading ? "Enregistrement..." : "Sauvegarder"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="w-full mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gazouyi-800">Expériences professionnelles précédentes</CardTitle>
            {!showExperienceForm && (
              <Button onClick={handleAddExperience} variant="outline" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Ajouter une expérience
              </Button>
            )}
          </div>
          <CardDescription>
            Ajoutez vos expériences professionnelles passées pour enrichir votre profil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showExperienceForm ? (
            <ExperienceForm 
              initialData={currentExperience || undefined}
              onComplete={handleExperienceComplete}
              onCancel={() => setShowExperienceForm(false)}
            />
          ) : (
            <>
              {experiences.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gazouyi-500 mb-4">Vous n'avez pas encore ajouté d'expérience professionnelle</p>
                  <Button onClick={handleAddExperience} variant="outline" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Ajouter votre première expérience
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {experiences.map((experience) => (
                    <ExperienceItem
                      key={experience.id}
                      experience={experience}
                      onEdit={handleEditExperience}
                      onDelete={handleDeleteExperience}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button onClick={onComplete}>
          Continuer
        </Button>
      </div>
    </>
  );
};

export default ProfessionalInfoForm;
