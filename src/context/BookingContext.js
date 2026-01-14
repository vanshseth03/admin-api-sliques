import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { format, addDays, addHours, differenceInHours, startOfDay } from 'date-fns';
import { generateBookingCounts, sampleBookings, timeSlots } from '../data/bookings';

// Business rules - configurable (internal - not shown to users)
export const BOOKING_RULES = {
  MAX_NORMAL_PER_DAY: 4,
  MAX_URGENT_PER_DAY: 4,
  URGENT_SURCHARGE_PERCENT: 30,
  URGENT_MIN_HOURS: 36,
  NORMAL_MIN_DAYS: 7, // 1 week minimum for normal orders
  ADVANCE_PAYMENT_PERCENT: 30,
};

const BookingContext = createContext();

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

export function BookingProvider({ children }) {
  // Initialize with sample data
  const [bookings, setBookings] = useState(sampleBookings);
  const [bookingCounts, setBookingCounts] = useState(generateBookingCounts);
  const [currentBooking, setCurrentBooking] = useState(null);

  // Get count of bookings for a specific date
  const getBookingCountForDate = useCallback((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookingCounts[dateStr] || { normal: 0, urgent: 0 };
  }, [bookingCounts]);

  // Find next available date for normal orders (min 1 week, max 4 per day)
  const getNextAvailableNormalDate = useCallback(() => {
    const minDate = addDays(startOfDay(new Date()), BOOKING_RULES.NORMAL_MIN_DAYS);
    let checkDate = minDate;
    
    // Check up to 30 days ahead
    for (let i = 0; i < 30; i++) {
      const counts = getBookingCountForDate(checkDate);
      if (counts.normal < BOOKING_RULES.MAX_NORMAL_PER_DAY) {
        return checkDate;
      }
      checkDate = addDays(checkDate, 1);
    }
    
    return minDate; // Fallback
  }, [getBookingCountForDate]);

  // Find next available date for urgent orders (min 36 hours, max 4 per day)
  const getNextAvailableUrgentDate = useCallback(() => {
    const minDate = startOfDay(addHours(new Date(), BOOKING_RULES.URGENT_MIN_HOURS));
    let checkDate = minDate;
    
    // Check up to 14 days ahead
    for (let i = 0; i < 14; i++) {
      const counts = getBookingCountForDate(checkDate);
      if (counts.urgent < BOOKING_RULES.MAX_URGENT_PER_DAY) {
        return checkDate;
      }
      checkDate = addDays(checkDate, 1);
    }
    
    return minDate; // Fallback
  }, [getBookingCountForDate]);

  // Check if a date has available slots for normal bookings
  const hasNormalSlotsAvailable = useCallback((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const counts = bookingCounts[dateStr] || { normal: 0, urgent: 0 };
    return counts.normal < BOOKING_RULES.MAX_NORMAL_PER_DAY;
  }, [bookingCounts]);

  // Check if a date has available slots for urgent bookings
  const hasUrgentSlotsAvailable = useCallback((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const counts = bookingCounts[dateStr] || { normal: 0, urgent: 0 };
    
    // Check if date meets minimum 36-hour requirement
    const now = new Date();
    const bookingDateTime = new Date(dateStr);
    bookingDateTime.setHours(9, 0, 0, 0); // Assume 9 AM start
    
    const hoursUntilBooking = differenceInHours(bookingDateTime, now);
    if (hoursUntilBooking < BOOKING_RULES.URGENT_MIN_HOURS) {
      return false;
    }
    
    return counts.urgent < BOOKING_RULES.MAX_URGENT_PER_DAY;
  }, [bookingCounts]);

  // Get remaining slots for a date
  const getRemainingSlots = useCallback((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const counts = bookingCounts[dateStr] || { normal: 0, urgent: 0 };
    
    return {
      normal: Math.max(0, BOOKING_RULES.MAX_NORMAL_PER_DAY - counts.normal),
      urgent: Math.max(0, BOOKING_RULES.MAX_URGENT_PER_DAY - counts.urgent),
    };
  }, [bookingCounts]);

  // Check if urgent booking is allowed (36 hour minimum)
  const isUrgentAllowed = useCallback((date) => {
    const now = new Date();
    const bookingDateTime = new Date(date);
    const hoursUntil = differenceInHours(bookingDateTime, now);
    return hoursUntil >= BOOKING_RULES.URGENT_MIN_HOURS;
  }, []);

  // Calculate price with urgent surcharge
  const calculatePrice = useCallback((basePrice, isUrgent = false, addOns = [], requiresAdvance = false) => {
    let total = basePrice;
    
    // Add add-ons
    addOns.forEach(addOn => {
      total += addOn.price || 0;
    });
    
    // Apply urgent surcharge
    const urgentSurcharge = isUrgent 
      ? Math.round(total * (BOOKING_RULES.URGENT_SURCHARGE_PERCENT / 100))
      : 0;
    
    const finalTotal = total + urgentSurcharge;
    
    // Advance only required for items with lining/external materials
    const advanceAmount = requiresAdvance 
      ? Math.round(finalTotal * (BOOKING_RULES.ADVANCE_PAYMENT_PERCENT / 100))
      : 0;
    
    return {
      basePrice,
      addOnsTotal: total - basePrice,
      urgentSurcharge,
      total: finalTotal,
      advanceAmount,
      balanceAmount: finalTotal - advanceAmount,
      requiresAdvance,
    };
  }, []);

  // Create a new booking
  const createBooking = useCallback((bookingData) => {
    const dateStr = format(new Date(bookingData.bookingDate), 'yyyy-MM-dd');
    const bookingType = bookingData.bookingType || 'normal';
    
    // Validate slot availability
    const slots = getRemainingSlots(new Date(bookingData.bookingDate));
    if (bookingType === 'normal' && slots.normal <= 0) {
      throw new Error('No normal booking slots available for this date');
    }
    if (bookingType === 'urgent' && slots.urgent <= 0) {
      throw new Error('No urgent booking slots available for this date');
    }
    
    // Generate booking ID
    const bookingId = `SLQ-${new Date().getFullYear()}-${String(bookings.length + 1).padStart(3, '0')}`;
    
    const newBooking = {
      id: bookingId,
      ...bookingData,
      status: 'received',
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };
    
    // Update bookings
    setBookings(prev => [...prev, newBooking]);
    
    // Update booking counts
    setBookingCounts(prev => ({
      ...prev,
      [dateStr]: {
        normal: (prev[dateStr]?.normal || 0) + (bookingType === 'normal' ? 1 : 0),
        urgent: (prev[dateStr]?.urgent || 0) + (bookingType === 'urgent' ? 1 : 0),
      }
    }));
    
    return newBooking;
  }, [bookings, getRemainingSlots]);

  // Get booking by ID
  const getBookingById = useCallback((id) => {
    return bookings.find(b => b.id === id);
  }, [bookings]);

  // Get available time slots for a date
  const getAvailableTimeSlots = useCallback((date, bookingType = 'normal') => {
    // For simplicity, return all time slots
    // In a real app, this would check against existing bookings
    return timeSlots;
  }, []);

  const value = useMemo(() => ({
    bookings,
    bookingCounts,
    currentBooking,
    setCurrentBooking,
    hasNormalSlotsAvailable,
    hasUrgentSlotsAvailable,
    getRemainingSlots,
    isUrgentAllowed,
    calculatePrice,
    createBooking,
    getBookingById,
    getAvailableTimeSlots,
    getNextAvailableNormalDate,
    getNextAvailableUrgentDate,
    BOOKING_RULES,
  }), [
    bookings,
    bookingCounts,
    currentBooking,
    hasNormalSlotsAvailable,
    hasUrgentSlotsAvailable,
    getRemainingSlots,
    isUrgentAllowed,
    calculatePrice,
    createBooking,
    getBookingById,
    getAvailableTimeSlots,
    getNextAvailableNormalDate,
    getNextAvailableUrgentDate,
  ]);

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export default BookingContext;
