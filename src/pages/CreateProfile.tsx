
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/Button";

const CreateProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    location: "",
    experience: "",
    skills: "",
    education: "",
    bio: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normally we would send this data to a backend
    console.log("Form submitted:", formData);
    
    toast({
      title: "Profil créé avec succès",
      description: "Votre page professionnelle a été créée.",
    });
    
    // In a real app, we would redirect to the created profile
    // For now, just go back to home
    navigate("/");
  };

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center text-gazouyi-600 hover:text-gazouyi-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à l'accueil
      </button>
      
      <div className="bg-white rounded-xl shadow-sm border border-gazouyi-100 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gazouyi-900 mb-6">
          Créez votre page professionnelle
        </h1>
        
        <p className="text-gazouyi-600 mb-8">
          Remplissez ce formulaire pour créer votre page professionnelle et mettre en avant vos compétences
          dans le domaine de la petite enfance.
        </p>
        
        <form onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit} className="space-y-6">
          {currentStep === 1 ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gazouyi-200 rounded-lg focus:ring-2 focus:ring-gazouyi-300 focus:border-gazouyi-300 transition-colors"
                  placeholder="marie.dupont@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gazouyi-200 rounded-lg focus:ring-2 focus:ring-gazouyi-300 focus:border-gazouyi-300 transition-colors"
                  placeholder="Dupont"
                />
              </div>
              
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gazouyi-200 rounded-lg focus:ring-2 focus:ring-gazouyi-300 focus:border-gazouyi-300 transition-colors"
                  placeholder="Marie"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Titre professionnel
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gazouyi-200 rounded-lg focus:ring-2 focus:ring-gazouyi-300 focus:border-gazouyi-300 transition-colors"
                  placeholder="Assistante maternelle"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Localisation
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gazouyi-200 rounded-lg focus:ring-2 focus:ring-gazouyi-300 focus:border-gazouyi-300 transition-colors"
                  placeholder="Paris, France"
                />
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Années d'expérience
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="text"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gazouyi-200 rounded-lg focus:ring-2 focus:ring-gazouyi-300 focus:border-gazouyi-300 transition-colors"
                  placeholder="5 ans"
                />
              </div>
              
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Compétences clés
                </label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  required
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gazouyi-200 rounded-lg focus:ring-2 focus:ring-gazouyi-300 focus:border-gazouyi-300 transition-colors"
                  placeholder="Éveil, développement moteur, alimentation..."
                />
              </div>
              
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Formation
                </label>
                <input
                  id="education"
                  name="education"
                  type="text"
                  required
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gazouyi-200 rounded-lg focus:ring-2 focus:ring-gazouyi-300 focus:border-gazouyi-300 transition-colors"
                  placeholder="CAP Petite Enfance"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gazouyi-700 mb-1">
                  Présentation professionnelle
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  required
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gazouyi-200 rounded-lg focus:ring-2 focus:ring-gazouyi-300 focus:border-gazouyi-300 transition-colors"
                  placeholder="Décrivez votre parcours et votre approche professionnelle..."
                />
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <Button type="submit" className="w-full justify-center text-base">
              {currentStep === 1 ? "Suivant" : "Créer ma page professionnelle"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
