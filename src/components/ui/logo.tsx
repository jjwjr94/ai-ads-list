import React from 'react';

interface LogoProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Enhanced Logo component for consistent logo display across the application
 * 
 * Features:
 * - Consistent sizing with predefined options
 * - Proper background and padding
 * - Fallback display when logo is missing
 * - Optimized for high-quality display
 */
const Logo: React.FC<LogoProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '' 
}) => {
  // Size mapping for consistent dimensions
  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-12 h-12 p-1.5',
    lg: 'w-16 h-16 p-2',
    xl: 'w-24 h-24 p-2.5'
  };

  // Handle missing or broken logo
  const [hasError, setHasError] = React.useState(false);
  
  // Extract first two letters for fallback
  const initials = alt
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

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
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain"
          onError={() => setHasError(true)}
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
