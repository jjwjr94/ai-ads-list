import React from 'react';

interface BackgroundPatternProps {
  text: string;
  className?: string;
  textColor?: string;
  fontSize?: string;
  rotation?: number;
  opacity?: number;
}

export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  text,
  className = '',
  textColor = 'rgba(255, 255, 255, 0.5)',
  fontSize = '2rem',
  rotation = -20,
  opacity = 0.2,
}) => {
  // Create a grid of repeated text
  const rows = 10;
  const columns = 10;
  
  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
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
                style={{ color: textColor, fontSize }}
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
