import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

const ServiceCard = ({ service, category, showCTA = true }) => {
  const categoryColors = {
    everyday: 'border-charcoal/20 hover:border-charcoal',
    'premium-ethnic': 'border-gold/30 hover:border-gold',
    bridal: 'border-wine/30 hover:border-wine',
    others: 'border-wine/30 hover:border-wine',
  };

  const categoryBadges = {
    everyday: 'bg-charcoal/10 text-charcoal',
    'premium-ethnic': 'bg-gold/10 text-gold-dark',
    bridal: 'bg-wine/10 text-wine',
    others: 'bg-wine/10 text-wine',
  };

  // Special handling for custom orders
  const isCustomOrder = service.isCustom;

  if (isCustomOrder) {
    return (
      <a
        href="https://wa.me/919310282351?text=Hi%20SLIQUES,%20I%20have%20a%20special%20custom%20order%20request!"
        target="_blank"
        rel="noopener noreferrer"
        className={`block card border-2 p-3 sm:p-4 md:p-6 border-wine/30 hover:border-wine transition-all duration-300 group hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold`}
        tabIndex={0}
      >
        {/* Custom Order Icon */}
        <div className="aspect-[4/3] bg-gradient-to-br from-wine/5 to-gold/10 rounded-sm mb-2 sm:mb-4 overflow-hidden flex items-center justify-center">
          <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-wine/40" />
        </div>

        {/* Service Content */}
        <div>
          <h3 className="font-playfair text-sm sm:text-base md:text-xl font-medium text-charcoal mb-1 sm:mb-2 group-hover:text-wine transition-colors">
            {service.name}
          </h3>
          <p className="text-charcoal/60 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-3">
            {service.description}
          </p>

          {/* Price Note */}
          <div className="bg-wine/5 rounded-sm p-2 sm:p-3 mb-3">
            <p className="text-[10px] sm:text-xs text-wine/80">
              💡 Price & timeline will be discussed based on your requirements via WhatsApp or call.
            </p>
          </div>

          {/* CTA */}
          {showCTA && (
            <div className="flex items-center justify-center gap-1 sm:gap-2 w-full py-1.5 sm:py-2.5 text-xs sm:text-sm bg-wine/10 text-wine font-medium rounded-sm mt-2">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Chat on WhatsApp</span>
            </div>
          )}
        </div>
      </a>
    );
  }

  return (
    <Link
      to={`/booking?service=${service.id}`}
      className={`block card border-2 p-3 sm:p-4 md:p-6 ${categoryColors[category] || 'border-charcoal/10'} transition-all duration-300 group hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold`}
      tabIndex={0}
    >
      {/* Service Image - cropped to hide Gemini watermark on right */}
      <div className="aspect-[4/3] bg-gradient-to-br from-charcoal/5 to-charcoal/10 rounded-sm mb-2 sm:mb-4 overflow-hidden">
        {service.image ? (
          <div className="w-full h-full overflow-hidden">
            <img 
              src={service.image} 
              alt={service.name}
              className="w-[115%] h-full object-cover object-left group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-charcoal/30">
            <svg className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Service Content */}
      <div>
        <h3 className="font-playfair text-sm sm:text-base md:text-xl font-medium text-charcoal mb-1 sm:mb-2 group-hover:text-gold-dark transition-colors line-clamp-1">
          {service.name}
        </h3>
        <p className="text-charcoal/60 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 hidden sm:block">
          {service.description}
        </p>

        {/* Price and Duration */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4 gap-1">
          <div>
            <span className="text-base sm:text-lg md:text-2xl font-semibold text-charcoal">₹{service.basePrice.toLocaleString()}</span>
            <span className="text-charcoal/50 text-[10px] sm:text-sm ml-0.5 sm:ml-1">onwards</span>
          </div>
          <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full w-fit ${categoryBadges[category] || 'bg-charcoal/10 text-charcoal'}`}>
            {service.estimatedDays} days
          </span>
        </div>

        {/* CTA visually, but not needed for click */}
        {showCTA && (
          <div className="flex items-center justify-center gap-1 sm:gap-2 w-full py-1.5 sm:py-2.5 text-xs sm:text-sm bg-charcoal/5 text-charcoal font-medium rounded-sm mt-2">
            <span>Book Now</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default ServiceCard;
