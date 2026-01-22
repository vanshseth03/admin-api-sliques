import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, MapPin, Phone, MessageCircle, Ruler, AlertCircle, Check, Clock, Truck, Scissors, CreditCard } from 'lucide-react';

const FAQ = () => {
  const [openSection, setOpenSection] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
    setOpenFaq(null);
  };

  const toggleFaq = (faq) => {
    setOpenFaq(openFaq === faq ? null : faq);
  };

  const faqSections = [
    {
      id: 'about',
      title: 'About SLIQUES',
      icon: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      faqs: [
        {
          q: 'How long has SLIQUES been in business?',
          a: 'SLIQUES has been serving customers with quality tailoring since 2000. With over 24 years of experience, we bring expert craftsmanship to every piece we create.'
        },
        {
          q: 'What are your working hours?',
          a: 'We are open every day from 10 AM to 7 PM. Yes, we are open on Sundays too! We believe in being available whenever you need us.'
        }
      ]
    },
    {
      id: 'service-area',
      title: 'Service Area',
      icon: MapPin,
      faqs: [
        {
          q: 'Which areas do you serve?',
          a: 'We exclusively serve Raj Nagar Extension, Ghaziabad. This allows us to provide free pickup and delivery while maintaining the highest quality standards.'
        },
        {
          q: 'Do you offer services outside Raj Nagar Extension?',
          a: 'Currently, we only operate within Raj Nagar Extension to ensure timely service and free pickup/delivery. We may expand in the future.'
        },
        {
          q: 'Is pickup and delivery really free?',
          a: 'Yes! For all customers within Raj Nagar Extension, pickup and delivery is completely free. No hidden charges.'
        }
      ]
    },
    {
      id: 'measurements',
      title: 'Measurements',
      icon: Ruler,
      faqs: [
        {
          q: 'How do I provide my measurements?',
          a: 'You can either provide your own measurements during booking, or opt for our "Tailor at Doorstep" service where our expert tailor will visit your home to take accurate measurements.'
        },
        {
          q: 'What if my measurements are incorrect?',
          a: 'If you provide your own measurements, you are responsible for their accuracy. We offer free alterations for minor fit and length corrections caused by our stitching, but not for issues arising from incorrect measurements you provided.'
        },
        {
          q: 'Which measurements do I need to provide?',
          a: 'Essential measurements include: Bust/Chest, Waist, and Hips. Additional helpful measurements are: Shoulder Width, Sleeve Length, Blouse/Kurta Length, and Height. Our measurement guide shows exactly where to measure.'
        },
        {
          q: 'Can someone take measurements at my home?',
          a: 'Yes! Select "Send Tailor Home" during booking. Our professional tailor will visit your home the next day to take accurate measurements. We\'ll contact you via WhatsApp to confirm the exact time. This service ensures perfect fit.'
        }
      ]
    },
    {
      id: 'alterations',
      title: 'Free Alterations',
      icon: Scissors,
      faqs: [
        {
          q: 'What alterations are free?',
          a: 'We offer free alterations ONLY for outfits that we have stitched. This includes minor fit and length corrections for the same instance of stitching.'
        },
        {
          q: 'What is NOT covered under free alterations?',
          a: 'Alterations are not free if: the outfit was not stitched by us, the issue is due to incorrect measurements you provided, you want to change the design after stitching, or the alteration requires major restructuring of the garment.'
        },
        {
          q: 'How do I request an alteration?',
          a: 'If your outfit needs alteration, contact us via WhatsApp within 7 days of delivery. We will pick up the garment, make the necessary adjustments, and deliver it back — all free of charge for covered alterations.'
        }
      ]
    },
    {
      id: 'booking',
      title: 'Booking & Scheduling',
      icon: Clock,
      faqs: [
        {
          q: 'How long does it take to complete my order?',
          a: 'Normal orders take approximately 1 week for delivery. We carefully manage our schedule to ensure quality work on each piece.'
        },
        {
          q: 'What is an urgent booking?',
          a: 'Urgent bookings have priority processing for time-sensitive needs. They have a faster turnaround and incur a 30% surcharge for priority handling.'
        },
        {
          q: 'Can I reschedule my booking?',
          a: 'Yes, you can reschedule by contacting us on WhatsApp. Note that rescheduling is subject to slot availability.'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment & Pricing',
      icon: CreditCard,
      faqs: [
        {
          q: 'Why is advance payment required?',
          a: 'For orders requiring lining, padding, buttons, or other materials, we need to purchase these items upfront. The 30% advance helps us procure quality materials for your outfit. Simple stitching work that doesn\'t need additional materials does not require advance.'
        },
        {
          q: 'When do I need to pay advance?',
          a: 'Advance payment (30%) is required only for orders that need lining, padding, or other materials that we need to purchase. This is communicated clearly during booking and on your invoice.'
        },
        {
          q: 'How will I pay the advance? Is it safe?',
          a: '⚠️ IMPORTANT: We will ONLY send payment QR codes/scanners from our official WhatsApp number (+91 93102 82351). Never pay to any other number or scanner claiming to be from SLIQUES. All advance payments are done through UPI or bank transfer via the scanner we send on WhatsApp.'
        },
        {
          q: 'Can I pay during doorstep measurement visit?',
          a: 'Yes! If you opt for "Tailor at Doorstep" service, you can pay the advance amount in cash or via UPI directly to our tailor during the measurement visit. This is convenient if you prefer not to pay online beforehand.'
        },
        {
          q: 'Is the advance refundable?',
          a: 'The advance is non-refundable in case of cancellation as we may have already purchased materials. However, it can be adjusted against a future booking if you reschedule.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept: (1) UPI payment via QR scanner sent on WhatsApp, (2) Bank transfer, (3) Cash during doorstep measurement or delivery. Final payment can be made via any of these methods upon delivery.'
        },
        {
          q: 'How is the urgent surcharge calculated?',
          a: 'Urgent orders incur a 30% surcharge on the total order value. For example, if your order total is ₹2,000, the urgent surcharge would be ₹600, making the total ₹2,600.'
        }
      ]
    },
    {
      id: 'customizer',
      title: 'Outfit Customizer',
      icon: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      faqs: [
        {
          q: 'What is Complimentary Neckline Personalization?',
          a: 'You can upload your own neck design (image, sketch, or inspiration) and we\'ll craft it for free! This is our way of helping you get exactly the look you want without extra charges.'
        },
        {
          q: 'What file formats can I upload for neck designs?',
          a: 'We accept JPG, PNG, and SVG files up to 5MB. Clear images or sketches work best. You can also share reference images via WhatsApp.'
        },
        {
          q: 'Is the price shown in customizer final?',
          a: 'The customizer shows estimated pricing based on your selections. Final pricing is confirmed after we assess the complexity and any special requirements.'
        }
      ]
    },
    {
      id: 'delivery',
      title: 'Delivery & Timeline',
      icon: Truck,
      faqs: [
        {
          q: 'How long does it take to complete my outfit?',
          a: 'Timeline varies by service: Simple alterations take 2-3 days, everyday wear 4-5 days, ethnic wear 6-10 days, and bridal work 12-18 days. Urgent orders are prioritized.'
        },
        {
          q: 'Do you provide trial fittings?',
          a: 'Yes! For most outfits, we provide a trial fitting before final delivery. You\'ll be notified when your outfit is ready for trial.'
        },
        {
          q: 'What if I need my outfit by a specific date?',
          a: 'Let us know your deadline when booking. We\'ll confirm if we can meet it. For urgent needs (36+ hours), select urgent booking with the surcharge.'
        }
      ]
    },
    {
      id: 'cancellation',
      title: 'Cancellations & Refunds',
      icon: AlertCircle,
      faqs: [
        {
          q: 'Can I cancel my order?',
          a: 'You can cancel before we start cutting your fabric. Once cutting begins, cancellation is not possible as the work is customized for you.'
        },
        {
          q: 'What is your refund policy?',
          a: 'Advance payments are non-refundable but can be adjusted against future orders. If we are unable to complete your order due to our fault, you will receive a full refund.'
        },
        {
          q: 'What if I\'m not satisfied with the final product?',
          a: 'Your satisfaction is our priority. If there are any stitching issues, we will alter the garment free of charge. For major concerns, contact us within 7 days of delivery.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="bg-white py-6 sm:py-8 md:py-12 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="section-title mb-3 sm:mb-4">FAQ & Policies</h1>
            <p className="section-subtitle mx-auto">
              Everything you need to know about our services
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Quick Summary Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-12">
          <div className="bg-white rounded-sm border border-charcoal/10 p-2 sm:p-4 text-center">
            <Check className="w-5 h-5 sm:w-8 sm:h-8 text-gold mx-auto mb-1 sm:mb-2" />
            <h3 className="font-medium text-charcoal text-[10px] sm:text-sm md:text-base mb-0.5 sm:mb-1">Free Delivery</h3>
            <p className="text-[9px] sm:text-xs md:text-sm text-charcoal/60 hidden sm:block">Within Raj Nagar Ext.</p>
          </div>
          <div className="bg-white rounded-sm border border-charcoal/10 p-2 sm:p-4 text-center">
            <Scissors className="w-5 h-5 sm:w-8 sm:h-8 text-gold mx-auto mb-1 sm:mb-2" />
            <h3 className="font-medium text-charcoal text-[10px] sm:text-sm md:text-base mb-0.5 sm:mb-1">Free Alteration</h3>
            <p className="text-[9px] sm:text-xs md:text-sm text-charcoal/60 hidden sm:block">Minor fit corrections</p>
          </div>
          <div className="bg-white rounded-sm border border-charcoal/10 p-2 sm:p-4 text-center">
            <CreditCard className="w-5 h-5 sm:w-8 sm:h-8 text-gold mx-auto mb-1 sm:mb-2" />
            <h3 className="font-medium text-charcoal text-[10px] sm:text-sm md:text-base mb-0.5 sm:mb-1">30% Advance</h3>
            <p className="text-[9px] sm:text-xs md:text-sm text-charcoal/60 hidden sm:block">Balance on delivery</p>
          </div>
        </div>

        {/* Service Area Notice */}
        <div className="bg-gold/10 rounded-sm p-4 sm:p-6 mb-6 sm:mb-8 flex items-start gap-3 sm:gap-4" id="service-area">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" />
          <div>
            <h3 className="font-medium text-charcoal text-sm sm:text-base mb-0.5 sm:mb-1">Service Area</h3>
            <p className="text-charcoal/70 text-xs sm:text-sm md:text-base">
              We exclusively serve <strong>Raj Nagar Extension</strong>. This allows us to provide free pickup & delivery.
            </p>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-3 sm:space-y-4">
          {faqSections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSection === section.id;
            
            return (
              <div key={section.id} className="bg-white rounded-sm border border-charcoal/10 overflow-hidden" id={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-charcoal/5 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      {typeof Icon === 'function' ? <Icon /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />}
                    </div>
                    <span className="font-playfair text-sm sm:text-base md:text-lg font-medium text-charcoal">
                      {section.title}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal/50" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal/50" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4 space-y-1.5 sm:space-y-2">
                    {section.faqs.map((faq, index) => {
                      const faqId = `${section.id}-${index}`;
                      const isFaqOpen = openFaq === faqId;
                      
                      return (
                        <div key={index} className="border-l-2 border-charcoal/10">
                          <button
                            onClick={() => toggleFaq(faqId)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 flex items-start justify-between text-left hover:bg-charcoal/5 transition-colors"
                          >
                            <span className="text-charcoal font-medium text-xs sm:text-sm md:text-base pr-2 sm:pr-4">{faq.q}</span>
                            {isFaqOpen ? (
                              <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-charcoal/50 flex-shrink-0 mt-0.5 sm:mt-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-charcoal/50 flex-shrink-0 mt-1" />
                            )}
                          </button>
                          {isFaqOpen && (
                            <div className="px-4 pb-3">
                              <p className="text-charcoal/70 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Measurement Guide */}
        <div className="mt-12 bg-white rounded-sm border border-charcoal/10 p-6 md:p-8" id="measurements">
          <h2 className="font-playfair text-2xl font-medium text-charcoal mb-6 flex items-center gap-3">
            <Ruler className="w-6 h-6 text-gold" />
            Measurement Guide
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gold">1</div>
                <div>
                  <h4 className="font-medium text-charcoal">Bust/Chest</h4>
                  <p className="text-sm text-charcoal/60">Measure around the fullest part of the bust/chest, keeping the tape parallel to the floor.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gold">2</div>
                <div>
                  <h4 className="font-medium text-charcoal">Waist</h4>
                  <p className="text-sm text-charcoal/60">Measure around the natural waistline (narrowest part of the torso).</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gold">3</div>
                <div>
                  <h4 className="font-medium text-charcoal">Hips</h4>
                  <p className="text-sm text-charcoal/60">Measure around the fullest part of the hips, about 7-8 inches below the waist.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gold">4</div>
                <div>
                  <h4 className="font-medium text-charcoal">Shoulder Width</h4>
                  <p className="text-sm text-charcoal/60">Measure from one shoulder point to the other across the back.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gold">5</div>
                <div>
                  <h4 className="font-medium text-charcoal">Sleeve Length</h4>
                  <p className="text-sm text-charcoal/60">Measure from shoulder point to desired sleeve end (wrist for full sleeve).</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gold">6</div>
                <div>
                  <h4 className="font-medium text-charcoal">Length</h4>
                  <p className="text-sm text-charcoal/60">Measure from shoulder/nape to desired garment end.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gold/10 rounded-sm">
            <p className="text-sm text-charcoal/70">
              <strong className="text-charcoal">Pro Tip:</strong> Use a soft measuring tape and wear minimal clothing. Stand naturally without sucking in. If unsure, opt for our "Tailor at Doorstep" service!
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-charcoal text-ivory rounded-sm p-8 text-center">
          <h2 className="font-playfair text-2xl font-medium mb-4">Still Have Questions?</h2>
          <p className="text-ivory/70 mb-6">
            We're here to help! Reach out and we'll respond as quickly as we can.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919310282351?text=Hi%20SLIQUES,%20I%20have%20a%20question"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Us
            </a>
            <a href="tel:+919310282351" className="btn-gold">
              <Phone className="w-5 h-5 mr-2" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
