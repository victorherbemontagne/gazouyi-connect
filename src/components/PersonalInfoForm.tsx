import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, User, MapPin, Link, Share2, Loader2, GraduationCap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalInfoFormProps {
  initialData: {
    first_name?: string | null;
    last_name?: string | null;
    city?: string | null;
    department?: string | null;
    profile_photo_url?: string | null;
    public_profile_enabled?: boolean | null;
    unique_profile_slug?: string | null;
    vae_in_progress?: boolean | null;
    vae_diploma_type?: string | null;
  };
  onComplete: () => void;
  calculateCompletion: () => void;
}

const PersonalInfoForm = ({ initialData, onComplete, calculateCompletion }: PersonalInfoFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    city: initialData.city || "",
    department: initialData.department || "",
    profile_photo_url: initialData.profile_photo_url || "",
    public_profile_enabled: initialData.public_profile_enabled || false,
    unique_profile_slug: initialData.unique_profile_slug || "",
    vae_in_progress: initialData.vae_in_progress || false,
    vae_diploma_type: initialData.vae_diploma_type || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (value: string) => {
    setFormData({ ...formData, department: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, public_profile_enabled: checked });
  };

  const handleVaeSwitchChange = (checked: boolean) => {
    setFormData({ 
      ...formData, 
      vae_in_progress: checked,
      // Clear diploma type if VAE is disabled
      vae_diploma_type: checked ? formData.vae_diploma_type : "" 
    });
  };

  const handleVaeDiplomaChange = (value: string) => {
    setFormData({ ...formData, vae_diploma_type: value });
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

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user?.id) {
      return;
    }

    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    try {
      setUploadingPhoto(true);
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);

      // Update form data with the new photo URL
      setFormData({
        ...formData,
        profile_photo_url: publicUrl
      });

      toast({
        title: "Photo téléchargée",
        description: "Votre photo de profil a été téléchargée avec succès.",
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erreur",
        description: `Échec du téléchargement de la photo: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
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
          vae_in_progress: formData.vae_in_progress,
          vae_diploma_type: formData.vae_diploma_type,
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

  // Liste des départements français
  const frenchDepartments = [
    { code: "01", name: "Ain" },
    { code: "02", name: "Aisne" },
    { code: "03", name: "Allier" },
    { code: "04", name: "Alpes-de-Haute-Provence" },
    { code: "05", name: "Hautes-Alpes" },
    { code: "06", name: "Alpes-Maritimes" },
    { code: "07", name: "Ardèche" },
    { code: "08", name: "Ardennes" },
    { code: "09", name: "Ariège" },
    { code: "10", name: "Aube" },
    { code: "11", name: "Aude" },
    { code: "12", name: "Aveyron" },
    { code: "13", name: "Bouches-du-Rhône" },
    { code: "14", name: "Calvados" },
    { code: "15", name: "Cantal" },
    { code: "16", name: "Charente" },
    { code: "17", name: "Charente-Maritime" },
    { code: "18", name: "Cher" },
    { code: "19", name: "Corrèze" },
    { code: "2A", name: "Corse-du-Sud" },
    { code: "2B", name: "Haute-Corse" },
    { code: "21", name: "Côte-d'Or" },
    { code: "22", name: "Côtes-d'Armor" },
    { code: "23", name: "Creuse" },
    { code: "24", name: "Dordogne" },
    { code: "25", name: "Doubs" },
    { code: "26", name: "Drôme" },
    { code: "27", name: "Eure" },
    { code: "28", name: "Eure-et-Loir" },
    { code: "29", name: "Finistère" },
    { code: "30", name: "Gard" },
    { code: "31", name: "Haute-Garonne" },
    { code: "32", name: "Gers" },
    { code: "33", name: "Gironde" },
    { code: "34", name: "Hérault" },
    { code: "35", name: "Ille-et-Vilaine" },
    { code: "36", name: "Indre" },
    { code: "37", name: "Indre-et-Loire" },
    { code: "38", name: "Isère" },
    { code: "39", name: "Jura" },
    { code: "40", name: "Landes" },
    { code: "41", name: "Loir-et-Cher" },
    { code: "42", name: "Loire" },
    { code: "43", name: "Haute-Loire" },
    { code: "44", name: "Loire-Atlantique" },
    { code: "45", name: "Loiret" },
    { code: "46", name: "Lot" },
    { code: "47", name: "Lot-et-Garonne" },
    { code: "48", name: "Lozère" },
    { code: "49", name: "Maine-et-Loire" },
    { code: "50", name: "Manche" },
    { code: "51", name: "Marne" },
    { code: "52", name: "Haute-Marne" },
    { code: "53", name: "Mayenne" },
    { code: "54", name: "Meurthe-et-Moselle" },
    { code: "55", name: "Meuse" },
    { code: "56", name: "Morbihan" },
    { code: "57", name: "Moselle" },
    { code: "58", name: "Nièvre" },
    { code: "59", name: "Nord" },
    { code: "60", name: "Oise" },
    { code: "61", name: "Orne" },
    { code: "62", name: "Pas-de-Calais" },
    { code: "63", name: "Puy-de-Dôme" },
    { code: "64", name: "Pyrénées-Atlantiques" },
    { code: "65", name: "Hautes-Pyrénées" },
    { code: "66", name: "Pyrénées-Orientales" },
    { code: "67", name: "Bas-Rhin" },
    { code: "68", name: "Haut-Rhin" },
    { code: "69", name: "Rhône" },
    { code: "70", name: "Haute-Saône" },
    { code: "71", name: "Saône-et-Loire" },
    { code: "72", name: "Sarthe" },
    { code: "73", name: "Savoie" },
    { code: "74", name: "Haute-Savoie" },
    { code: "75", name: "Paris" },
    { code: "76", name: "Seine-Maritime" },
    { code: "77", name: "Seine-et-Marne" },
    { code: "78", name: "Yvelines" },
    { code: "79", name: "Deux-Sèvres" },
    { code: "80", name: "Somme" },
    { code: "81", name: "Tarn" },
    { code: "82", name: "Tarn-et-Garonne" },
    { code: "83", name: "Var" },
    { code: "84", name: "Vaucluse" },
    { code: "85", name: "Vendée" },
    { code: "86", name: "Vienne" },
    { code: "87", name: "Haute-Vienne" },
    { code: "88", name: "Vosges" },
    { code: "89", name: "Yonne" },
    { code: "90", name: "Territoire de Belfort" },
    { code: "91", name: "Essonne" },
    { code: "92", name: "Hauts-de-Seine" },
    { code: "93", name: "Seine-Saint-Denis" },
    { code: "94", name: "Val-de-Marne" },
    { code: "95", name: "Val-d'Oise" },
    { code: "971", name: "Guadeloupe" },
    { code: "972", name: "Martinique" },
    { code: "973", name: "Guyane" },
    { code: "974", name: "La Réunion" },
    { code: "976", name: "Mayotte" },
  ];

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
              <Select 
                value={formData.department} 
                onValueChange={handleDepartmentChange} 
                required
              >
                <SelectTrigger id="department" className="w-full">
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  {frenchDepartments.map((dept) => (
                    <SelectItem key={dept.code} value={dept.code}>
                      {dept.code} - {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* VAE Section */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-start mb-4">
              <div className="mr-2 mt-0.5">
                <GraduationCap className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gazouyi-800">VAE (Validation des Acquis de l'Expérience)</h3>
                <p className="text-sm text-gazouyi-600">Indiquez si vous êtes actuellement en démarche VAE</p>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <Switch 
                id="vae_in_progress" 
                checked={formData.vae_in_progress}
                onCheckedChange={handleVaeSwitchChange}
                className="mr-2"
              />
              <Label htmlFor="vae_in_progress">
                Je suis actuellement en démarche VAE
              </Label>
            </div>
            
            {formData.vae_in_progress && (
              <div className="mt-3 pl-8">
                <label htmlFor="vae_diploma_type" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Diplôme préparé
                </label>
                <Select 
                  value={formData.vae_diploma_type} 
                  onValueChange={handleVaeDiplomaChange}
                  required={formData.vae_in_progress}
                >
                  <SelectTrigger id="vae_diploma_type" className="w-full max-w-md">
                    <SelectValue placeholder="Sélectionner le diplôme préparé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAP_AEPE">CAP AEPE</SelectItem>
                    <SelectItem value="AP">Auxiliaire de Puériculture (AP)</SelectItem>
                    <SelectItem value="EJE">Éducateur de Jeunes Enfants (EJE)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-amber-600">
                  Cette information apparaîtra sur votre profil public sous forme de badge
                </p>
              </div>
            )}
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
              <label 
                htmlFor="photo-upload" 
                className={`ml-5 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${uploadingPhoto ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {uploadingPhoto ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Choisir une photo
                  </>
                )}
                <input 
                  type="file" 
                  id="photo-upload" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleUploadPhoto}
                  disabled={uploadingPhoto}
                />
              </label>
            </div>
            <p className="mt-1 text-xs text-gazouyi-500">
              Formats acceptés: JPG, PNG. Taille max: 5MB
            </p>
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
