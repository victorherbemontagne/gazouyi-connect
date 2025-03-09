
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string | null;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gazouyi-50 to-white flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md">
        <h1 className="text-2xl font-bold text-gazouyi-800 mb-4">Profil non disponible</h1>
        <p className="text-gazouyi-600 mb-6">{error || "Ce profil n'existe pas ou n'est pas public."}</p>
        <Button onClick={() => window.location.href = '/'}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};
