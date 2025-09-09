'use client'

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
  fallbackUrl?: string; // URL de respaldo si no hay historial
  children?: React.ReactNode;
}

export default function BackButton({ 
  className = "text-gray-400 hover:text-white flex items-center mb-4 transition-colors duration-200",
  fallbackUrl = "/",
  children
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Verificar si hay historial disponible
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      // Si no hay historial, ir a la URL de respaldo
      router.push(fallbackUrl);
    }
  };

  return (
    <button 
      onClick={handleBack}
      className={className}
      type="button"
    >
      {children || (
        <>
          <span className="mr-2">←</span>
          <span>Volver</span>
        </>
      )}
    </button>
  );
}