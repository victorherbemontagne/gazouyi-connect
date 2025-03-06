
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: boolean;
  href?: string;
}

const Button = ({ children, onClick, className, icon = false, href }: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const buttonContent = (
    <>
      <span className="relative z-10">{children}</span>
      {icon && (
        <ArrowRight 
          className={cn(
            "ml-2 h-4 w-4 transition-transform duration-300 relative z-10", 
            isHovered ? "translate-x-1" : ""
          )} 
        />
      )}
      <span 
        className={cn(
          "absolute inset-0 bg-gazouyi-dark rounded-full transition-all duration-300 transform origin-left", 
          isHovered ? "scale-x-100" : "scale-x-0"
        )} 
      />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gazouyi rounded-full transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gazouyi-200 focus:ring-offset-2",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gazouyi rounded-full transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gazouyi-200 focus:ring-offset-2",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {buttonContent}
    </button>
  );
};

export default Button;
