// Sample booking data for development/testing
// In production, this would come from a backend API

import { format, addDays, subDays } from 'date-fns';

// Sample bookings - this simulates what would be stored in a database
export const sampleBookings = [
  {
    id: 'SLQ-2026-001',
    customerName: 'Priya Sharma',
    phone: '+91 93102 82351',
    email: 'priya.sharma@email.com',
    serviceId: 'bridal-blouse',
    serviceName: 'Bridal Blouses',
    bookingType: 'normal',
    bookingDate: format(new Date(), 'yyyy-MM-dd'),
    preferredSlot: '10:00 AM',
    status: 'cutting',
    totalAmount: 5000,
    advanceAmount: 1500,
    advancePaid: true,
    measurements: {
      bust: 36,
      waist: 30,
      hips: 38,
      shoulderWidth: 14,
      sleeveLength: 22,
      blouseLength: 15
    },
    customization: {
      neckDesign: 'deep-v',
      sleeveStyle: 'full',
      backDesign: 'open-back'
    },
    createdAt: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'SLQ-2026-002',
    customerName: 'Anjali Verma',
    phone: '9876543211',
    email: 'anjali.v@email.com',
    serviceId: 'anarkali',
    serviceName: 'Anarkalis & Shararas',
    bookingType: 'urgent',
    bookingDate: format(new Date(), 'yyyy-MM-dd'),
    preferredSlot: '2:00 PM',
    status: 'received',
    totalAmount: 3250, // 2500 + 30% urgent
    advanceAmount: 975,
    advancePaid: true,
    measurements: {
      bust: 34,
      waist: 28,
      hips: 36,
      shoulderWidth: 13,
      height: 160
    },
    customization: null,
    createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    id: 'SLQ-2026-003',
    customerName: 'Meera Kapoor',
    phone: '9876543212',
    email: 'meera.k@email.com',
    serviceId: 'simple-salwar',
    serviceName: 'Simple Salwar Suits & Pants',
    bookingType: 'normal',
    bookingDate: format(new Date(), 'yyyy-MM-dd'),
    preferredSlot: '11:00 AM',
    status: 'stitching',
    totalAmount: 800,
    advanceAmount: 240,
    advancePaid: true,
    measurements: {
      bust: 38,
      waist: 32,
      hips: 40,
      shoulderWidth: 15,
      sleeveLength: 23
    },
    customization: null,
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  }
];

// Daily booking counts by date
// This tracks how many normal and urgent bookings exist for each date
export const generateBookingCounts = () => {
  const counts = {};
  const today = new Date();
  
  // Generate sample data for the next 30 days
  for (let i = 0; i < 30; i++) {
    const date = format(addDays(today, i), 'yyyy-MM-dd');
    
    if (i === 0) {
      // Today's counts from sample bookings
      counts[date] = {
        normal: 2,  // 2 normal bookings today
        urgent: 1   // 1 urgent booking today
      };
    } else if (i < 7) {
      // Near-term dates have some bookings
      counts[date] = {
        normal: Math.floor(Math.random() * 3),
        urgent: Math.floor(Math.random() * 2)
      };
    } else {
      // Future dates are mostly empty
      counts[date] = {
        normal: 0,
        urgent: 0
      };
    }
  }
  
  return counts;
};

// Available time slots
export const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM'
];

// Order statuses with display names and descriptions
export const orderStatuses = {
  received: {
    label: 'Received',
    description: 'Your order has been received and is in queue',
    step: 1
  },
  cutting: {
    label: 'Cutting',
    description: 'Fabric is being cut according to your measurements',
    step: 2
  },
  stitching: {
    label: 'Stitching',
    description: 'Your outfit is being stitched with care',
    step: 3
  },
  trial_ready: {
    label: 'Trial Ready',
    description: 'Ready for trial fitting - we will contact you',
    step: 4
  },
  ready: {
    label: 'Ready for Pickup',
    description: 'Your outfit is ready! We will deliver or you can pick up',
    step: 5
  }
};
