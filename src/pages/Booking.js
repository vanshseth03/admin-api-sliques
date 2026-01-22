import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { format, addDays, addHours, startOfDay } from 'date-fns';
import { Calendar, AlertCircle, Check, MapPin, CreditCard, Info, ChevronRight, User, Phone, Ruler, Home, Download, MessageCircle, ArrowLeft, Clock, Scissors } from 'lucide-react';
import DatePicker from '../components/DatePicker';
import { useBooking, BOOKING_RULES } from '../context/BookingContext';
import { getAllServices, getServiceById } from '../data/services';
import { downloadOrderPDF } from '../utils/pdfGenerator';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get('service');
  
  const { 
    hasNormalSlotsAvailable, 
    hasUrgentSlotsAvailable, 
    getRemainingSlots,
    isUrgentAllowed,
    calculatePrice,
    createBooking,
  } = useBooking();

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    serviceId: preSelectedService || '',
    bookingType: 'normal',
    selectedDate: null,
    selectedSlot: '',
    tailorAtDoorstep: false,
    // Customer details
    customerName: '',
    phone: '',
    address: '',
    // Measurements
    measurements: {
      bust: '',
      waist: '',
      hips: '',
      shoulderWidth: '',
      sleeveLength: '',
      topLength: '',
      bottomLength: '',
      totalLength: '',
      height: '',
    },
    // Terms
    acceptedTerms: false,
    acceptedMeasurementResponsibility: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);

  const allServices = getAllServices();
  const selectedService = getServiceById(bookingData.serviceId);

  // Check slot availability when date changes
  const slotsInfo = bookingData.selectedDate 
    ? getRemainingSlots(bookingData.selectedDate)
    : { normal: 0, urgent: 0 };

  const normalAvailable = bookingData.selectedDate 
    ? hasNormalSlotsAvailable(bookingData.selectedDate)
    : true;

  const urgentAvailable = bookingData.selectedDate 
    ? hasUrgentSlotsAvailable(bookingData.selectedDate)
    : false;

  // Calculate pricing
  const pricing = selectedService 
    ? calculatePrice(selectedService.basePrice, bookingData.bookingType === 'urgent', [], selectedService.requiresAdvance)
    : { total: 0, advanceAmount: 0, urgentSurcharge: 0 };

  // Validation
  const validateStep = (stepNum) => {
    const newErrors = {};
    
    if (stepNum === 1) {
      if (!bookingData.serviceId) newErrors.service = 'Please select a service';
    }
    
    if (stepNum === 2) {
      if (!bookingData.customerName.trim()) newErrors.customerName = 'Name is required';
      if (!bookingData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(bookingData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
      if (!bookingData.address.trim()) newErrors.address = 'Address is required';
    }
    
    if (stepNum === 3) {
      // Date/Measure step: validate based on tailor choice
      if (bookingData.tailorAtDoorstep) {
        if (!bookingData.selectedDate) newErrors.date = 'Please select a date for tailor visit';
      } else {
        const requiredMeasurements = ['bust', 'waist'];
        requiredMeasurements.forEach(m => {
          if (!bookingData.measurements[m]) {
            newErrors[`measurement_${m}`] = `${m.charAt(0).toUpperCase() + m.slice(1)} measurement is required`;
          }
        });
      }
    }
    
    if (stepNum === 4) {
      if (!bookingData.acceptedTerms) newErrors.terms = 'Please accept the terms and conditions';
      if (!bookingData.acceptedMeasurementResponsibility) {
        newErrors.measurementResponsibility = 'Please accept measurement responsibility';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get processing start date based on measurement method
  // Self-measure: processing starts at 12:00 AM next day
  // Tailor visit: processing starts at 12:00 AM day after visit
  const getProcessingStartDate = (measurementDate = null) => {
    if (bookingData.tailorAtDoorstep && measurementDate) {
      // Processing starts at 12:00 AM the day after tailor visit
      return startOfDay(addDays(measurementDate, 1));
    } else {
      // Self-measure: processing starts at 12:00 AM next day
      return startOfDay(addDays(new Date(), 1));
    }
  };

  // Calculate delivery date from processing start
  // Urgent: 36 hours from processing start
  // Normal: 7 days from processing start (may arrive earlier)
  const getDeliveryDate = (processingStart, isUrgentOrder) => {
    if (!processingStart) return null;
    if (isUrgentOrder) {
      return addHours(processingStart, 36);
    }
    return addDays(processingStart, 7);
  };

  // Get current processing start date for display
  const currentProcessingStart = useMemo(() => {
    if (bookingData.tailorAtDoorstep && bookingData.selectedDate) {
      return startOfDay(addDays(bookingData.selectedDate, 1));
    }
    return startOfDay(addDays(new Date(), 1));
  }, [bookingData.tailorAtDoorstep, bookingData.selectedDate]);

  // Check availability for processing start date
  const processingDateSlots = useMemo(() => {
    return getRemainingSlots(currentProcessingStart);
  }, [currentProcessingStart, getRemainingSlots]);

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

  // Scroll to next button helper
  const scrollToNextButton = () => {
    setTimeout(() => {
      const nextBtn = document.getElementById('next-step-btn');
      if (nextBtn) {
        nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      scrollToTop();
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    scrollToTop();
  };

  // Auto-advance when service is selected (gentle, no scroll)
  const handleServiceSelect = (serviceId) => {
    setBookingData(prev => ({ ...prev, serviceId }));
    setTimeout(() => {
      setStep(2);
    }, 300);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate delivery based on processing start date
      const deliveryDate = getDeliveryDate(currentProcessingStart, bookingData.bookingType === 'urgent');
      const estimatedDelivery = deliveryDate ? format(deliveryDate, 'yyyy-MM-dd') : format(addDays(new Date(), 7), 'yyyy-MM-dd');
      
      // Determine measurement/visit date - this is for tailor visit if selected
      const tailorVisitDate = bookingData.tailorAtDoorstep && bookingData.selectedDate 
        ? format(bookingData.selectedDate, 'yyyy-MM-dd')
        : null;
      
      // Map measurements to the format expected by admin portal  
      const measurementsData = !bookingData.tailorAtDoorstep ? {
        bust: bookingData.measurements.bust,
        waist: bookingData.measurements.waist,
        hips: bookingData.measurements.hips,
        shoulderWidth: bookingData.measurements.shoulderWidth,
        sleeveLength: bookingData.measurements.sleeveLength,
        blouseLength: bookingData.measurements.topLength,
        height: bookingData.measurements.height || bookingData.measurements.totalLength,
      } : {};

      const newBooking = await createBooking({
        ...bookingData,
        measurements: measurementsData,
        measurementMethod: bookingData.tailorAtDoorstep ? 'tailor' : 'self',
        tailorVisitDate: tailorVisitDate,
        bookingDate: format(new Date(), 'yyyy-MM-dd'), // Today's date - when booking was made
        processingStartDate: format(currentProcessingStart, 'yyyy-MM-dd'),
        preferredSlot: 'Flexible',
        estimatedDelivery,
        serviceName: selectedService.name,
        totalAmount: pricing.total,
        advanceAmount: pricing.advanceAmount,
        advancePaid: pricing.advanceAmount > 0,
      });
      
      setCompletedBooking(newBooking);
      setBookingComplete(true);
      // Scroll to top to show confirmation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Booking complete view
  if (bookingComplete && completedBooking) {
    const handleDownloadInvoice = () => {
      downloadOrderPDF({
        orderId: completedBooking.id,
        customerName: completedBooking.customerName,
        phone: completedBooking.phone,
        address: completedBooking.address,
        serviceName: completedBooking.serviceName,
        serviceType: completedBooking.bookingType === 'urgent' ? 'Urgent Order' : 'Standard',
        basePrice: selectedService?.basePrice || 0,
        urgentSurcharge: completedBooking.bookingType === 'urgent' ? Math.round((selectedService?.basePrice || 0) * 0.3) : 0,
        total: completedBooking.totalAmount,
        advanceAmount: completedBooking.advanceAmount || 0,
        balanceAmount: completedBooking.totalAmount - (completedBooking.advanceAmount || 0),
        bookingType: completedBooking.bookingType,
        deliveryDate: completedBooking.estimatedDelivery,
        tailorVisitDate: completedBooking.tailorVisitDate,
        measurementMethod: completedBooking.measurementMethod || (completedBooking.tailorAtDoorstep ? 'tailor' : 'self'),
        measurements: completedBooking.measurements,
      });
    };

    return (
      <div className="min-h-screen bg-ivory py-8 sm:py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6 md:p-8 text-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Check className="w-7 h-7 sm:w-10 sm:h-10 text-gold" />
            </div>
            <h1 className="font-playfair text-xl sm:text-2xl md:text-3xl font-medium text-charcoal mb-3 sm:mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-charcoal/70 text-sm sm:text-base mb-4 sm:mb-6">
              Thank you for choosing SLIQUES. We'll be in touch soon.
            </p>
            
            <div className="bg-charcoal/5 rounded-sm p-4 sm:p-6 text-left mb-6 sm:mb-8">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-charcoal/60">Booking ID</span>
                  <p className="font-mono font-medium text-charcoal text-xs sm:text-sm break-all">{completedBooking.id}</p>
                </div>
                <div>
                  <span className="text-charcoal/60">Service</span>
                  <p className="font-medium text-charcoal">{completedBooking.serviceName}</p>
                </div>
                <div>
                  <span className="text-charcoal/60">Date</span>
                  <p className="font-medium text-charcoal">{completedBooking.bookingDate}</p>
                </div>
                <div>
                  <span className="text-charcoal/60">Measurement</span>
                  <p className="font-medium text-charcoal">{completedBooking.tailorAtDoorstep ? 'Tailor Visit' : 'Self-Provided'}</p>
                </div>
                <div>
                  <span className="text-charcoal/60">Total Amount</span>
                  <p className="font-medium text-charcoal">₹{completedBooking.totalAmount}</p>
                </div>
                {completedBooking.advanceAmount > 0 && (
                  <div>
                    <span className="text-charcoal/60">Advance Required</span>
                    <p className="font-medium text-gold-dark">₹{completedBooking.advanceAmount}</p>
                  </div>
                )}
              </div>
            </div>

            {completedBooking.advanceAmount > 0 && (
              <div className="bg-gold/10 rounded-sm p-4 mb-6 text-left space-y-2">
                <p className="text-sm text-gold-dark font-medium">
                  💰 Advance Payment: ₹{completedBooking.advanceAmount}
                </p>
                <p className="text-sm text-charcoal/80">
                  We'll send you the payment scanner via WhatsApp shortly.
                </p>
                <p className="text-xs text-charcoal/70 bg-charcoal/5 rounded p-2">
                  ⚠️ <strong>Safety Note:</strong> Only pay via scanner sent from our official WhatsApp (+91 93102 82351). You can also pay in cash or UPI during doorstep measurement visit.
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleDownloadInvoice} className="btn-secondary">
                <Download className="w-5 h-5 mr-2" />
                Download Invoice
              </button>
              <a
                href={`https://wa.me/919310282351?text=${encodeURIComponent(`Hi! I just booked ${completedBooking.serviceName} (ID: ${completedBooking.id}). Looking forward to it!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with Us
              </a>
            </div>
            
            <div className="mt-6 pt-6 border-t border-charcoal/10">
              <Link to="/" className="text-gold hover:underline text-sm">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="bg-white py-6 sm:py-8 md:py-12 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="section-title mb-3 sm:mb-4">Book a Slot</h1>
            <p className="section-subtitle mx-auto">
              We limit bookings so each piece receives expert attention
            </p>
          </div>
        </div>
      </section>

      {/* Service Area Notice */}
      <div className="bg-gold/10 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
            <span className="text-charcoal">
              <strong>Service Area:</strong> Raj Nagar Extension only
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {['Service', 'Details', 'Date/Measure', 'Confirm'].map((label, index) => {
              const stepNum = index + 1;
              return (
                <React.Fragment key={stepNum}>
                  <div className="flex flex-col items-center min-w-[48px] sm:min-w-[60px]">
                    <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      stepNum === step 
                        ? 'bg-charcoal text-ivory' 
                        : stepNum < step 
                        ? 'bg-gold text-charcoal' 
                        : 'bg-charcoal/10 text-charcoal/40'
                    }`}>
                      {stepNum < step ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : stepNum}
                    </div>
                    <span className={`text-[9px] sm:text-xs mt-1 whitespace-nowrap ${
                      stepNum === step ? 'text-charcoal font-medium' : 'text-charcoal/50'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {stepNum < 4 && (
                    <div className={`flex-1 h-0.5 mx-0.5 sm:mx-1 ${
                      stepNum < step ? 'bg-gold' : 'bg-charcoal/10'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Navigation Buttons - Top (smaller) */}
            <div className="flex justify-between mb-4 sm:mb-6">
              {step > 1 ? (
                <button onClick={prevStep} className="btn-secondary px-3 py-1.5 text-sm">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              ) : (
                <div />
              )}
              
              {step < 4 && (
                <button id="next-step-btn" onClick={nextStep} className="btn-primary px-3 py-1.5 text-sm">
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>

            <div className="bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6 md:p-8">
              {/* Step 1: Select Service */}
              {step === 1 && (
                <div>
                  <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-medium text-charcoal mb-4 sm:mb-6">
                    Select a Service
                  </h2>
                  
                  {errors.service && (
                    <div className="bg-wine/10 text-wine text-sm p-3 rounded-sm mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.service}
                    </div>
                  )}
                  
                  <div className="space-y-2 sm:space-y-3">
                    {allServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className={`w-full p-3 sm:p-4 rounded-sm border-2 transition-all text-left flex items-center gap-3 sm:gap-4 ${
                          bookingData.serviceId === service.id 
                            ? 'border-gold bg-gold/5' 
                            : 'border-charcoal/10 hover:border-charcoal/30'
                        }`}
                      >
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          bookingData.serviceId === service.id 
                            ? 'border-gold bg-gold' 
                            : 'border-charcoal/30'
                        }`}>
                          {bookingData.serviceId === service.id && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-charcoal" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-medium text-charcoal text-sm sm:text-base truncate">{service.name}</h3>
                            <span className="font-semibold text-charcoal text-sm sm:text-base flex-shrink-0">₹{service.basePrice}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-charcoal/60 mt-0.5 sm:mt-1">{service.categoryName} • {service.estimatedDays} days</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Customer Details */}
              {step === 2 && (
                <div>
                  <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-medium text-charcoal mb-4 sm:mb-6">
                    Your Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={bookingData.customerName}
                        onChange={(e) => setBookingData(prev => ({ ...prev, customerName: e.target.value }))}
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                      {errors.customerName && (
                        <p className="text-wine text-sm mt-1">{errors.customerName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                        className="input-field"
                        placeholder="10-digit phone number"
                      />
                      {errors.phone && (
                        <p className="text-wine text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        <Home className="w-4 h-4 inline mr-2" />
                        Address in Raj Nagar Extension *
                      </label>
                      <textarea
                        value={bookingData.address}
                        onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
                        className="input-field min-h-[100px]"
                        placeholder="Full address for pickup & delivery"
                      />
                      {errors.address && (
                        <p className="text-wine text-sm mt-1">{errors.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Booking Type Selection */}
                  <div className="mt-6 pt-6 border-t border-charcoal/10">
                    <label className="block text-sm font-medium text-charcoal mb-3">
                      Order Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => isNormalAvailable && setBookingData(prev => ({ ...prev, bookingType: 'normal' }))}
                        disabled={!isNormalAvailable}
                        className={`p-4 rounded-sm border-2 transition-all text-left ${
                          !isNormalAvailable 
                            ? 'border-charcoal/10 bg-charcoal/5 opacity-50 cursor-not-allowed'
                            : bookingData.bookingType === 'normal' 
                              ? 'border-charcoal bg-charcoal/5' 
                              : 'border-charcoal/10 hover:border-charcoal/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-charcoal">🟢 Normal</h3>
                        </div>
                        <p className="text-sm text-charcoal/60">Delivered in approx 7-14 days</p>
                        <p className="text-xs text-charcoal/50 mt-1">May arrive earlier</p>
                      </button>
                      <button
                        onClick={() => isUrgentAvailable && setBookingData(prev => ({ ...prev, bookingType: 'urgent' }))}
                        disabled={!isUrgentAvailable}
                        className={`p-4 rounded-sm border-2 transition-all text-left ${
                          !isUrgentAvailable 
                            ? 'border-charcoal/10 bg-charcoal/5 opacity-50 cursor-not-allowed'
                            : bookingData.bookingType === 'urgent' 
                              ? 'border-wine bg-wine/5' 
                              : 'border-charcoal/10 hover:border-charcoal/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-charcoal">🔴 Urgent</h3>
                        </div>
                        <p className="text-sm text-charcoal/60">Delivered in 36 hours</p>
                        <p className="text-xs text-wine mt-1">+30% surcharge</p>
                      </button>
                    </div>
                    {!isNormalAvailable && (
                      <p className="text-xs text-charcoal/60 mt-3 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Normal orders fully booked for this date. Choose urgent or a different date.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Date/Measure */}
              {step === 3 && (
                <div>
                  <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-medium text-charcoal mb-4 sm:mb-6">
                    How will we get your measurements?
                  </h2>
                  
                  {/* Measurement Choice */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setBookingData(prev => ({ 
                        ...prev, 
                        tailorAtDoorstep: true,
                        selectedDate: null,
                        selectedSlot: '',
                      }))}
                      className={`p-4 sm:p-6 rounded-sm border-2 transition-all text-left ${
                        bookingData.tailorAtDoorstep 
                          ? 'border-gold bg-gold/5' 
                          : 'border-charcoal/10 hover:border-charcoal/30'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                        <Home className="w-6 h-6 text-gold" />
                      </div>
                      <h3 className="font-medium text-charcoal mb-1">Send Tailor Home</h3>
                      <p className="text-sm text-charcoal/60">
                        Our expert tailor visits for precise measurements
                      </p>
                    </button>
                    
                    <button
                      onClick={() => setBookingData(prev => ({ 
                        ...prev, 
                        tailorAtDoorstep: false,
                        selectedDate: null,
                        selectedSlot: '',
                      }))}
                      className={`p-4 sm:p-6 rounded-sm border-2 transition-all text-left ${
                        !bookingData.tailorAtDoorstep 
                          ? 'border-gold bg-gold/5' 
                          : 'border-charcoal/10 hover:border-charcoal/30'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                        <Ruler className="w-6 h-6 text-gold" />
                      </div>
                      <h3 className="font-medium text-charcoal mb-1">Give Measurements</h3>
                      <p className="text-sm text-charcoal/60">
                        I'll provide my own measurements
                      </p>
                    </button>
                  </div>

                  {/* Tailor at Doorstep: Date Picker */}
                  {bookingData.tailorAtDoorstep && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Select Tailor Visit Date
                        </label>
                        <p className="text-xs text-charcoal/60 mb-3">
                          Choose a date for our tailor to visit. Same-day visits are not available.
                        </p>
                        <DatePicker
                          selectedDate={bookingData.selectedDate}
                          onDateSelect={(date) => setBookingData(prev => ({ 
                            ...prev, 
                            selectedDate: date,
                            bookingType: prev.bookingType
                          }))}
                          getDateAvailability={(date) => {
                            const slots = getRemainingSlots(date);
                            return { hasSlots: slots.normal > 0, slotsLeft: slots.normal };
                          }}
                        />
                        {errors.date && (
                          <p className="text-wine text-sm mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.date}
                          </p>
                        )}
                      </div>

                      {/* Show processing info when date selected */}
                      {bookingData.selectedDate && (
                        <div className="bg-charcoal/5 rounded-sm p-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-charcoal/60" />
                            <span className="text-charcoal/70">Processing starts:</span>
                            <span className="font-medium text-charcoal">
                              {format(currentProcessingStart, 'EEEE, MMM d')} at 12:00 AM
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-gold" />
                            <span className="text-charcoal/70">Estimated Delivery:</span>
                            <span className={`font-medium ${bookingData.bookingType === 'urgent' ? 'text-wine' : 'text-charcoal'}`}>
                              {format(getDeliveryDate(currentProcessingStart, bookingData.bookingType === 'urgent'), 'EEEE, MMM d')}
                              {bookingData.bookingType === 'urgent' ? ' (36 hours)' : ' (approx 7-14 days)'}
                            </span>
                          </div>
                        </div>
                      )}


                    </div>
                  )}

                  {/* Self Measurements Form */}
                  {!bookingData.tailorAtDoorstep && (
                    <div>
                      <p className="text-charcoal/60 text-sm mb-4">
                        Provide accurate measurements in inches. 
                        <Link to="/faq#measurements" className="text-gold hover:underline ml-1">
                          View measurement guide
                        </Link>
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(() => {
                          // Determine which length fields to show based on selected service
                          const serviceId = bookingData.serviceId || '';
                          
                          // One-piece outfits that need total length only
                          const totalLengthServices = ['jumpsuit', 'gown', 'fish-cut-lehenga'];
                          
                          // Blouse-only services that need just top length
                          const blouseOnlyServices = ['simple-blouse', 'lining-blouse', 'padded-blouse', 'princess-blouse', 'sabyasachi-blouse', 'bridal-blouse'];
                          
                          // Default measurements
                          let measurementFields = [
                            { key: 'bust', label: 'Bust/Chest *', icon: Ruler },
                            { key: 'waist', label: 'Waist *', icon: Ruler },
                            { key: 'hips', label: 'Hips', icon: Ruler },
                            { key: 'shoulderWidth', label: 'Shoulder Width', icon: Ruler },
                            { key: 'sleeveLength', label: 'Sleeve Length', icon: Ruler },
                          ];
                          
                          // Add appropriate length fields
                          if (totalLengthServices.includes(serviceId)) {
                            // One-piece: total length only
                            measurementFields.push({ key: 'totalLength', label: 'Total Length', icon: Ruler });
                          } else if (blouseOnlyServices.includes(serviceId)) {
                            // Blouse: top length only
                            measurementFields.push({ key: 'topLength', label: 'Blouse Length', icon: Ruler });
                          } else {
                            // Suits: both top and bottom length
                            measurementFields.push({ key: 'topLength', label: 'Top/Kurta Length', icon: Ruler });
                            measurementFields.push({ key: 'bottomLength', label: 'Bottom/Pant Length', icon: Ruler });
                          }
                          
                          // Add height at the end
                          measurementFields.push({ key: 'height', label: 'Height', icon: Ruler });
                          
                          return measurementFields;
                        })().map(({ key, label }) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-charcoal mb-2">
                              {label}
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={bookingData.measurements[key]}
                                onChange={(e) => setBookingData(prev => ({
                                  ...prev,
                                  measurements: { ...prev.measurements, [key]: e.target.value }
                                }))}
                                className="input-field pr-12"
                                placeholder="0"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/50 text-sm">
                                in
                              </span>
                            </div>
                            {errors[`measurement_${key}`] && (
                              <p className="text-wine text-xs mt-1">{errors[`measurement_${key}`]}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Delivery Info for Self Measure */}
                      <div className="bg-charcoal/5 rounded-sm p-4 mt-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-charcoal/60" />
                          <span className="text-charcoal/70">Processing starts:</span>
                          <span className="font-medium text-charcoal">
                            {format(currentProcessingStart, 'EEEE, MMM d')} at 12:00 AM
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-gold" />
                          <span className="text-charcoal/70">Estimated Delivery:</span>
                          <span className={`font-medium ${bookingData.bookingType === 'urgent' ? 'text-wine' : 'text-charcoal'}`}>
                            {format(getDeliveryDate(currentProcessingStart, bookingData.bookingType === 'urgent'), 'EEEE, MMM d')}
                            {bookingData.bookingType === 'urgent' ? ' (36 hours)' : ' (approx 7-14 days)'}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/60 mt-2">
                          * Your order can be delivered before this date
                        </p>
                      </div>


                    </div>
                  )}

                  {/* Free Pickup Notice */}
                  <div className="bg-charcoal/5 rounded-sm p-4 flex items-start gap-3 mt-6">
                    <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-charcoal">
                      <strong>Free Pickup & Delivery:</strong> We'll pick up your fabric and deliver the finished outfit to your doorstep.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm & Pay */}
              {step === 4 && (
                <div>
                  <h2 className="font-playfair text-lg sm:text-xl md:text-2xl font-medium text-charcoal mb-4 sm:mb-6">
                    Confirm Booking
                  </h2>
                  
                  {/* Booking Summary */}
                  <div className="bg-charcoal/5 rounded-sm p-4 sm:p-6 mb-6">
                    <h3 className="font-medium text-charcoal mb-4">Booking Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Service</span>
                        <span className="text-charcoal font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Order Type</span>
                        <span className={bookingData.bookingType === 'urgent' ? 'text-wine font-medium' : 'text-charcoal'}>
                          {bookingData.bookingType === 'urgent' ? '🔴 Urgent (+30%)' : '🟢 Normal'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Measurement Method</span>
                        <span className="text-charcoal">{bookingData.tailorAtDoorstep ? 'Tailor Home Visit' : 'Self-Provided'}</span>
                      </div>
                      {bookingData.tailorAtDoorstep && bookingData.selectedDate && (
                        <div className="flex justify-between">
                          <span className="text-charcoal/70">Tailor Visit Date</span>
                          <span className="text-charcoal">{format(bookingData.selectedDate, 'EEE, dd MMM yyyy')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Processing Starts</span>
                        <span className="text-charcoal">{format(currentProcessingStart, 'EEE, dd MMM')} (12:00 AM)</span>
                      </div>
                      <div className="flex justify-between border-t border-charcoal/10 pt-3 mt-3">
                        <span className="text-charcoal/70">Estimated Delivery</span>
                        <span className="text-gold font-medium">
                          {format(getDeliveryDate(currentProcessingStart, bookingData.bookingType === 'urgent'), 'EEE, dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Important Terms & Conditions */}
                  <div className="bg-wine/5 border border-wine/20 rounded-sm p-4 sm:p-6 mb-6">
                    <h3 className="font-medium text-charcoal mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-wine" />
                      Important Terms & Conditions
                    </h3>
                    <ul className="space-y-3 text-sm text-charcoal/80">
                      <li className="flex items-start gap-2">
                        <span className="text-wine font-bold">•</span>
                        <span><strong>Fabric Damage:</strong> If your fabric is damaged or defective before starting processing, we are not liable for the final outcome.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-wine font-bold">•</span>
                        <span><strong>Alteration Policy:</strong> One free alteration is offered with free pick up and drop soon after delivery.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-wine font-bold">•</span>
                        <span><strong>Payment:</strong> Complete payment must be made at the time of delivery. Payment modes: QR or Cash only.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-wine font-bold">•</span>
                        <span><strong>Agreement:</strong> By confirming, you agree to these terms and our tailoring guidelines.</span>
                      </li>
                      {pricing.advanceAmount > 0 && (
                        <li className="flex items-start gap-2">
                          <span className="text-gold-dark font-bold">•</span>
                          <span><strong>Advance Required:</strong> ₹{pricing.advanceAmount} advance payment (non-refundable). Pay via QR scanner or to the {bookingData.tailorAtDoorstep ? 'tailor during visit' : 'pickup boy'}.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Terms */}
                  <div className="space-y-4 mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingData.acceptedMeasurementResponsibility}
                        onChange={(e) => setBookingData(prev => ({ 
                          ...prev, 
                          acceptedMeasurementResponsibility: e.target.checked 
                        }))}
                        className="w-5 h-5 rounded border-charcoal/30 text-gold focus:ring-gold mt-0.5"
                      />
                      <div>
                        <span className="text-sm text-charcoal">
                          {bookingData.tailorAtDoorstep 
                            ? "I confirm that I will be available at the scheduled time for the tailor's visit."
                            : "I confirm that the measurements provided are accurate. I understand that SLIQUES is not responsible for fit issues arising from incorrect measurements provided by me."
                          }
                        </span>
                      </div>
                    </label>
                    {errors.measurementResponsibility && (
                      <p className="text-wine text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.measurementResponsibility}
                      </p>
                    )}
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingData.acceptedTerms}
                        onChange={(e) => setBookingData(prev => ({ ...prev, acceptedTerms: e.target.checked }))}
                        className="w-5 h-5 rounded border-charcoal/30 text-gold focus:ring-gold mt-0.5"
                      />
                      <div>
                        <span className="text-sm text-charcoal">
                          I agree to the <Link to="/faq" className="text-gold hover:underline">Terms & Conditions</Link>
                          {pricing.advanceAmount > 0 && " and understand that advance payment is non-refundable in case of cancellation"}.
                        </span>
                      </div>
                    </label>
                    {errors.terms && (
                      <p className="text-wine text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.terms}
                      </p>
                    )}
                  </div>
                  
                  {/* Payment Info */}
                  {pricing.advanceAmount > 0 ? (
                    <div className="bg-gold/10 rounded-sm p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="w-6 h-6 text-gold" />
                        <h3 className="font-medium text-charcoal">Advance Payment Required</h3>
                      </div>
                      <p className="text-sm text-charcoal/70 mb-4">
                        This service requires lining/external materials. Pay 30% advance via QR scanner or to the {bookingData.tailorAtDoorstep ? 'tailor during visit' : 'pickup boy'}.
                      </p>
                      <div className="text-center bg-white rounded-sm p-4">
                        <span className="text-charcoal/60 text-sm">Advance Amount</span>
                        <p className="text-2xl sm:text-3xl font-bold text-gold">₹{pricing.advanceAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-charcoal/5 rounded-sm p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Check className="w-6 h-6 text-gold" />
                        <h3 className="font-medium text-charcoal">No Advance Required</h3>
                      </div>
                      <p className="text-sm text-charcoal/70">
                        Full payment is due upon delivery. We'll contact you via WhatsApp.
                      </p>
                    </div>
                  )}
                  
                  {errors.submit && (
                    <div className="bg-wine/10 text-wine text-sm p-3 rounded-sm mt-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </div>
                  )}

                  {/* Confirm Button for Step 4 */}
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-gold w-full mt-6 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Scissors className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              )}

              {/* Bottom Navigation Buttons (smaller) */}
              <div className="flex justify-between mt-6 pt-4 border-t border-charcoal/10">
                {step > 1 ? (
                  <button onClick={prevStep} className="btn-secondary px-3 py-1.5 text-sm">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                ) : (
                  <div />
                )}
                
                {step < 4 && (
                  <button onClick={nextStep} className="btn-primary px-3 py-1.5 text-sm">
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-32 space-y-4 sm:space-y-6">
              {/* Price Summary */}
              <div className="bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6">
                <h3 className="font-playfair text-base sm:text-lg font-medium text-charcoal mb-3 sm:mb-4">
                  Price Summary
                </h3>
                
                {selectedService ? (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-charcoal/70">{selectedService.name}</span>
                      <span className="text-charcoal">₹{selectedService.basePrice}</span>
                    </div>
                    
                    {bookingData.bookingType === 'urgent' && (
                      <div className="flex justify-between text-xs sm:text-sm text-wine">
                        <span>Urgent (+30%)</span>
                        <span>+₹{pricing.urgentSurcharge}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-charcoal/10 pt-2 sm:pt-3 mt-2 sm:mt-3">
                      <div className="flex justify-between mb-1 sm:mb-2">
                        <span className="font-medium text-charcoal text-sm">Total</span>
                        <span className="text-lg sm:text-xl font-bold text-charcoal">₹{pricing.total}</span>
                      </div>
                      {pricing.advanceAmount > 0 && (
                        <>
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-charcoal/70">Advance (30%)</span>
                            <span className="text-gold-dark font-medium">₹{pricing.advanceAmount}</span>
                          </div>
                          <p className="text-[10px] text-charcoal/60 mt-2 leading-relaxed">
                            💳 Pay via WhatsApp scanner or cash/UPI during doorstep visit
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-charcoal/50 text-xs sm:text-sm text-center py-2 sm:py-4">
                    Select a service to see pricing
                  </p>
                )}
              </div>

              {/* Trust Badges - Hidden on Mobile */}
              <div className="bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6 space-y-2 sm:space-y-3 hidden lg:block">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  <span>Free Pickup & Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  <span>Free Alteration</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  <span>Raj Nagar Extension Only</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  <span>Open Every Day 10 AM - 7 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
