const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Customer Info
  customerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  
  // Service Info
  serviceName: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    enum: ['booking', 'custom'],
    default: 'booking'
  },
  bookingType: {
    type: String,
    enum: ['normal', 'urgent'],
    default: 'normal'
  },
  
  // Customization details (for custom orders)
  customization: {
    neckDesign: String,
    sleeveStyle: String,
    fit: String,
    addOns: [String],
    customNeckImageUrl: String
  },
  
  // Measurements
  measurementMethod: {
    type: String,
    enum: ['self', 'tailor'],
    default: 'self'
  },
  tailorVisitDate: Date,
  measurements: {
    bust: String,
    waist: String,
    hips: String,
    shoulderWidth: String,
    sleeveLength: String,
    topLength: String,
    bottomLength: String,
    totalLength: String,
    height: String
  },
  
  // Dates
  bookingDate: Date,
  processingStartDate: Date,
  estimatedDelivery: Date,
  actualDelivery: Date,
  
  // Payment
  totalAmount: {
    type: Number,
    required: true
  },
  advanceAmount: {
    type: Number,
    default: 0
  },
  advancePaid: {
    type: Boolean,
    default: false
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'advance-paid', 'paid'],
    default: 'pending'
  },
  paymentMode: String,
  
  // Status
  status: {
    type: String,
    enum: ['pickup-awaited', 'fabric-received', 'processing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pickup-awaited'
  },
  statusHistory: [{
    status: String,
    note: String,
    timestamp: Date
  }],
  
  // Images
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['fabric', 'reference', 'progress', 'completed']
    },
    description: String,
    uploadedAt: Date
  }],
  
  // Additional Details (from customizer)
  additionalImages: [{
    url: String,
    description: String,
    uploadedAt: Date
  }],
  additionalRemarks: String,
  extraChargesNote: String,
  
  // Bill breakdown
  basePrice: Number,
  addOnsTotal: Number,
  urgentSurcharge: Number,
  
  // Notes
  notes: String,
  adminNotes: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
