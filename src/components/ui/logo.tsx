
import React, { useState, useEffect } from 'react';
import { Company } from '@/types/frontend.models';

interface LogoProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  company?: Company; 
}

const Logo: React.FC<LogoProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '',
  company
}) => {
  // Size mapping for consistent dimensions
  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-12 h-12 p-1.5',
    lg: 'w-16 h-16 p-2',
    xl: 'w-24 h-24 p-2.5'
  };

  // State for logo source and loading status
  const [logoSrc, setLogoSrc] = useState<string | null | undefined>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  // Extract first two letters for fallback
  const initials = alt
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Helper function to check if a string is a base64 image
  const isBase64Image = (str: string): boolean => {
    return str?.startsWith('data:image/');
  };

  // Use company.logoUrl if available, and src is not provided
  useEffect(() => {
    if (!src && company && company.logoUrl) {
      // Check if the logo is a base64 string 
      const logoUrl = company.logoUrl || null;
      
      if (logoUrl) {
        if (isBase64Image(logoUrl)) {
          setLogoSrc(logoUrl);
          console.log(`Using base64 encoded logo for ${company.name}`);
        } else {
          // Add timestamp for normal URLs to prevent caching
          setLogoSrc(`${logoUrl}?t=${new Date().getTime()}`);
        }
      } else {
        setLogoSrc(null);
      }
      setIsLoading(false);
    } else if (src) {
      if (isBase64Image(src)) {
        setLogoSrc(src);
        console.log(`Using base64 encoded logo from props`);
      } else {
        // Add cache-busting for normal URL sources
        setLogoSrc(`${src}?t=${new Date().getTime()}`);
      }
      setIsLoading(false);
    } else {
      // No source provided
      setLogoSrc(null);
      setIsLoading(false);
    }
  }, [company, src]);

  return (
    <div 
      className={`
        flex items-center justify-center 
        bg-white rounded-md border border-gray-200 
        overflow-hidden shadow-sm
        ${sizeClasses[size]} 
        ${className}
      `}
    >
      {isLoading ? (
        <div className="animate-pulse bg-gray-200 w-full h-full"></div>
      ) : !hasError && logoSrc ? (
        <img
          src={logoSrc}
          alt={alt}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            console.error(`Error loading logo from ${logoSrc}`);
            setHasError(true);
          }}
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 font-semibold">
          {initials}
        </div>
      )}
    </div>
  );
};

export default Logo;
