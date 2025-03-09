
import { User } from 'lucide-react';

interface ProfilePhotoProps {
  photoUrl: string | null;
  fullName: string;
}

export const ProfilePhoto = ({ photoUrl, fullName }: ProfilePhotoProps) => {
  return (
    <div className="absolute -top-16 left-6 h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-md print:h-24 print:w-24 print:-top-12">
      {photoUrl ? (
        <img 
          src={photoUrl} 
          alt={fullName}
          className="h-full w-full object-cover"
          onError={(e) => {
            // If image fails to load, show placeholder
            (e.target as HTMLImageElement).src = '';
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).classList.add('bg-gazouyi-100');
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              const placeholderIcon = document.createElement('div');
              placeholderIcon.className = 'h-full w-full flex items-center justify-center';
              placeholderIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-16 w-16 text-gazouyi-400 print:h-12 print:w-12"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
              parent.appendChild(placeholderIcon);
            }
          }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gazouyi-100">
          <User className="h-16 w-16 text-gazouyi-400 print:h-12 print:w-12" />
        </div>
      )}
    </div>
  );
};
