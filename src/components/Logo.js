import React from 'react';

const Logo = ({ size = 'default' }) => {
  const sizes = {
    small: 'text-lg sm:text-xl',
    default: 'text-xl sm:text-2xl md:text-3xl',
    large: 'text-3xl sm:text-4xl md:text-5xl',
  };

  return (
    <div className="flex flex-col items-start">
      <h1 className={`font-playfair font-semibold text-charcoal tracking-wider ${sizes[size]}`}>
        SLIQUES
      </h1>
      <div className="w-full h-0.5 bg-gradient-to-r from-gold via-gold to-transparent mt-0.5" />
      {size !== 'small' && (
        <span className="text-[9px] sm:text-xs text-charcoal/60 tracking-widest mt-0.5 sm:mt-1 font-inter uppercase">
          Boutique Tailoring
        </span>
      )}
    </div>
  );
};

export default Logo;
