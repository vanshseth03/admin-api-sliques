import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, MessageCircle, Instagram, Facebook, Send } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    // For now, redirect to WhatsApp
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const message = formData.get('message');
    const whatsappMessage = encodeURIComponent(`Hi SLIQUES, I'm ${name}. ${message}`);
    window.open(`https://wa.me/919310282351?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="bg-white py-6 sm:py-8 md:py-12 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="section-title mb-3 sm:mb-4">Contact Us</h1>
            <p className="section-subtitle mx-auto">
              We'd love to hear from you • Since 2000
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-playfair text-xl sm:text-2xl font-medium text-charcoal mb-6 sm:mb-8">
              Get in Touch
            </h2>

            {/* WhatsApp - Primary */}
            <div className="bg-[#25D366]/10 rounded-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-charcoal text-base sm:text-lg mb-0.5 sm:mb-1">WhatsApp (Preferred)</h3>
                  <p className="text-charcoal/60 text-xs sm:text-sm mb-2 sm:mb-3">
                    Fastest way to reach us. We respond within 30 min.
                  </p>
                  <a
                    href="https://wa.me/919310282351?text=Hi%20SLIQUES,%20I'd%20like%20to%20inquire%20about%20your%20services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp inline-flex"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Other Contact Methods */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-charcoal text-sm sm:text-base mb-0.5 sm:mb-1">Phone</h3>
                  <a href="tel:+919310282351" className="text-charcoal/70 hover:text-gold transition-colors text-sm sm:text-base">
                    +91 93102 82351
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-charcoal text-sm sm:text-base mb-0.5 sm:mb-1">Location</h3>
                  <p className="text-charcoal/70 text-sm sm:text-base">
                    Raj Nagar Extension<br />
                    Ghaziabad, UP
                  </p>
                  <p className="text-xs sm:text-sm text-gold mt-1 sm:mt-2">
                    * We serve only Raj Nagar Extension
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-charcoal text-sm sm:text-base mb-0.5 sm:mb-1">Working Hours</h3>
                  <p className="text-charcoal/70 text-sm sm:text-base">
                    Open Every Day<br />
                    10 AM - 7 PM
                  </p>
                  <p className="text-xs text-gold mt-1">Yes, we're open on Sundays too!</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-charcoal/10">
              <h3 className="font-medium text-charcoal text-sm sm:text-base mb-3 sm:mb-4">Follow Us</h3>
              <div className="flex gap-3 sm:gap-4">
                <a
                  href="https://instagram.com/sliques"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-charcoal/5 flex items-center justify-center hover:bg-charcoal hover:text-ivory transition-colors"
                >
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a
                  href="https://facebook.com/sliques"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-charcoal/5 flex items-center justify-center hover:bg-charcoal hover:text-ivory transition-colors"
                >
                  <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6 md:p-8">
              <h2 className="font-playfair text-xl sm:text-2xl font-medium text-charcoal mb-4 sm:mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="input-field"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="input-field"
                    placeholder="10-digit phone number"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-2">
                    Subject
                  </label>
                  <select id="subject" name="subject" className="input-field">
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Question</option>
                    <option value="order">Order Status</option>
                    <option value="alteration">Alteration Request</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="input-field"
                    placeholder="How can we help you?"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>

                <p className="text-xs text-charcoal/50 text-center">
                  This will open WhatsApp with your message pre-filled
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10 sm:mt-16 bg-charcoal/5 rounded-sm p-4 sm:p-6 md:p-8">
          <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-medium text-charcoal text-center mb-4 sm:mb-6 md:mb-8">
            Quick Actions
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            <Link to="/booking" className="bg-white rounded-sm p-3 sm:p-4 md:p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-charcoal text-xs sm:text-sm md:text-base mb-1 sm:mb-2">Book</h3>
              <p className="text-xs text-charcoal/60 hidden sm:block">Schedule your appointment</p>
            </Link>

            <Link to="/track-order" className="bg-white rounded-sm p-3 sm:p-4 md:p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-medium text-charcoal text-xs sm:text-sm md:text-base mb-1 sm:mb-2">Track</h3>
              <p className="text-xs text-charcoal/60 hidden sm:block">Check order status</p>
            </Link>

            <Link to="/faq" className="bg-white rounded-sm p-3 sm:p-4 md:p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-charcoal text-xs sm:text-sm md:text-base mb-1 sm:mb-2">FAQ</h3>
              <p className="text-xs text-charcoal/60 hidden sm:block">Find answers</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
