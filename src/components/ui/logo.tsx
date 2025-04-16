
import React, { useState, useEffect } from 'react';
import { Company } from '@/types/database';
import { findCompanyLogo } from '@/lib/logoFinder';

interface LogoProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  company?: Company; // Optional company object for auto-finding logos
}

/**
 * Enhanced Logo component for consistent logo display across the application
 * 
 * Features:
 * - Automatic logo finding using public/logos directory, LinkedIn image search and website checking
 * - Consistent sizing with predefined options
 * - Proper background and padding
 * - Fallback display when logo is missing
 * - Optimized for high-quality display
 */
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
  const [logoSrc, setLogoSrc] = useState<string | null>(src || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  
  // Extract first two letters for fallback
  const initials = alt
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Check if company name is available and try to find direct match in public logos
  useEffect(() => {
    const checkPublicLogo = async () => {
      if (company?.name && !src && !logoSrc) {
        // Try direct match with company name for public directory
        const companyNameSlug = company.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Try different extensions
        const possibleExtensions = ['png', 'jpg', 'jpeg', 'svg', 'svg+xml'];
        for (const ext of possibleExtensions) {
          try {
            const localLogoPath = `/logos/${companyNameSlug}.${ext}`;
            const response = await fetch(localLogoPath, { method: 'HEAD' });
            if (response.ok) {
              // Add cache-busting parameter
              const cacheBuster = `?t=${Date.now()}`;
              setLogoSrc(localLogoPath + cacheBuster);
              return;
            }
          } catch (e) {
            // Continue checking other extensions
          }
        }
        
        // Also check if there's a renamed logo
        try {
          const response = await fetch(`/logos/${companyNameSlug}_logo.png`, { method: 'HEAD' });
          if (response.ok) {
            setLogoSrc(`/logos/${companyNameSlug}_logo.png?t=${Date.now()}`);
            return;
          }
        } catch (e) {
          // Continue to next method
        }
      }
    };
    
    checkPublicLogo();
  }, [company, src, logoSrc]);

  // Use company.logo or company.logoUrl if available, and src is not provided
  useEffect(() => {
    if (!src && company && (company.logo || company.logoUrl)) {
      // Add timestamp to prevent caching
      const logoUrl = company.logo || company.logoUrl || null;
      if (logoUrl) {
        setLogoSrc(`${logoUrl}?t=${new Date().getTime()}`);
      } else {
        setLogoSrc(null);
      }
    } else if (src) {
      // Also add cache-busting for direct src
      setLogoSrc(`${src}?t=${new Date().getTime()}`);
    }
  }, [company, src]);

  // Auto-find logo if company is provided and no src is available
  useEffect(() => {
    const autoFindLogo = async () => {
      // Only attempt to find logo if company is provided and no src is available
      if (company && !src && !logoSrc && !hasError) {
        try {
          setIsLoading(true);
          const result = await findCompanyLogo(company);
          if (result.success && result.logoUrl) {
            // Add timestamp to prevent caching
            setLogoSrc(`${result.logoUrl}?t=${new Date().getTime()}`);
          }
        } catch (error) {
          console.error('Error auto-finding logo:', error);
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    autoFindLogo();
  }, [company, src, logoSrc, hasError]);

  // Add console logging for debugging
  useEffect(() => {
    if (logoSrc) {
      console.log(`Logo source for ${alt}: ${logoSrc}`);
    }
  }, [logoSrc, alt]);

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
