
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, BookOpen, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NextStepsCard() {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-white rounded-xl shadow-md mb-6 border border-gazouyi-100 relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-gazouyi-800 font-semibold">Vos prochaines étapes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-gazouyi-100 p-2 rounded-full mt-1">
              <Share2 className="h-5 w-5 text-gazouyi-600" />
            </div>
            <div>
              <h3 className="font-medium text-gazouyi-800 mb-1">Partagez votre page</h3>
              <p className="text-gazouyi-600 text-sm mb-3">
                Valorisez votre parcours professionnel en partageant votre page avec votre réseau.
              </p>
              <Button 
                variant="outline" 
                className="border-gazouyi-500 text-gazouyi-600 hover:bg-gazouyi-50"
                onClick={() => navigate('/dashboard')}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager ma page
              </Button>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-full mt-1">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gazouyi-800 mb-1">Ateliers Gazouyi gratuits</h3>
              <p className="text-gazouyi-600 text-sm mb-3">
                Participez aux Ateliers Gazouyi gratuits pour enrichir votre profil avec de nouvelles compétences.
              </p>
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => navigate('/workshops')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Découvrir les ateliers
              </Button>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-2 rounded-full mt-1">
              <GraduationCap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gazouyi-800 mb-1">Vous êtes éligible à la VAE !</h3>
              <p className="text-gazouyi-600 text-sm mb-3">
                Une VAE peut vous permettre d'obtenir un nouveau diplôme à ajouter sur votre page et vous ouvrir des portes professionnelles.
              </p>
              <Button 
                variant="outline" 
                className="border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => navigate('/vae')}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                En savoir plus sur la VAE
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
