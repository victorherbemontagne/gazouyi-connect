
import { cn } from "@/lib/utils";
import Button from "./Button";

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  return (
    <section className={cn("relative py-20 md:py-32 px-4 overflow-hidden", className)}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gazouyi-50 via-white to-white opacity-90" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gazouyi-200 to-transparent" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-1 text-sm font-medium text-gazouyi-700 bg-gazouyi-100 rounded-full hero-text">
            Valorisez votre parcours professionnel
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gazouyi-900 mb-6 hero-text">
          Mettez en avant vos compétences dans la petite enfance
        </h1>
        
        <p className="text-lg md:text-xl text-gazouyi-700 mb-10 max-w-2xl mx-auto hero-text">
          Gazouyi Connect vous permet de créer une page professionnelle personnalisée
          pour mettre en avant votre parcours et valoriser vos compétences.
        </p>
        
        <div className="hero-cta">
          <Button href="/auth" icon className="text-lg px-8 py-4">
            Démarrer
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gazouyi-200 to-transparent" />
    </section>
  );
};

export default Hero;
