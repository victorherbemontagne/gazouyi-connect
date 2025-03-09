import { useEffect } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import NextStepsCard from "@/components/dashboard/NextStepsCard";
const Index = () => {
  const {
    session
  } = useAuth();
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }, []);
  return <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 border-b border-gazouyi-100 sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <img src="/lovable-uploads/d66888ab-cdcf-4c38-a6e4-85c1c632c6ae.png" alt="Gazouyi Connect Logo" className="h-10 md:h-12" />
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#features" className="text-gazouyi-700 hover:text-gazouyi-900 transition-colors">
              Fonctionnalités
            </a>
            <a href="#" className="text-gazouyi-700 hover:text-gazouyi-900 transition-colors">
              VAE
            </a>
            <Button href={session ? "/dashboard" : "/auth"} icon>
              {session ? "Mon espace" : "Démarrer"}
            </Button>
          </nav>
          <Button href={session ? "/dashboard" : "/auth"} className="md:hidden">
            {session ? "Mon espace" : "Démarrer"}
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <Hero />

        <div className="bg-white py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gazouyi-50/50 to-white -z-10" />
          <div className="max-w-4xl mx-auto text-center section-transition">
            <h2 className="text-3xl md:text-4xl font-bold text-gazouyi-900 mb-6">
              Pourquoi créer votre page professionnelle ?
            </h2>
            <p className="text-lg text-gazouyi-700 mb-12">
              Dans le secteur de la petite enfance, valoriser son parcours et ses compétences 
              est essentiel pour se démarquer. Que ce soit pour une démarche VAE ou pour 
              développer votre visibilité professionnelle, Gazouyi Connect vous accompagne.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <div className="p-6 rounded-xl bg-white border border-gazouyi-100 shadow-md text-left flex-1 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gazouyi-900 mb-3">
                  Pour les candidates à la VAE
                </h3>
                <p className="text-gazouyi-600 mb-4">
                  Mettez en valeur vos expériences professionnelles et facilitez la préparation 
                  de votre dossier de validation des acquis.
                </p>
                <div className="h-1 w-16 bg-gazouyi-300 rounded-full" />
              </div>
              <div className="p-6 rounded-xl bg-white border border-gazouyi-100 shadow-md text-left flex-1 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gazouyi-900 mb-3">
                  Pour toutes les professionnelles
                </h3>
                <p className="text-gazouyi-600 mb-4">
                  Créez votre carte de visite professionnelle en ligne et partagez-la avec 
                  votre réseau ou de potentiels employeurs.
                </p>
                <div className="h-1 w-16 bg-gazouyi-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <Features />
        
        {/* Next Steps Section */}
        

        <div className="bg-gazouyi-50 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center section-transition">
            <h2 className="text-3xl md:text-4xl font-bold text-gazouyi-900 mb-6">
              Prête à valoriser votre parcours ?
            </h2>
            <p className="text-lg text-gazouyi-700 mb-10">
              Rejoignez la communauté Gazouyi Connect et créez votre page professionnelle 
              en quelques minutes. C'est simple, rapide et valorisant !
            </p>
            <Button href={session ? "/dashboard" : "/auth"} icon className="text-lg px-8 py-4">
              {session ? "Accéder à mon espace" : "Démarrer maintenant"}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default Index;