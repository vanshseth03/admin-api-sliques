import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, X } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { serviceCategories, getAllServices } from '../data/services';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  
  const allServices = getAllServices();
  
  const filteredServices = activeCategory === 'all' 
    ? allServices 
    : allServices.filter(s => s.category === activeCategory);

  const categoryColors = {
    all: 'bg-charcoal text-ivory',
    everyday: 'bg-charcoal/10 text-charcoal hover:bg-charcoal hover:text-ivory',
    'premium-ethnic': 'bg-gold/10 text-gold-dark hover:bg-gold hover:text-charcoal',
    bridal: 'bg-wine/10 text-wine hover:bg-wine hover:text-ivory',
  };

  const activeCategoryColors = {
    all: 'bg-charcoal text-ivory',
    everyday: 'bg-charcoal text-ivory',
    'premium-ethnic': 'bg-gold text-charcoal',
    bridal: 'bg-wine text-ivory',
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="bg-white py-8 sm:py-12 md:py-16 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="section-title mb-3 sm:mb-4">Our Services</h1>
            <p className="section-subtitle mx-auto">
              From everyday essentials to bridal masterpieces, we craft each piece with expert attention
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-[88px] sm:top-[104px] md:top-[112px] z-40 bg-ivory/95 backdrop-blur-sm border-b border-charcoal/10 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeCategory === 'all' 
                  ? activeCategoryColors.all 
                  : categoryColors.all.replace('bg-charcoal text-ivory', 'bg-charcoal/10 text-charcoal hover:bg-charcoal hover:text-ivory')
              }`}
            >
              All Services
            </button>
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === category.id 
                    ? activeCategoryColors[category.id] 
                    : categoryColors[category.id]
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeCategory === 'all' ? (
            // Show all categories with sections
            <div className="space-y-10 sm:space-y-16">
              {serviceCategories.map((category) => (
                <div key={category.id}>
                  {/* Category Header */}
                  <div className="mb-5 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4 mb-2">
                      <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-medium text-charcoal">
                        {category.name}
                      </h2>
                      <div className={`h-px flex-1 ${
                        category.id === 'everyday' ? 'bg-charcoal/20' :
                        category.id === 'premium-ethnic' ? 'bg-gold/30' :
                        'bg-wine/30'
                      }`} />
                    </div>
                    <p className="text-charcoal/60">
                      {category.description}
                    </p>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {category.services.map((service) => (
                      <ServiceCard 
                        key={service.id} 
                        service={service} 
                        category={category.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show filtered category
            <div>
              {/* Category Info */}
              {serviceCategories.filter(c => c.id === activeCategory).map((category) => (
                <div key={category.id} className="mb-8">
                  <h2 className="font-playfair text-2xl md:text-3xl font-medium text-charcoal mb-2">
                    {category.name}
                  </h2>
                  <p className="text-charcoal/60">
                    {category.description}
                  </p>
                </div>
              ))}

              {/* Filtered Services Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    category={service.category}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Service Info Cards */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">What's Included</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Pickup & Delivery */}
            <div className="card border-l-4 border-l-gold">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-medium text-charcoal mb-2">
                Free Pickup & Delivery
              </h3>
              <p className="text-charcoal/60 text-sm">
                Within Raj Nagar Extension, we pick up your fabric and deliver the finished outfit right to your doorstep — completely free.
              </p>
            </div>

            {/* Free Alteration */}
            <div className="card border-l-4 border-l-gold">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-medium text-charcoal mb-2">
                Free Alteration
              </h3>
              <p className="text-charcoal/60 text-sm">
                Minor fit and length corrections are on us. If there's a stitching issue, we'll fix it free of charge. Your satisfaction is our priority.
              </p>
            </div>

            {/* Tailor at Doorstep */}
            <div className="card border-l-4 border-l-gold">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-playfair text-xl font-medium text-charcoal mb-2">
                Tailor at Doorstep
              </h3>
              <p className="text-charcoal/60 text-sm">
                Need measurements taken professionally? Our expert tailor can visit your home for accurate measurements. Select this option during booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Note */}
      <section className="py-12 bg-charcoal/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm p-6 md:p-8 shadow-sm">
            <h3 className="font-playfair text-xl font-medium text-charcoal mb-4">
              About Our Pricing
            </h3>
            <div className="space-y-3 text-sm text-charcoal/70">
              <p>
                <strong className="text-charcoal">Base prices shown</strong> are starting prices. Final cost may vary based on fabric type, complexity, and add-ons you choose.
              </p>
              <p>
                <strong className="text-charcoal">Urgent orders</strong> (minimum 36 hours notice) incur a <span className="text-wine font-medium">+30% surcharge</span> to prioritize your order.
              </p>
              <p>
                <strong className="text-charcoal">Advance payment</strong> of 30% is required for orders needing lining, padding, or materials. This helps us procure quality materials upfront.
              </p>
            </div>
            
            {/* Payment Info Box */}
            <div className="mt-6 p-4 bg-gold/5 rounded border border-gold/20">
              <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                <span className="text-lg">💳</span> Payment Options
              </h4>
              <ul className="text-sm text-charcoal/70 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-gold">✓</span>
                  <span><strong>WhatsApp Scanner:</strong> We'll send QR code from our official number (+91 93102 82351)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✓</span>
                  <span><strong>Doorstep Payment:</strong> Pay cash or UPI during tailor's measurement visit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✓</span>
                  <span><strong>On Delivery:</strong> Remaining balance payable via cash/UPI on delivery</span>
                </li>
              </ul>
              <p className="mt-3 text-xs text-wine/80 bg-wine/5 p-2 rounded">
                ⚠️ For your safety, only pay via scanner sent from our official WhatsApp: +91 93102 82351
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-4">Ready to Create Something Beautiful?</h2>
          <p className="text-charcoal/70 text-lg mb-8">
            Book your slot or customize your perfect outfit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="btn-primary">
              Book a Slot
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/customizer" className="btn-secondary">
              Customize Outfit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
