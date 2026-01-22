import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Calendar, MessageCircle, MapPin, ChevronDown } from 'lucide-react';
import TrustBadges, { QualityBadges } from '../components/TrustBadges';
import ServiceCard from '../components/ServiceCard';
import { serviceCategories, getAllServices } from '../data/services';

// Import optimized hero image
import frontPageImg from '../images-optimized/front page.webp';

const Home = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Get featured services (one from each category)
  const featuredServices = serviceCategories.map(cat => ({
    ...cat.services[0],
    category: cat.id,
    categoryName: cat.name
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-ivory overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111317' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              {/* Service Area Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gold/10 text-charcoal px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Since 2000 · Raj Nagar Extension</span>
              </div>

              {/* Brand Wordmark */}
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-charcoal tracking-wide mb-2">
                SLIQUES
              </h1>
              <div className="flex justify-center lg:justify-start mb-4 sm:mb-6">
                <div className="w-20 sm:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-gold via-gold to-transparent" />
              </div>
              
              {/* Tagline */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-charcoal/70 font-light mb-3 sm:mb-4">
                Contemporary Boutique, Crafted with Care
              </p>
              
              <p className="text-charcoal/60 text-sm sm:text-base md:text-lg max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8">
                A contemporary boutique offering stylish, comfortable & elegant outfit designs for everyday confidence and special moments. Premium tailoring with free pickup & delivery.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link to="/booking" className="btn-primary">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Book a Slot
                </Link>
                <Link to="/customizer" className="btn-secondary">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Customize Outfit
                </Link>
                <a
                  href="https://wa.me/919310282351?text=Hi%20SLIQUES,%20I'd%20like%20to%20inquire%20about%20your%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-charcoal/5 via-gold/5 to-wine/5 rounded-sm overflow-hidden shadow-lg">
                <img 
                  src={frontPageImg} 
                  alt="SLIQUES Boutique - Premium Tailoring"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white shadow-lg rounded-sm p-4 border border-charcoal/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal">Expert Craftsmanship</p>
                    <p className="text-sm text-charcoal/60">Since 2000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hidden md:flex justify-center mt-16">
            <a href="#trust-badges" className="animate-bounce text-charcoal/40 hover:text-charcoal transition-colors">
              <ChevronDown className="w-8 h-8" />
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section id="trust-badges" className="bg-white py-10 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="section-title mb-3 sm:mb-4">Why Choose SLIQUES?</h2>
            <p className="section-subtitle mx-auto">
              Complimentary services that set us apart
            </p>
          </div>
          <TrustBadges />
          
          {/* Additional Quality Badges */}
          <div className="mt-12 pt-8 border-t border-charcoal/10">
            <QualityBadges />
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="bg-ivory py-10 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="section-title mb-3 sm:mb-4">Our Services</h2>
            <p className="section-subtitle mx-auto">
              From everyday comfort to bridal elegance, we craft it all
            </p>
          </div>

          {/* Service Categories */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            {serviceCategories.map((category) => (
              <div key={category.id} className="text-center">
                <div className={`w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 mx-auto rounded-full flex items-center justify-center mb-2 sm:mb-4 ${
                  category.id === 'simple' ? 'bg-charcoal/10' :
                  category.id === 'lining' ? 'bg-gold/10' :
                  category.id === 'premium-ethnic' ? 'bg-gold/10' :
                  category.id === 'bridal' ? 'bg-wine/10' :
                  category.id === 'western' ? 'bg-charcoal/10' :
                  'bg-charcoal/10'
                }`}>
                  <span className="text-xl sm:text-2xl md:text-3xl">{category.emoji}</span>
                </div>
                <h3 className="font-playfair text-xs sm:text-base md:text-xl font-medium text-charcoal mb-1 sm:mb-2">
                  {category.name}
                </h3>
                <p className="text-charcoal/60 text-[10px] sm:text-xs md:text-sm hidden sm:block">
                  {category.description}
                </p>
              </div>
            ))}
          </div>

          {/* Featured Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                category={service.category}
              />
            ))}
          </div>

          {/* View All Services CTA */}
          <div className="text-center mt-12">
            <Link to="/services" className="btn-secondary">
              View All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customizer Promo Section */}
      <section className="bg-charcoal text-ivory py-10 sm:py-16 md:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-wine blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gold/20 text-gold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Star Feature</span>
              </div>
              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-4 sm:mb-6">
                Design Your <span className="text-gold">Perfect Outfit</span>
              </h2>
              <p className="text-ivory/70 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                Use our interactive customizer to create exactly what you envision. Choose your base outfit, upload your own neckline design, select fabric, sleeves, and more.
              </p>
              <div className="bg-white/10 rounded-sm p-3 sm:p-4 mb-6 sm:mb-8">
                <p className="font-medium text-gold text-sm sm:text-base mb-1">
                  ✨ Complimentary Neckline Personalization
                </p>
                <p className="text-ivory/60 text-xs sm:text-sm">
                  Bring your own design — we'll craft it for free!
                </p>
              </div>
              <Link to="/customizer" className="btn-gold">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start Customizing
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            </div>

            {/* Customizer Preview */}
            <div className="bg-white/5 rounded-sm p-4 sm:p-6 md:p-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold flex items-center justify-center text-charcoal font-bold text-sm sm:text-base">1</div>
                  <div>
                    <p className="font-medium text-ivory text-sm sm:text-base">Choose Base Outfit</p>
                    <p className="text-ivory/60 text-xs sm:text-sm">Blouse, Salwar, Anarkali, Lehenga...</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/80 flex items-center justify-center text-charcoal font-bold text-sm sm:text-base">2</div>
                  <div>
                    <p className="font-medium text-ivory text-sm sm:text-base">Select Neck Design</p>
                    <p className="text-ivory/60 text-xs sm:text-sm">Choose from library or upload your own</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/60 flex items-center justify-center text-charcoal font-bold text-sm sm:text-base">3</div>
                  <div>
                    <p className="font-medium text-ivory text-sm sm:text-base">Add Fabric & Details</p>
                    <p className="text-ivory/60 text-xs sm:text-sm">Sleeves, length, embroidery, add-ons</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/40 flex items-center justify-center text-charcoal font-bold text-sm sm:text-base">4</div>
                  <div>
                    <p className="font-medium text-ivory text-sm sm:text-base">Get Live Price & Book</p>
                    <p className="text-ivory/60 text-xs sm:text-sm">See real-time pricing, download or book</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-ivory py-10 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="section-title mb-3 sm:mb-4">How It Works</h2>
            <p className="section-subtitle mx-auto">
              Simple, seamless, and designed around you
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                step: 1,
                title: 'Book a Slot',
                description: 'Choose your preferred date and time. We limit bookings for quality.',
                icon: Calendar,
              },
              {
                step: 2,
                title: 'We Pick Up',
                description: 'Free pickup from your doorstep within Raj Nagar Extension.',
                icon: () => (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                ),
              },
              {
                step: 3,
                title: 'Expert Stitching',
                description: 'Your outfit is crafted with precision and care.',
                icon: () => (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                  </svg>
                ),
              },
              {
                step: 4,
                title: 'We Deliver',
                description: 'Free delivery to your door. Track your order anytime.',
                icon: () => (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-block mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 md:w-16 sm:h-14 md:h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
                    {typeof item.icon === 'function' ? <item.icon /> : <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />}
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-charcoal text-ivory flex items-center justify-center text-xs sm:text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-playfair text-sm sm:text-base md:text-lg font-medium text-charcoal mb-1 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-charcoal/60 text-xs sm:text-sm">
                  {item.description}
                </p>
              </div>
            ))}            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gold/10 py-10 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-3 sm:mb-4">Ready to Get Started?</h2>
          <p className="text-charcoal/70 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Book your slot today and experience premium tailoring with the personal touch you deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/booking" className="btn-primary">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Book a Slot
            </Link>
            <a
              href="https://wa.me/919310282351?text=Hi%20SLIQUES,%20I'd%20like%20to%20inquire%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
