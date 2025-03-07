
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, User, MapPin, Link, Share2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PersonalInfoFormProps {
  initialData: {
    first_name?: string | null;
    last_name?: string | null;
    city?: string | null;
    department?: string | null;
    profile_photo_url?: string | null;
    public_profile_enabled?: boolean | null;
    unique_profile_slug?: string | null;
  };
  onComplete: () => void;
  calculateCompletion: () => void;
}

const PersonalInfoForm = ({ initialData, onComplete, calculateCompletion }: PersonalInfoFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    city: initialData.city || "",
    department: initialData.department || "",
    profile_photo_url: initialData.profile_photo_url || "",
    public_profile_enabled: initialData.public_profile_enabled || false,
    unique_profile_slug: initialData.unique_profile_slug || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, public_profile_enabled: checked });
  };

  const getPublicProfileUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/profile/${formData.unique_profile_slug}`;
  };

  const handleCopyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(getPublicProfileUrl());
      toast({
        title: "Lien copié !",
        description: "Le lien vers votre profil public a été copié dans votre presse-papier.",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("candidate_profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          city: formData.city,
          department: formData.department,
          profile_photo_url: formData.profile_photo_url,
          public_profile_enabled: formData.public_profile_enabled,
        })
        .eq("id", user.id);

      if (error) throw error;
      
      toast({
        title: "Informations enregistrées",
        description: "Vos informations personnelles ont été mises à jour avec succès.",
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

  const handleUploadPhoto = async () => {
    // This is a placeholder for photo upload functionality
    // In a real implementation, you would integrate with Supabase Storage
    toast({
      title: "Fonctionnalité à venir",
      description: "L'upload de photo sera disponible prochainement.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-gazouyi-800">Informations personnelles</CardTitle>
        <CardDescription>
          Ces informations seront visibles sur votre profil public
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label htmlFor="first_name" className="block text-sm font-medium text-gazouyi-700 mb-1">
                Prénom
              </label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Votre prénom"
                className="w-full"
                required
              />
            </div>
            <div className="w-full md:w-1/2">
              <label htmlFor="last_name" className="block text-sm font-medium text-gazouyi-700 mb-1">
                Nom
              </label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Votre nom"
                className="w-full"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label htmlFor="city" className="block text-sm font-medium text-gazouyi-700 mb-1">
                Ville de résidence
              </label>
              <div className="relative">
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Votre ville"
                  className="w-full pl-10"
                  required
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gazouyi-400" />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <label htmlFor="department" className="block text-sm font-medium text-gazouyi-700 mb-1">
                Département
              </label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Ex: 75, 92, etc."
                className="w-full"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gazouyi-700 mb-1">
              Photo de profil
            </label>
            <div className="mt-1 flex items-center">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-gazouyi-100 flex items-center justify-center">
                {formData.profile_photo_url ? (
                  <img 
                    src={formData.profile_photo_url} 
                    alt="Photo de profil" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gazouyi-400" />
                )}
              </div>
              <Button 
                type="button" 
                onClick={handleUploadPhoto}
                variant="outline" 
                className="ml-5"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choisir une photo
              </Button>
            </div>
          </div>
          
          {/* Public profile settings */}
          <div className="mt-6 p-4 bg-gazouyi-50 rounded-lg">
            <h3 className="text-lg font-medium text-gazouyi-800 mb-2">Profil public</h3>
            <div className="flex items-center mb-4">
              <Switch 
                id="public_profile_enabled" 
                checked={formData.public_profile_enabled}
                onCheckedChange={handleSwitchChange}
                className="mr-2"
              />
              <Label htmlFor="public_profile_enabled">
                Activer mon profil public
              </Label>
            </div>
            
            {formData.public_profile_enabled && formData.unique_profile_slug && (
              <div className="mt-2">
                <p className="text-sm text-gazouyi-600 mb-2">
                  Partagez votre profil professionnel avec ce lien :
                </p>
                <div className="flex items-center">
                  <div className="flex-1 bg-white rounded-l-md border border-r-0 border-gazouyi-200 p-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm text-gazouyi-500">
                    {getPublicProfileUrl()}
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleCopyProfileLink}
                    className="rounded-l-none bg-gazouyi-600"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Copier
                  </Button>
                </div>
              </div>
            )}
          </div>
          
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

export default PersonalInfoForm;
