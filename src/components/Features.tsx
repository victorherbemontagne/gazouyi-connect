
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface FeaturesProps {
  className?: string;
}

const Features = ({ className }: FeaturesProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const featureElements = document.querySelectorAll('.feature-item');
    featureElements.forEach((el) => observer.observe(el));
    
    return () => {
      featureElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const features = [
    {
      title: "Présentation professionnelle",
      description: "Créez une page attrayante qui met en valeur votre expérience et vos qualifications.",
      delay: 100
    },
    {
      title: "Portfolio de compétences",
      description: "Présentez vos compétences spécifiques et les domaines dans lesquels vous excellez.",
      delay: 200
    },
    {
      title: "Accompagnement VAE",
      description: "Bénéficiez de conseils pour valoriser votre parcours dans le cadre d'une VAE.",
      delay: 300
    }
  ];

  return (
    <section id="features" ref={sectionRef} className={cn("py-20 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 section-transition">
          <span className="inline-block px-4 py-1 text-sm font-medium text-custom-primary bg-blue-100 rounded-full mb-4">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-custom-primary mb-4">
            Une plateforme conçue pour les professionnelles de la petite enfance
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gazouyi Connect offre tous les outils nécessaires pour mettre en avant vos compétences 
            et faciliter votre démarche de VAE.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-item opacity-0 p-6 rounded-xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-custom-primary" />
              </div>
              <h3 className="text-xl font-semibold text-custom-primary mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
