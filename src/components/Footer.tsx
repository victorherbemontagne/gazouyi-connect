
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("py-8 px-4 border-t border-gazouyi-100", className)}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-xl font-semibold text-gazouyi-900">Gazouyi Connect</div>
            <p className="text-sm text-gazouyi-600">
              Valorisez votre parcours dans la petite enfance
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gazouyi-600 hover:text-gazouyi-900 transition-colors">
              À propos
            </a>
            <a href="#" className="text-gazouyi-600 hover:text-gazouyi-900 transition-colors">
              Contact
            </a>
            <a href="#" className="text-gazouyi-600 hover:text-gazouyi-900 transition-colors">
              Mentions légales
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gazouyi-100 text-center text-sm text-gazouyi-500">
          © {new Date().getFullYear()} Gazouyi. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
