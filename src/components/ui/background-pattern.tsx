import React from 'react';

interface BackgroundPatternProps {
  text: string;
  className?: string;
  textColor?: string;
  fontSize?: string;
  rotation?: number;
  opacity?: number;
  backgroundColor?: string;
}

export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  text,
  className = '',
  textColor = 'rgba(155, 135, 245, 0.7)', // More visible purple color
  fontSize = '2.5rem', // Larger font size
  rotation = -20,
  opacity = 0.4, // Increased opacity
  backgroundColor = 'rgba(241, 240, 251, 0.8)', // Light purple background
}) => {
  // Create a grid of repeated text
  const rows = 12; // More rows
  const columns = 12; // More columns
  
  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ 
        opacity,
        backgroundColor,
        backgroundImage: 'linear-gradient(to right, rgba(155, 135, 245, 0.1), rgba(126, 105, 171, 0.1))'
      }}
    >
      <div 
        className="absolute inset-0 flex flex-col"
        style={{ transform: `rotate(${rotation}deg) scale(1.5)` }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex whitespace-nowrap">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`} 
                className="mx-4 my-8 italic font-bold"
                style={{ 
                  color: textColor, 
                  fontSize,
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' // Add text shadow for better visibility
                }}
              >
                {text}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
