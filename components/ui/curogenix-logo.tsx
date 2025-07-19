import React from 'react';

interface CuroGenixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function CuroGenixLogo({ className = '', size = 'md', showTagline = false }: CuroGenixLogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const taglineSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`font-bold ${sizeClasses[size]} text-white flex items-center`}>
        <span>CUR</span>
        {/* Pill icon replacing the 'O' */}
        <div className="relative mx-1">
          <div className="w-6 h-3 bg-gradient-to-b from-pink-400 to-red-600 rounded-full flex items-center justify-center">
            <div className="w-4 h-0.5 bg-white/80 rounded-full"></div>
          </div>
          <div className="absolute inset-0 w-6 h-3 bg-gradient-to-b from-pink-300 to-red-500 rounded-full opacity-60"></div>
        </div>
        <span>GENIX</span>
      </div>
      {showTagline && (
        <div className={`${taglineSizeClasses[size]} text-yellow-400 font-medium mt-1`}>
          WWW.CUREGENIX.COM
        </div>
      )}
    </div>
  );
} 