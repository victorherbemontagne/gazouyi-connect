
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, Sparkles, CheckCheck, Star, Medal, Edit2, Briefcase, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function CompletionMessage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCelebration, setShowCelebration] = useState(false);
  const [profileSlug, setProfileSlug] = useState<string | null>(null);
  
  useEffect(() => {
    // Déclencher l'animation après un court délai pour permettre le rendu initial
    const timer = setTimeout(() => setShowCelebration(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Fetch the user's profile slug
    const fetchProfileSlug = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('unique_profile_slug')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile slug:', error);
          return;
        }
        
        if (data?.unique_profile_slug) {
          setProfileSlug(data.unique_profile_slug);
        }
      } catch (err) {
        console.error('Failed to fetch profile slug:', err);
      }
    };
    
    fetchProfileSlug();
  }, [user]);
  
  const handleViewProfile = () => {
    if (profileSlug) {
      navigate(`/profile/${profileSlug}`);
    } else {
      // If we can't find the profile slug, just go to the dashboard
      navigate('/dashboard');
    }
  };
  
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-gazouyi-50 border border-green-200 rounded-xl p-8 text-center relative overflow-hidden shadow-md my-6">
      {showCelebration && (
        <>
          <div className="absolute -top-4 left-1/4 animate-bounce delay-100">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="absolute top-10 right-1/4 animate-bounce delay-300">
            <Star className="h-8 w-8 text-gazouyi-400" />
          </div>
          <div className="absolute bottom-0 left-1/3 animate-bounce delay-500">
            <Medal className="h-8 w-8 text-blue-400" />
          </div>
          <div className="absolute bottom-0 right-1/3 animate-bounce delay-700">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
        </>
      )}
      
      <div className={`flex justify-center mb-6 ${showCelebration ? 'animate-scale-in' : ''}`}>
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCheck className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <Badge className={`bg-green-100 text-green-800 hover:bg-green-200 mb-4 py-1.5 px-3 text-sm ${showCelebration ? 'animate-fade-in' : ''}`}>
        Profil complété à 100%
      </Badge>
      
      <h3 className={`text-2xl font-bold text-green-800 mb-3 mt-2 ${showCelebration ? 'animate-fade-in' : ''}`}>
        Félicitations !
      </h3>
      
      <p className={`text-green-700 mb-6 text-lg ${showCelebration ? 'animate-fade-in' : ''}`}>
        Félicitations ! Votre profil est complet. Vous pouvez maintenant le partager, l'améliorer grâce à nos conseils et suivre votre rayonnement.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className={`bg-white p-5 rounded-lg border border-green-200 flex flex-col h-full ${showCelebration ? 'animate-fade-in' : ''}`}>
          <div className="flex items-center gap-2 mb-3 text-green-700">
            <Edit2 className="h-5 w-5" />
            <h4 className="font-medium">Votre profil reste modifiable</h4>
          </div>
          <p className="text-green-600 text-sm mb-4 flex-grow">
            Vous pouvez à tout moment mettre à jour vos informations personnelles, professionnelles et académiques.
          </p>
          <Button 
            variant="outline" 
            className="mt-auto w-full border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => navigate('/dashboard')}
          >
            Modifier mon profil
          </Button>
        </div>
        
        <div className={`bg-white p-5 rounded-lg border border-green-200 flex flex-col h-full ${showCelebration ? 'animate-fade-in delay-100' : ''}`}>
          <div className="flex items-center gap-2 mb-3 text-green-700">
            <Briefcase className="h-5 w-5" />
            <h4 className="font-medium">Enrichir votre profil professionnel</h4>
          </div>
          <p className="text-green-600 text-sm mb-4 flex-grow">
            Participez à un atelier Gazouyi Pro gratuit pour continuer de vous former et ajouter de nouvelles compétences à votre profil.
          </p>
          <Button 
            variant="outline" 
            className="mt-auto w-full border-gazouyi-600 text-gazouyi-600 hover:bg-gazouyi-50"
            onClick={() => window.open('https://www.pro.gazouyi.com/les-ateliers-gazouyi-pro', '_blank')}
          >
            Découvrir les Ateliers Gazouyi
          </Button>
        </div>
        
        <div className={`bg-white p-5 rounded-lg border border-green-200 flex flex-col h-full ${showCelebration ? 'animate-fade-in delay-200' : ''}`}>
          <div className="flex items-center gap-2 mb-3 text-green-700">
            <GraduationCap className="h-5 w-5" />
            <h4 className="font-medium">Faites une VAE pour ajouter un diplôme</h4>
          </div>
          <p className="text-green-600 text-sm mb-4 flex-grow">
            Valorisez votre expérience professionnelle en obtenant un diplôme reconnu grâce à la Validation des Acquis de l'Expérience.
          </p>
          <Button 
            variant="outline" 
            className="mt-auto w-full border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => navigate('/vae')}
          >
            Découvrir la VAE
          </Button>
        </div>
      </div>
      
      <Button 
        className={`mt-2 bg-green-600 hover:bg-green-700 px-6 py-6 h-auto ${showCelebration ? 'animate-fade-in hover:scale-105 transition-all' : ''}`}
        onClick={handleViewProfile}
        disabled={!profileSlug}
      >
        <span className="flex items-center gap-2">
          <CircleCheck className="h-5 w-5" />
          Voir mon profil public
        </span>
      </Button>
    </div>
  );
}
