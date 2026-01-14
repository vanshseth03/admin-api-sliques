import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-ivory">
      {/* Service Area Reminder */}
      <div className="bg-gold/20 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0" />
            <p className="text-xs sm:text-sm md:text-base">
              <strong className="text-gold">Service Area:</strong> <span className="hidden sm:inline">We proudly serve only</span> Raj Nagar Extension<span className="hidden sm:inline"> with free pickup & delivery</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="mb-4 sm:mb-6">
              <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider">
                SLIQUES
              </h2>
              <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-gold to-transparent mt-1" />
              <span className="text-[10px] sm:text-xs text-ivory/60 tracking-widest mt-2 block uppercase">
                Boutique Tailoring
              </span>
            </div>
            <p className="text-ivory/70 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 hidden md:block">
              We limit bookings so each piece receives expert attention. Experience premium tailoring crafted with care.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {/* Social links removed as per request */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-sm sm:text-base md:text-lg font-medium mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { path: '/services', label: 'Our Services' },
                { path: '/customizer', label: 'Customize Outfit' },
                { path: '/booking', label: 'Book a Slot' },
                { path: '/track-order', label: 'Track Order' },
                { path: '/faq', label: 'FAQ & Policies' },
                { path: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-ivory/70 hover:text-gold transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="hidden md:block">
            <h3 className="font-playfair text-sm sm:text-base md:text-lg font-medium mb-3 sm:mb-4">Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                'Everyday & Office Wear',
                'Premium Ethnic Wear',
                'Bridal & Heavy Work',
                'Alterations & Repairs',
                'Tailor at Doorstep',
              ].map((service) => (
                <li key={service}>
                  <span className="text-ivory/70 text-xs sm:text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-playfair text-sm sm:text-base md:text-lg font-medium mb-3 sm:mb-4">Contact</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-ivory/70 text-xs sm:text-sm">
                  Raj Nagar Extension<br />
                  Ghaziabad, UP
                </span>
              </li>
              <li>
                <a
                  href="tel:+919310282351"
                  className="flex items-center gap-2 sm:gap-3 text-ivory/70 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0" />
                  <span className="text-xs sm:text-sm">+91 93102 82351</span>
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-ivory/70 text-xs sm:text-sm">
                  Open Every Day<br />
                  10 AM - 7 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Since 2000 badge */}
        <div className="mt-6 sm:mt-8 text-center">
          <span className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm">
            <span className="font-medium">Serving with love since 2000</span>
          </span>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-ivory/10">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 mb-6 sm:mb-8">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-ivory/80">Free Pickup & Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-ivory/80">Free Alteration</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-ivory/80">Tailor at Doorstep</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-ivory/10 text-center">
          <p className="text-ivory/50 text-xs sm:text-sm">
            © {currentYear} SLIQUES Boutique. All rights reserved.
          </p>
          <p className="text-ivory/40 text-[10px] sm:text-xs mt-1 sm:mt-2">
            Serving Raj Nagar Extension with love ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
