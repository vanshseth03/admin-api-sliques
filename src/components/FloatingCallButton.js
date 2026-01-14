import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const PHONE_NUMBER = '+919310282351';
const WHATSAPP_NUMBER = '919310282351';

const FloatingCallButton = () => {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20SLIQUES,%20I'd%20like%20to%20inquire%20about%20your%20services`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 group"
        aria-label="WhatsApp SLIQUES"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
        
        {/* Tooltip on hover (hidden on mobile) */}
        <span className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 bg-[#25D366] text-white text-sm rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          WhatsApp
        </span>
      </a>
      
      {/* Phone Call Button */}
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-charcoal text-ivory rounded-full shadow-lg hover:bg-gold hover:text-charcoal transition-all duration-300 group"
        aria-label="Call SLIQUES"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
        
        {/* Tooltip on hover (hidden on mobile) */}
        <span className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 bg-charcoal text-ivory text-sm rounded-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Call Now
        </span>
      </a>
    </div>
  );
};

export default FloatingCallButton;
