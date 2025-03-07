
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Sparkles } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Déterminer s'il s'agit d'un toast de célébration (basé sur le contenu du titre ou de la description)
        const isCelebration = 
          (title && title.toLowerCase().includes("succès")) || 
          (title && title.toLowerCase().includes("félicitations")) ||
          (title && title.toLowerCase().includes("enregistré")) ||
          (title && title.toLowerCase().includes("complété"));
        
        return (
          <Toast key={id} {...props} className={isCelebration ? "celebration-toast overflow-hidden" : ""}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle className={isCelebration ? "flex items-center" : ""}>
                  {isCelebration && <Sparkles className="h-4 w-4 text-yellow-400 mr-2 animate-bounce" />}
                  {title}
                  {isCelebration && <Sparkles className="h-4 w-4 text-yellow-400 ml-2 animate-bounce" />}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription
                  className={isCelebration ? "animate-fade-in" : ""}
                >
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
            
            {/* Particules de célébration uniquement pour les toasts de réussite */}
            {isCelebration && (
              <>
                <span className="absolute top-1 left-1/4 animate-bounce delay-100 h-2 w-2 rounded-full bg-yellow-400"></span>
                <span className="absolute top-2 right-1/4 animate-bounce delay-300 h-2 w-2 rounded-full bg-green-400"></span>
                <span className="absolute bottom-2 left-1/3 animate-bounce delay-200 h-2 w-2 rounded-full bg-blue-400"></span>
                <span className="absolute bottom-1 right-1/3 animate-bounce delay-400 h-2 w-2 rounded-full bg-purple-400"></span>
              </>
            )}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
