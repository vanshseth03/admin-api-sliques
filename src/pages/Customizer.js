import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Upload, X, Check, ArrowRight, ArrowLeft, Download, MessageCircle, Sparkles, Phone, Calendar, Ruler, Home, User, Clock, AlertCircle, Info, Scissors } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { baseOutfits, neckDesigns, sleeveStyles, addOns, fitOptions } from '../data/customizer';
import { format, addDays, addHours, startOfDay } from 'date-fns';
import { downloadOrderPDF } from '../utils/pdfGenerator';
import DatePicker from '../components/DatePicker';

const Customizer = () => {
  const [step, setStep] = useState(1);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { calculatePrice, getNextAvailableNormalDate, getNextAvailableUrgentDate, createBooking, getRemainingSlots } = useBooking();
  
  // Customization state
  const [customization, setCustomization] = useState({
    baseOutfit: null,
    neckDesign: null,
    customNeckImage: null,
    customNeckPreview: null,
    sleeveStyle: null,
    fit: null,
    selectedAddOns: [],
  });

  // Measurement choice: 'self' or 'tailor'
  const [measurementChoice, setMeasurementChoice] = useState(null);
  const [tailorDate, setTailorDate] = useState(null);
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hips: '',
    shoulderWidth: '',
    sleeveLength: '',
    topLength: '',
    bottomLength: '',
    totalLength: '',
  });

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  // Confirmation checkboxes
  const [acceptedMeasurementResponsibility, setAcceptedMeasurementResponsibility] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Additional details state - for extra images and remarks
  const [additionalDetails, setAdditionalDetails] = useState({
    images: [], // Array of { file, preview, description }
    remarks: '',
  });

  // Delivery dates
  const [deliveryDates, setDeliveryDates] = useState({
    normal: null,
    urgent: null,
  });

  const fileInputRef = useRef(null);
  const additionalImagesRef = useRef(null);

  // Handle additional images upload
  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + additionalDetails.images.length > 5) {
      alert('Maximum 5 additional images allowed');
      return;
    }
    
    files.forEach(file => {
      if (!file.type.match(/image\/(jpeg|png|svg\+xml|webp)/)) {
        alert('Please upload JPG, PNG, WEBP, or SVG files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Each file should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdditionalDetails(prev => ({
          ...prev,
          images: [...prev.images, {
            file,
            preview: e.target.result,
            description: '',
          }],
        }));
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    if (additionalImagesRef.current) {
      additionalImagesRef.current.value = '';
    }
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    setAdditionalDetails(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Update additional image description
  const updateImageDescription = (index, description) => {
    setAdditionalDetails(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, description } : img
      ),
    }));
  };

  // Fetch delivery dates on mount
  useEffect(() => {
    setDeliveryDates({
      normal: getNextAvailableNormalDate(),
      urgent: getNextAvailableUrgentDate(),
    });
  }, [getNextAvailableNormalDate, getNextAvailableUrgentDate]);

  // Calculate current price - fabric removed, neck/sleeve/length are FREE
  const getCurrentPrice = useCallback(() => {
    let basePrice = customization.baseOutfit?.basePrice || 0;
    
    // Calculate add-ons total (only latkans and piping have prices now)
    const addOnsTotal = customization.selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    
    const subtotal = basePrice + addOnsTotal;
    const requiresAdvance = customization.baseOutfit?.requiresAdvance || false;
    
    return calculatePrice(subtotal, isUrgent, [], requiresAdvance);
  }, [customization, isUrgent, calculatePrice]);

  const pricing = getCurrentPrice();

  // Handle file upload for custom neck design
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/image\/(jpeg|png|svg\+xml)/)) {
        alert('Please upload a JPG, PNG, or SVG file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomization(prev => ({
          ...prev,
          neckDesign: neckDesigns.find(n => n.id === 'custom'),
          customNeckImage: file,
          customNeckPreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle add-on toggle
  const toggleAddOn = (addon) => {
    setCustomization(prev => {
      const exists = prev.selectedAddOns.find(a => a.id === addon.id);
      if (exists) {
        return {
          ...prev,
          selectedAddOns: prev.selectedAddOns.filter(a => a.id !== addon.id),
        };
      } else {
        return {
          ...prev,
          selectedAddOns: [...prev.selectedAddOns, addon],
        };
      }
    });
  };

  // Generate design summary for download/WhatsApp
  const generateSummary = () => {
    const deliveryDate = isUrgent ? deliveryDates.urgent : deliveryDates.normal;
    const lines = [
      '=== SLIQUES Custom Design ===',
      '',
      `Outfit: ${customization.baseOutfit?.name || 'Not selected'}`,
      `Neck: ${customization.neckDesign?.name || 'Standard'}${customization.customNeckPreview ? ' (Custom)' : ''} - FREE`,
      `Sleeves: ${customization.sleeveStyle?.name || 'Standard'} - FREE`,
      `Fit: ${customization.fit?.name || 'Regular'} - FREE`,
      '',
      customization.selectedAddOns.length > 0 
        ? 'Add-ons:\n' + customization.selectedAddOns.map(a => `  - ${a.name} (₹${a.price})`).join('\n')
        : '',
      '',
      `Total: ₹${pricing.total}`,
      pricing.requiresAdvance ? `Advance (30%): ₹${pricing.advanceAmount}` : 'No advance required',
      isUrgent ? `Urgent Order (+30%): ₹${pricing.urgentSurcharge}` : '',
      '',
      `Delivery: ${deliveryDate ? format(deliveryDate, 'dd MMM yyyy') : 'TBD'}`,
      '',
      'Contact: +91 93102 82351',
      'Raj Nagar Extension, Ghaziabad',
    ].filter(Boolean).join('\n');
    
    return lines;
  };

  // Handle booking submission
  const handleBookingSubmit = async () => {
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.address) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const deliveryDate = isUrgent ? deliveryDates.urgent : deliveryDates.normal;
    
    try {
      // Map measurements to the format expected by admin portal
      const measurementsData = measurementChoice === 'self' ? {
        bust: measurements.bust,
        waist: measurements.waist,
        hips: measurements.hips,
        shoulderWidth: measurements.shoulderWidth,
        sleeveLength: measurements.sleeveLength,
        blouseLength: measurements.topLength, // Map topLength to blouseLength for admin
        height: measurements.totalLength,
      } : {};

      const booking = await createBooking({
        customerName: bookingForm.name,
        phone: bookingForm.phone,
        address: bookingForm.address,
        notes: bookingForm.notes,
        serviceName: customization.baseOutfit?.name,
        serviceType: 'custom',
        bookingType: isUrgent ? 'urgent' : 'normal',
        bookingDate: format(new Date(), 'yyyy-MM-dd'), // Today's date - when booking was made
        estimatedDelivery: format(deliveryDate, 'yyyy-MM-dd'),
        // Add measurements and method
        measurements: measurementsData,
        measurementMethod: measurementChoice,
        tailorVisitDate: measurementChoice === 'tailor' ? format(tailorDate, 'yyyy-MM-dd') : null,
        tailorAtDoorstep: measurementChoice === 'tailor',
        customization: {
          neckDesign: customization.neckDesign?.name,
          sleeveStyle: customization.sleeveStyle?.name,
          fit: customization.fit?.name,
          addOns: customization.selectedAddOns.map(a => a.name),
          customNeckImage: customization.customNeckPreview,
        },
        additionalImages: additionalDetails.images.map(img => ({
          data: img.preview,
          description: img.description,
        })),
        additionalRemarks: additionalDetails.remarks,
        extraChargesNote: additionalDetails.images.length > 0 || additionalDetails.remarks ? 'Extra charges may apply based on additional requirements' : null,
        basePrice: customization.baseOutfit?.basePrice,
        addOnsTotal: customization.selectedAddOns.reduce((sum, a) => sum + a.price, 0),
        urgentSurcharge: pricing.urgentSurcharge,
        totalAmount: pricing.total,
        advanceAmount: pricing.advanceAmount,
        requiresAdvance: pricing.requiresAdvance,
      });

      setOrderDetails({
        orderId: booking.id,
        ...booking,
        pricing,
        deliveryDate: format(deliveryDate, 'dd MMM yyyy'),
      });
      setOrderComplete(true);
      // Scroll to top to show confirmation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download PDF invoice - matches Book Slot format
  const handleDownloadPDF = () => {
    const deliveryDate = isUrgent ? deliveryDates.urgent : deliveryDates.normal;
    downloadOrderPDF({
      orderId: orderDetails?.orderId || orderDetails?.id,
      customerName: bookingForm.name,
      phone: bookingForm.phone,
      address: bookingForm.address,
      serviceName: customization.baseOutfit?.name,
      serviceType: 'Custom Design',
      basePrice: customization.baseOutfit?.basePrice,
      neckDesign: customization.neckDesign?.name,
      sleeveStyle: customization.sleeveStyle?.name,
      fit: customization.fit?.name,
      addOns: customization.selectedAddOns,
      urgentSurcharge: pricing.urgentSurcharge,
      total: pricing.total,
      advanceAmount: pricing.advanceAmount,
      balanceAmount: pricing.balanceAmount,
      bookingType: isUrgent ? 'urgent' : 'normal',
      deliveryDate: deliveryDate ? format(deliveryDate, 'dd MMM yyyy') : 'TBD',
      tailorVisitDate: measurementChoice === 'tailor' ? tailorDate : null,
      measurementMethod: measurementChoice,
      measurements: measurementChoice === 'self' ? measurements : null,
    });
  };

  const handleWhatsAppShare = () => {
    const summary = generateSummary();
    const encodedMessage = encodeURIComponent(summary);
    window.open(`https://wa.me/919310282351?text=${encodedMessage}`, '_blank');
  };

  // Step navigation
  const canProceed = () => {
    switch (step) {
      case 1: return customization.baseOutfit !== null;
      case 2: return customization.neckDesign !== null;
      case 3: return customization.sleeveStyle !== null && customization.fit !== null;
      case 4: 
        // Measurement step - need choice, date if tailor, measurements if self
        if (!measurementChoice) return false;
        if (measurementChoice === 'tailor') return tailorDate !== null;
        if (measurementChoice === 'self') return measurements.bust && measurements.waist;
        return false;
      case 5: 
        // Booking form + confirmations
        const hasBasicInfo = (bookingForm.name || '').trim() !== '' && 
                            (bookingForm.phone || '').trim().length >= 10 && 
                            (bookingForm.address || '').trim() !== '';
        return hasBasicInfo && acceptedMeasurementResponsibility && acceptedTerms;
      default: return true;
    }
  };

  // Get processing start date based on measurement method
  // Self-measure: processing starts at 12:00 AM next day
  // Tailor visit: processing starts at 12:00 AM day after visit
  const getProcessingStartDate = useMemo(() => {
    if (measurementChoice === 'tailor' && tailorDate) {
      return startOfDay(addDays(tailorDate, 1));
    }
    return startOfDay(addDays(new Date(), 1));
  }, [measurementChoice, tailorDate]);

  // Calculate delivery date from processing start
  const getDeliveryDate = (processingStart, isUrgentOrder) => {
    if (!processingStart) return null;
    if (isUrgentOrder) {
      return addHours(processingStart, 36);
    }
    return addDays(processingStart, 7);
  };

  // Check availability for processing start date
  const processingDateSlots = useMemo(() => {
    return getRemainingSlots(getProcessingStartDate);
  }, [getProcessingStartDate, getRemainingSlots]);

  const isNormalAvailable = processingDateSlots.normal > 0;
  const isUrgentAvailable = true; // Urgent is always available (unlimited)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to next button helper (gentle scroll to show next button)
  const scrollToNextButton = () => {
    setTimeout(() => {
      const nextBtn = document.getElementById('next-step-btn');
      if (nextBtn) {
        nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Auto-advance when base outfit is selected
  const handleOutfitSelect = (outfit) => {
    setCustomization(prev => ({ ...prev, baseOutfit: outfit }));
    // Auto-advance to next step after short delay
    setTimeout(() => {
      if (step < 5) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);
  };

  const nextStep = () => {
    if (canProceed() && step < 5) {
      setStep(step + 1);
      // Scroll to top on step change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="bg-white py-6 sm:py-8 md:py-12 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gold/10 text-gold-dark px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Interactive Design Studio</span>
            </div>
            <h1 className="section-title mb-3 sm:mb-4">Customize Your Outfit</h1>
            <p className="section-subtitle mx-auto">
              Design exactly what you envision with our step-by-step customizer
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Customizer Area */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Progress Steps */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <React.Fragment key={s}>
                    <button
                      onClick={() => {
                        if (s < step && !orderComplete) {
                          setStep(s);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      disabled={s > step || orderComplete}
                      className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
                        orderComplete
                          ? 'bg-gold text-charcoal'
                          : s === step 
                          ? 'bg-charcoal text-ivory' 
                          : s < step 
                          ? 'bg-gold text-charcoal cursor-pointer hover:bg-gold-dark' 
                          : 'bg-charcoal/10 text-charcoal/40 cursor-not-allowed'
                      }`}
                    >
                      {orderComplete || s < step ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : s}
                    </button>
                    {s < 5 && (
                      <div className={`flex-1 h-0.5 mx-1 rounded ${
                        s < step ? 'bg-gold' : 'bg-charcoal/10'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between text-[8px] sm:text-[10px] text-charcoal/60">
                <span>Outfit</span>
                <span>Neck</span>
                <span>Details</span>
                <span>Measure</span>
                <span>Book</span>
              </div>
            </div>

            {/* Navigation Buttons - Top (smaller) */}
            {!orderComplete && (
              <div className="flex justify-between mb-3 sm:mb-4">
                {step > 1 ? (
                  <button onClick={prevStep} className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-charcoal/20 text-charcoal rounded-sm hover:bg-charcoal/5 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    Back
                  </button>
                ) : <div />}
                
                {step < 5 && (
                  <button 
                    id="next-step-btn"
                    onClick={nextStep} 
                    disabled={!canProceed()}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-charcoal text-ivory rounded-sm hover:bg-gold hover:text-charcoal flex items-center gap-1 ${!canProceed() && 'opacity-50 cursor-not-allowed'}`}
                  >
                    Next
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Step Content */}
            <div className="bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6 md:p-8">
              {/* Step 1: Choose Base Outfit */}
              {step === 1 && (
                <div>
                  <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-medium text-charcoal mb-4 sm:mb-6">
                    Choose Your Base Outfit
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                    {baseOutfits.map((outfit) => (
                      <button
                        key={outfit.id}
                        onClick={() => handleOutfitSelect(outfit)}
                        className={`p-2 sm:p-4 rounded-sm border-2 transition-all text-left ${
                          customization.baseOutfit?.id === outfit.id 
                            ? 'border-gold bg-gold/5' 
                            : 'border-charcoal/10 hover:border-charcoal/30'
                        }`}
                      >
                        <div className="aspect-square bg-charcoal/5 rounded-sm mb-2 sm:mb-3 overflow-hidden">
                          {outfit.image ? (
                            <img 
                              src={outfit.image} 
                              alt={outfit.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-charcoal/30 text-2xl sm:text-4xl">👗</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-charcoal text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 line-clamp-1">{outfit.name}</h3>
                        <p className="text-charcoal/60 text-[10px] sm:text-xs mb-1 sm:mb-2 line-clamp-1 hidden sm:block">{outfit.description}</p>
                        <p className="font-semibold text-charcoal text-sm sm:text-base">₹{outfit.basePrice.toLocaleString()}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Neck Design */}
              {step === 2 && (
                <div>
                  <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-medium text-charcoal mb-2">
                    Select Neck Design
                  </h2>
                  <div className="bg-gold/10 rounded-sm p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm font-medium text-gold-dark flex items-center gap-2">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                      Complimentary Neckline Personalization — bring your own design!
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    {neckDesigns.filter(n => n.id !== 'custom').map((neck) => (
                      <button
                        key={neck.id}
                        onClick={() => {
                          setCustomization(prev => ({ 
                            ...prev, 
                            neckDesign: neck,
                            customNeckImage: null,
                            customNeckPreview: null,
                          }));
                        }}
                        className={`p-2 sm:p-3 rounded-sm border-2 transition-all text-center ${
                          customization.neckDesign?.id === neck.id && !customization.customNeckPreview
                            ? 'border-gold bg-gold/5' 
                            : 'border-charcoal/10 hover:border-charcoal/30'
                        }`}
                      >
                        <div className="aspect-square bg-charcoal/5 rounded-sm mb-2 overflow-hidden">
                          {neck.image ? (
                            <img 
                              src={neck.image} 
                              alt={neck.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl">⭕</div>
                          )}
                        </div>
                        <h4 className="text-[10px] sm:text-sm font-medium text-charcoal line-clamp-1">{neck.name}</h4>
                        <p className="text-[10px] sm:text-xs text-gold-dark mt-0.5 sm:mt-1">FREE</p>
                      </button>
                    ))}
                  </div>

                  {/* Custom Upload */}
                  <div className="border-t border-charcoal/10 pt-4 sm:pt-6">
                    <h3 className="font-medium text-charcoal mb-3 sm:mb-4 text-sm sm:text-base">Or Upload Your Own Design</h3>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all ${
                        customization.customNeckPreview 
                          ? 'border-gold bg-gold/5' 
                          : 'border-charcoal/20 hover:border-charcoal/40'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/svg+xml"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      
                      {customization.customNeckPreview ? (
                        <div className="flex items-center justify-center gap-4">
                          <img 
                            src={customization.customNeckPreview} 
                            alt="Custom neck design" 
                            className="w-24 h-24 object-contain rounded-sm"
                          />
                          <div className="text-left">
                            <p className="font-medium text-charcoal">Custom Design Uploaded</p>
                            <p className="text-sm text-charcoal/60">Click to change</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomization(prev => ({
                                ...prev,
                                customNeckImage: null,
                                customNeckPreview: null,
                                neckDesign: null,
                              }));
                            }}
                            className="p-2 hover:bg-charcoal/10 rounded-sm"
                          >
                            <X className="w-5 h-5 text-charcoal/60" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-charcoal/40 mx-auto mb-3" />
                          <p className="font-medium text-charcoal mb-1">Upload your design</p>
                          <p className="text-sm text-charcoal/60">JPG, PNG, or SVG up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Sleeve, Length, Add-ons */}
              {step === 3 && (
                <div className="space-y-8">
                  {/* Sleeve Style */}
                  <div>
                    <h2 className="font-playfair text-xl font-medium text-charcoal mb-2">
                      Sleeve Style
                    </h2>
                    <div className="bg-gold/10 rounded-sm p-3 mb-4">
                      <p className="text-sm font-medium text-gold-dark flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        All sleeve styles are complimentary!
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {sleeveStyles.map((sleeve) => (
                        <button
                          key={sleeve.id}
                          onClick={() => {
                            setCustomization(prev => ({ ...prev, sleeveStyle: sleeve }));
                          }}
                          className={`p-3 rounded-sm border-2 transition-all text-center ${
                            customization.sleeveStyle?.id === sleeve.id 
                              ? 'border-gold bg-gold/5' 
                              : 'border-charcoal/10 hover:border-charcoal/30'
                          }`}
                        >
                          <h4 className="text-sm font-medium text-charcoal">{sleeve.name}</h4>
                          <p className="text-xs text-gold-dark mt-1">FREE</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fit */}
                  <div>
                    <h2 className="font-playfair text-xl font-medium text-charcoal mb-2">
                      Fit
                    </h2>
                    <div className="bg-gold/10 rounded-sm p-3 mb-4">
                      <p className="text-sm font-medium text-gold-dark flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        All fit options are complimentary!
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {fitOptions.map((fit) => (
                        <button
                          key={fit.id}
                          onClick={() => {
                            setCustomization(prev => ({ ...prev, fit: fit }));
                            scrollToNextButton();
                          }}
                          className={`p-3 rounded-sm border-2 transition-all text-center ${
                            customization.fit?.id === fit.id 
                              ? 'border-gold bg-gold/5' 
                              : 'border-charcoal/10 hover:border-charcoal/30'
                          }`}
                        >
                          <h4 className="text-sm font-medium text-charcoal">{fit.name}</h4>
                          <p className="text-xs text-gold-dark mt-1">FREE</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div>
                    <h2 className="font-playfair text-xl font-medium text-charcoal mb-4">
                      Add-ons (Optional)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {addOns.map((addon) => {
                        const isSelected = customization.selectedAddOns.find(a => a.id === addon.id);
                        return (
                          <button
                            key={addon.id}
                            onClick={() => toggleAddOn(addon)}
                            className={`p-4 rounded-sm border-2 transition-all text-left flex items-start gap-3 ${
                              isSelected 
                                ? 'border-gold bg-gold/5' 
                                : 'border-charcoal/10 hover:border-charcoal/30'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isSelected ? 'border-gold bg-gold' : 'border-charcoal/30'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-charcoal" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-charcoal">{addon.name}</h4>
                                <span className={`text-sm font-medium ${addon.price < 0 ? 'text-green-600' : 'text-gold-dark'}`}>
                                  {addon.price < 0 ? `-₹${Math.abs(addon.price)}` : `+₹${addon.price}`}
                                </span>
                              </div>
                              <p className="text-xs text-charcoal/60 mt-1">{addon.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Price Disclaimer */}
                    <p className="text-xs text-charcoal/50 mt-4 italic">
                      * Final price may vary based on changes discussed over WhatsApp
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Measurement Choice */}
              {step === 4 && !orderComplete && (
                <div>
                  <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-medium text-charcoal mb-4 sm:mb-6">
                    How would you like to provide measurements?
                  </h2>
                  
                  {/* Choice Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                    <button
                      onClick={() => setMeasurementChoice('tailor')}
                      className={`p-4 sm:p-6 rounded-sm border-2 transition-all text-left ${
                        measurementChoice === 'tailor'
                          ? 'border-gold bg-gold/5'
                          : 'border-charcoal/10 hover:border-charcoal/30'
                      }`}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                        <Home className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                      </div>
                      <h3 className="font-medium text-charcoal text-sm sm:text-base mb-1">Send Tailor to My Home</h3>
                      <p className="text-xs sm:text-sm text-charcoal/60">
                        Our expert tailor will visit your doorstep for accurate measurements
                      </p>
                    </button>
                    
                    <button
                      onClick={() => setMeasurementChoice('self')}
                      className={`p-4 sm:p-6 rounded-sm border-2 transition-all text-left ${
                        measurementChoice === 'self'
                          ? 'border-gold bg-gold/5'
                          : 'border-charcoal/10 hover:border-charcoal/30'
                      }`}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-charcoal/10 flex items-center justify-center mb-3">
                        <Ruler className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
                      </div>
                      <h3 className="font-medium text-charcoal text-sm sm:text-base mb-1">I'll Provide Measurements</h3>
                      <p className="text-xs sm:text-sm text-charcoal/60">
                        Enter your measurements manually
                      </p>
                    </button>
                  </div>
                  
                  {/* Tailor Visit - Date Picker */}
                  {measurementChoice === 'tailor' && (
                    <div className="space-y-4">
                      <div className="bg-gold/5 rounded-sm p-4 sm:p-6 border border-gold/20">
                        <label className="block text-sm font-medium text-charcoal mb-3">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Select Tailor Visit Date
                        </label>
                        <p className="text-xs text-charcoal/60 mb-3">
                          Choose a date for our tailor to visit. Same-day visits are not available.
                        </p>
                        <DatePicker
                          selectedDate={tailorDate}
                          onDateSelect={(date) => setTailorDate(date)}
                        />
                      </div>

                      {/* Show processing info when date selected */}
                      {tailorDate && (
                        <div className="bg-charcoal/5 rounded-sm p-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-charcoal/60" />
                            <span className="text-charcoal/70">Processing starts:</span>
                            <span className="font-medium text-charcoal">
                              {format(getProcessingStartDate, 'EEEE, MMM d')} at 12:00 AM
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-gold" />
                            <span className="text-charcoal/70">Estimated Delivery:</span>
                            <span className={`font-medium ${isUrgent ? 'text-wine' : 'text-charcoal'}`}>
                              {format(getDeliveryDate(getProcessingStartDate, isUrgent), 'EEEE, MMM d')}
                            </span>
                          </div>
                          <p className="text-xs text-charcoal/60 mt-2">
                            * Your order can be delivered before this date
                          </p>
                        </div>
                      )}


                    </div>
                  )}
                  
                  {/* Self Measurement Form */}
                  {measurementChoice === 'self' && (
                    <div className="space-y-4">
                      <div className="bg-charcoal/5 rounded-sm p-4 sm:p-6">
                        <h3 className="font-medium text-charcoal mb-3 text-sm sm:text-base">Enter Your Measurements (in inches)</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                          {(() => {
                            // Determine which length fields to show based on selected outfit
                            const outfitId = customization.baseOutfit?.id || '';
                            
                            // One-piece outfits that need total length only
                            const totalLengthOutfits = ['jumpsuit', 'gown', 'fish-cut-lehenga'];
                            
                            // Blouse-only outfits that need just top length
                            const blouseOnlyOutfits = ['simple-blouse', 'lining-blouse', 'padded-blouse', 'princess-blouse', 'sabyasachi-blouse', 'bridal-blouse'];
                            
                            // Default measurements
                            let measurementFields = [
                              { key: 'bust', label: 'Bust/Chest *' },
                              { key: 'waist', label: 'Waist *' },
                              { key: 'hips', label: 'Hips' },
                              { key: 'shoulderWidth', label: 'Shoulder Width' },
                              { key: 'sleeveLength', label: 'Sleeve Length' },
                            ];
                            
                            // Add appropriate length fields
                            if (totalLengthOutfits.includes(outfitId)) {
                              // One-piece: total length only
                              measurementFields.push({ key: 'totalLength', label: 'Total Length' });
                            } else if (blouseOnlyOutfits.includes(outfitId)) {
                              // Blouse: top length only
                              measurementFields.push({ key: 'topLength', label: 'Blouse Length' });
                            } else {
                              // Suits: both top and bottom length
                              measurementFields.push({ key: 'topLength', label: 'Top/Kurta Length' });
                              measurementFields.push({ key: 'bottomLength', label: 'Bottom Length' });
                            }
                            
                            return measurementFields;
                          })().map(({ key, label }) => (
                            <div key={key}>
                              <label className="block text-xs sm:text-sm text-charcoal/70 mb-1">{label}</label>
                              <input
                                type="number"
                                value={measurements[key]}
                                onChange={(e) => setMeasurements(prev => ({ ...prev, [key]: e.target.value }))}
                                className="w-full px-3 py-2 text-sm border border-charcoal/20 rounded-sm focus:outline-none focus:border-gold"
                                placeholder="0"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Processing & Delivery Info for Self Measure */}
                      <div className="bg-charcoal/5 rounded-sm p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-charcoal/60" />
                          <span className="text-charcoal/70">Processing starts:</span>
                          <span className="font-medium text-charcoal">
                            {format(getProcessingStartDate, 'EEEE, MMM d')} at 12:00 AM
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-gold" />
                          <span className="text-charcoal/70">Estimated Delivery:</span>
                          <span className={`font-medium ${isUrgent ? 'text-wine' : 'text-charcoal'}`}>
                            {format(getDeliveryDate(getProcessingStartDate, isUrgent), 'EEEE, MMM d')}
                            {isUrgent ? ' (36 hours)' : ' (approx 7-14 days)'}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/60 mt-2">
                          * Your order can be delivered before this date
                        </p>
                      </div>


                    </div>
                  )}

                  {/* Urgent Toggle */}
                  {measurementChoice && (
                    <div className="mt-6 p-4 bg-wine/5 border border-wine/20 rounded-sm">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isUrgent}
                          onChange={(e) => setIsUrgent(e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded border-charcoal/30 text-wine focus:ring-wine mt-0.5"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-charcoal text-sm sm:text-base">🔴 Urgent Order</span>
                          </div>
                          <p className="text-xs text-wine mt-0.5">+30% surcharge • Delivery in 36 hours from processing start</p>
                          <p className="text-xs text-charcoal/50 mt-1">Max 2 urgent orders per day</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Review & Book */}
              {step === 5 && !orderComplete && (
                <div>
                  <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-medium text-charcoal mb-4 sm:mb-6">
                    Review & Confirm
                  </h2>
                  
                  {/* Order Summary */}
                  <div className="bg-charcoal/5 rounded-sm p-3 sm:p-4 mb-4 sm:mb-6">
                    <h3 className="font-medium text-charcoal mb-2 sm:mb-3 text-sm sm:text-base">Order Summary</h3>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Outfit</span>
                        <span className="font-medium text-charcoal">{customization.baseOutfit?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Neck Design</span>
                        <span className="text-charcoal">{customization.neckDesign?.name} <span className="text-gold-dark">(FREE)</span></span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Sleeve/Fit</span>
                        <span className="text-charcoal">{customization.sleeveStyle?.name} / {customization.fit?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Measurement</span>
                        <span className="text-charcoal">
                          {measurementChoice === 'tailor' 
                            ? `Tailor visit on ${tailorDate ? format(tailorDate, 'MMM d') : 'TBD'}` 
                            : 'Self-provided'}
                        </span>
                      </div>
                      {isUrgent && (
                        <div className="flex justify-between text-wine">
                          <span>Urgent (+30%)</span>
                          <span>+₹{pricing.urgentSurcharge}</span>
                        </div>
                      )}
                      <div className="border-t border-charcoal/20 pt-2 mt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-base sm:text-lg">₹{pricing.total}</span>
                      </div>
                      {pricing.advanceAmount > 0 && (
                        <div className="flex justify-between text-gold-dark text-xs">
                          <span>Advance (30%)</span>
                          <span>₹{pricing.advanceAmount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-gold/10 rounded-sm p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm text-charcoal">
                      <strong>Estimated Delivery:</strong>{' '}
                      {isUrgent 
                        ? format(deliveryDates.urgent || addHours(getProcessingStartDate, 36), 'EEEE, MMM d, yyyy')
                        : format(deliveryDates.normal || addDays(getProcessingStartDate, 7), 'EEEE, MMM d, yyyy')
                      }
                      <br />
                      <span className="text-charcoal/60">
                        ({isUrgent ? '~36 hours' : '7 days'} after processing starts)
                      </span>
                    </p>
                  </div>

                  {/* Additional Details Section */}
                  <div className="bg-white border border-charcoal/10 rounded-sm p-3 sm:p-4 mb-4 sm:mb-6">
                    <h3 className="font-medium text-charcoal mb-3 text-sm sm:text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      Additional Details (Optional)
                    </h3>
                    <p className="text-xs text-charcoal/60 mb-4">
                      Upload reference images or add special instructions. <span className="text-wine font-medium">Extra charges may apply</span> based on complexity.
                    </p>
                    
                    {/* Additional Images Upload */}
                    <div className="mb-4">
                      <label className="block text-xs sm:text-sm text-charcoal/70 mb-2">Reference Images (Max 5)</label>
                      <input
                        ref={additionalImagesRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        onChange={handleAdditionalImagesUpload}
                        multiple
                        className="hidden"
                      />
                      
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {additionalDetails.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-sm overflow-hidden border border-charcoal/20">
                              <img 
                                src={img.preview} 
                                alt={`Reference ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-wine text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <input
                              type="text"
                              value={img.description}
                              onChange={(e) => updateImageDescription(index, e.target.value)}
                              placeholder="Label"
                              className="mt-1 w-full px-1 py-0.5 text-[10px] border border-charcoal/10 rounded-sm"
                            />
                          </div>
                        ))}
                        
                        {additionalDetails.images.length < 5 && (
                          <button
                            onClick={() => additionalImagesRef.current?.click()}
                            className="aspect-square rounded-sm border-2 border-dashed border-charcoal/20 flex flex-col items-center justify-center gap-1 hover:border-gold hover:bg-gold/5 transition-all"
                          >
                            <Upload className="w-5 h-5 text-charcoal/40" />
                            <span className="text-[10px] text-charcoal/50">Add Image</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Additional Remarks */}
                    <div>
                      <label className="block text-xs sm:text-sm text-charcoal/70 mb-1">Special Instructions / Remarks</label>
                      <textarea
                        value={additionalDetails.remarks}
                        onChange={(e) => setAdditionalDetails(prev => ({ ...prev, remarks: e.target.value }))}
                        placeholder="Any special requirements, design preferences, or notes for the tailor..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-charcoal/20 rounded-sm focus:outline-none focus:border-gold resize-none"
                      />
                    </div>
                    
                    {(additionalDetails.images.length > 0 || additionalDetails.remarks) && (
                      <div className="mt-3 p-2 bg-wine/10 border border-wine/20 rounded-sm">
                        <p className="text-xs text-wine flex items-center gap-2">
                          <Info className="w-3 h-3" />
                          Note: Extra charges may apply based on additional design requirements
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-charcoal/5 rounded-sm p-3 sm:p-4 mb-4 sm:mb-6">
                    <h3 className="font-medium text-charcoal mb-3 text-sm sm:text-base flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-wine" />
                      Important Terms & Conditions
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-charcoal/70">
                      <li className="flex items-start gap-2">
                        <span className="text-wine">•</span>
                        <span><strong>Fabric Damage:</strong> If your fabric is damaged or defective before starting processing, we are not liable for the final outcome.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-wine">•</span>
                        <span><strong>Alteration Policy:</strong> One free alteration is offered with free pick up and drop soon after delivery.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-wine">•</span>
                        <span><strong>Payment:</strong> Complete payment must be made at the time of delivery. Payment modes: QR or Cash only.</span>
                      </li>
                      {pricing.advanceAmount > 0 && (
                        <li className="flex items-start gap-2">
                          <span className="text-gold-dark">•</span>
                          <span><strong>Advance Payment:</strong> ₹{pricing.advanceAmount} advance is required (non-refundable). Pay via QR scanner or to the {measurementChoice === 'tailor' ? 'tailor during visit' : 'pickup boy'}.</span>
                        </li>
                      )}
                      <li className="flex items-start gap-2">
                        <span className="text-wine">•</span>
                        <span><strong>Agreement:</strong> By confirming, you agree to these terms and our tailoring guidelines.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Booking Form */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-medium text-charcoal text-sm sm:text-base">Your Details</h3>
                    
                    <div>
                      <label className="block text-xs sm:text-sm text-charcoal/70 mb-1">Name *</label>
                      <input
                        type="text"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-charcoal/20 rounded-sm focus:outline-none focus:border-gold"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm text-charcoal/70 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="10-digit mobile number"
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-charcoal/20 rounded-sm focus:outline-none focus:border-gold"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm text-charcoal/70 mb-1">Address *</label>
                      <textarea
                        value={bookingForm.address}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Full address for pickup and delivery"
                        rows={2}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-charcoal/20 rounded-sm focus:outline-none focus:border-gold resize-none"
                      />
                    </div>
                  </div>

                  {/* Confirmation Checkboxes */}
                  <div className="space-y-3 mb-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedMeasurementResponsibility}
                        onChange={(e) => setAcceptedMeasurementResponsibility(e.target.checked)}
                        className="w-5 h-5 rounded border-charcoal/30 text-gold focus:ring-gold mt-0.5"
                      />
                      <div>
                        <span className="text-xs sm:text-sm text-charcoal">
                          {measurementChoice === 'tailor'
                            ? "I confirm that I will be available at the scheduled time for the tailor's visit."
                            : "I confirm that the measurements provided are accurate. I understand that SLIQUES is not responsible for fit issues arising from incorrect measurements provided by me."
                          }
                        </span>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="w-5 h-5 rounded border-charcoal/30 text-gold focus:ring-gold mt-0.5"
                      />
                      <div>
                        <span className="text-xs sm:text-sm text-charcoal">
                          I agree to the Terms & Conditions{pricing.advanceAmount > 0 && " and understand that advance payment is non-refundable in case of cancellation"}.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <button
                      onClick={handleWhatsAppShare}
                      className="px-4 py-2.5 text-sm border border-charcoal/20 text-charcoal rounded-sm hover:bg-charcoal/5 flex items-center justify-center gap-2 flex-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Share on WhatsApp
                    </button>
                    <button
                      onClick={handleBookingSubmit}
                      disabled={!canProceed() || isSubmitting}
                      className={`px-4 py-2.5 text-sm bg-gold text-charcoal rounded-sm hover:bg-gold-dark flex items-center justify-center gap-2 flex-1 font-medium ${(!canProceed() || isSubmitting) && 'opacity-50 cursor-not-allowed'}`}
                    >
                      {isSubmitting ? (
                        <>
                          <Scissors className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Order Confirmation */}
              {step === 5 && orderComplete && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-gold" />
                  </div>
                  <h2 className="font-playfair text-2xl font-medium text-charcoal mb-3">
                    Booking Confirmed!
                  </h2>
                  <p className="text-charcoal/70 mb-6">
                    Thank you, {orderDetails?.customerName}! Your order has been placed successfully.
                  </p>
                  
                  <div className="bg-charcoal/5 rounded-sm p-4 mb-6 text-left max-w-md mx-auto">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Order ID</span>
                        <span className="font-mono font-medium text-charcoal">{orderDetails?.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Expected Delivery</span>
                        <span className="font-medium text-charcoal">
                          {orderDetails?.deliveryDate && format(new Date(orderDetails.deliveryDate), 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                      {orderDetails?.advanceRequired > 0 && (
                        <div className="flex justify-between text-gold-dark">
                          <span>Advance Required</span>
                          <span className="font-medium">₹{orderDetails?.advanceRequired?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {orderDetails?.advanceRequired > 0 && (
                    <div className="bg-gold/10 rounded-sm p-4 mb-6 max-w-md mx-auto">
                      <p className="text-sm text-gold-dark">
                        <strong>Note:</strong> Please pay the advance amount. We'll send you the payment scanner via WhatsApp shortly.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <button
                      onClick={handleDownloadPDF}
                      className="btn-secondary flex-1"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Invoice
                    </button>
                    <a
                      href={`https://wa.me/919310282351?text=${encodeURIComponent(`Hi! I just placed order ${orderDetails?.id}. Looking forward to my beautiful outfit! 🪡`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp flex-1"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Chat with Us
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons - Bottom (smaller) */}
            {!orderComplete && (
              <div className="flex justify-between mt-4">
                {step > 1 ? (
                  <button onClick={prevStep} className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-charcoal/20 text-charcoal rounded-sm hover:bg-charcoal/5 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    Back
                  </button>
                ) : <div />}
                
                {step < 5 && (
                  <button 
                    onClick={nextStep} 
                    disabled={!canProceed()}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-charcoal text-ivory rounded-sm hover:bg-gold hover:text-charcoal flex items-center gap-1 ${!canProceed() && 'opacity-50 cursor-not-allowed'}`}
                  >
                    Next
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Live Price Calculator */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-32 bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6">
              <h3 className="font-playfair text-base sm:text-lg md:text-xl font-medium text-charcoal mb-4 sm:mb-6">
                Live Price
              </h3>
              
              {customization.baseOutfit ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Base ({customization.baseOutfit.name})</span>
                    <span className="text-charcoal">₹{customization.baseOutfit.basePrice}</span>
                  </div>
                  
                  {customization.neckDesign && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal/70">{customization.neckDesign.name}</span>
                      <span className="text-gold-dark">FREE</span>
                    </div>
                  )}
                  
                  {customization.sleeveStyle && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal/70">{customization.sleeveStyle.name}</span>
                      <span className="text-gold-dark">FREE</span>
                    </div>
                  )}
                  
                  {customization.fit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal/70">{customization.fit.name}</span>
                      <span className="text-gold-dark">FREE</span>
                    </div>
                  )}
                  
                  {customization.selectedAddOns.length > 0 && (
                    <>
                      <div className="border-t border-charcoal/10 pt-2">
                        <span className="text-xs text-charcoal/50 uppercase">Add-ons</span>
                      </div>
                      {customization.selectedAddOns.map(addon => (
                        <div key={addon.id} className="flex justify-between text-sm">
                          <span className="text-charcoal/70">{addon.name}</span>
                          <span className="text-charcoal">+₹{addon.price}</span>
                        </div>
                      ))}
                    </>
                  )}
                  
                  {isUrgent && (
                    <div className="flex justify-between text-sm text-wine">
                      <span>Urgent (+30%)</span>
                      <span>+₹{pricing.urgentSurcharge}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-charcoal/10 pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-charcoal">Total</span>
                      <span className="text-xl sm:text-2xl font-bold text-charcoal">₹{pricing.total.toLocaleString()}</span>
                    </div>
                    {pricing.advanceAmount > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-charcoal/70">Advance (30%)</span>
                        <span className="text-gold-dark font-medium">₹{pricing.advanceAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>


                </div>
              ) : (
                <div className="text-center py-4 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-charcoal/5 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-charcoal/30" />
                  </div>
                  <p className="text-charcoal/50 text-xs sm:text-sm">
                    Select options to see live pricing
                  </p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-charcoal/10 space-y-2 sm:space-y-3 hidden lg:block">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal/70">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  <span>Free Pickup & Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal/70">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  <span>Free Alteration</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal/70">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  <span>Complimentary Neckline Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
