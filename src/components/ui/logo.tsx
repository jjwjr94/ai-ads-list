
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
    // Reset error state when props change
    setHasError(false);
    
    try {
      // Debug what sources we have
      console.log(`Logo for ${alt}:`, { src, companyLogo: company?.logoUrl });
      
      if (!src && company && company.logoUrl) {
        // Check if the logo is a base64 string 
        const logoUrl = company.logoUrl || null;
        
        if (logoUrl) {
          if (isBase64Image(logoUrl)) {
            setLogoSrc(logoUrl);
            console.log(`Using base64 encoded logo for ${company.name}`);
          } else {
            // Ensure the URL is absolute and add cache busting
            if (logoUrl.startsWith('http')) {
              setLogoSrc(`${logoUrl}?t=${new Date().getTime()}`);
            } else if (logoUrl.startsWith('/')) {
              // Handle relative URLs correctly
              setLogoSrc(`${logoUrl}?t=${new Date().getTime()}`);
            } else {
              // Possible relative path missing leading slash
              setLogoSrc(`/${logoUrl}?t=${new Date().getTime()}`);
            }
            console.log(`Set logo URL to: ${logoSrc}`);
          }
        } else {
          setLogoSrc(null);
        }
      } else if (src) {
        if (isBase64Image(src)) {
          setLogoSrc(src);
          console.log(`Using base64 encoded logo from props`);
        } else {
          // Ensure the URL is absolute and add cache busting
          if (src.startsWith('http')) {
            setLogoSrc(`${src}?t=${new Date().getTime()}`);
          } else if (src.startsWith('/')) {
            // Handle relative URLs correctly
            setLogoSrc(`${src}?t=${new Date().getTime()}`);
          } else {
            // Possible relative path missing leading slash
            setLogoSrc(`/${src}?t=${new Date().getTime()}`);
          }
        }
      } else {
        // No source provided
        setLogoSrc(null);
      }
    } catch (err) {
      console.error('Error processing logo URL:', err);
      setLogoSrc(null);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [company, src, alt]);

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
