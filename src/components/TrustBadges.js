import React from 'react';
import { Truck, Scissors, UserCheck, Shield, Clock, Award } from 'lucide-react';

const TrustBadges = ({ variant = 'default' }) => {
  const badges = [
    {
      icon: Truck,
      title: 'Free Pickup & Delivery',
      description: 'Within Raj Nagar Extension',
    },
    {
      icon: Scissors,
      title: 'Free Alteration',
      description: 'For minor fit & length corrections',
    },
    {
      icon: UserCheck,
      title: 'Tailor at Doorstep',
      description: 'Measurements at your home',
    },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-1.5 sm:gap-2">
            <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
            <span className="text-xs sm:text-sm font-medium text-charcoal">{badge.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-sm border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gold/10 flex items-center justify-center mb-3 sm:mb-4">
            <badge.icon className="w-5 h-5 sm:w-7 sm:h-7 text-gold" />
          </div>
          <h3 className="font-playfair text-sm sm:text-base md:text-lg font-medium text-charcoal mb-1 sm:mb-2">
            {badge.title}
          </h3>
          <p className="text-xs sm:text-sm text-charcoal/60">
            {badge.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export const QualityBadges = () => {
  const badges = [
    {
      icon: Shield,
      text: 'Quality Guaranteed',
    },
    {
      icon: Clock,
      text: 'On-Time Delivery',
    },
    {
      icon: Award,
      text: 'Expert Craftmanship',
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-1.5 sm:gap-2 text-charcoal/70">
          <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
          <span className="text-xs sm:text-sm font-medium">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
