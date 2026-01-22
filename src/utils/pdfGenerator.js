import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

// SLIQUES business info
const BUSINESS = {
  name: 'SLIQUES',
  tagline: 'Boutique Tailoring',
  since: 'Since 2000',
  phone: '+91 93102 82351',
  area: 'Raj Nagar Extension, Ghaziabad',
  website: 'www.sliques.in',
};

/**
 * Generate a PDF invoice/order summary
 * Unified format for both Book Slot and Customizer
 * @param {Object} orderData - Order details
 * @returns {jsPDF} - The PDF document
 */
export const generateOrderPDF = (orderData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header - Logo text
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('SLIQUES', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(BUSINESS.tagline + ' | ' + BUSINESS.since, pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.setFontSize(9);
  doc.text(BUSINESS.phone + ' | ' + BUSINESS.area, pageWidth / 2, yPos, { align: 'center' });
  yPos += 12;

  // Divider
  doc.setDrawColor(180);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // Order ID and Booking Date Row
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Order ID:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(orderData.orderId || 'N/A', 48, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Booked On:', 110, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  // Booking date should always be today (when the order was placed)
  const bookedOn = format(new Date(), 'dd MMM yyyy, hh:mm a');
  doc.text(bookedOn, 142, yPos);
  yPos += 15;

  // Customer Details Section
  const addressText = orderData.address || 'N/A';
  const addressLines = doc.splitTextToSize(addressText, pageWidth - 70);
  const customerDetailsHeight = 38 + (addressLines.length * 5);
  
  doc.setFillColor(248, 248, 248);
  doc.rect(20, yPos - 5, pageWidth - 40, customerDetailsHeight, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Customer Details', 25, yPos + 3);
  yPos += 14;

  doc.setFontSize(10);
  
  // Name
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(orderData.customerName || 'N/A', 50, yPos);
  yPos += 7;
  
  // Phone
  doc.setFont('helvetica', 'bold');
  doc.text('Phone:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(orderData.phone || 'N/A', 50, yPos);
  yPos += 7;
  
  // Address
  doc.setFont('helvetica', 'bold');
  doc.text('Address:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(addressLines, 50, yPos);
  yPos += (addressLines.length * 5) + 12;

  // Order Details Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Order Details', 20, yPos);
  yPos += 8;

  // Table header
  doc.setFillColor(51, 51, 51);
  doc.rect(20, yPos, pageWidth - 40, 8, 'F');
  doc.setTextColor(255);
  doc.setFontSize(9);
  doc.text('Item', 25, yPos + 5.5);
  doc.text('Type', 100, yPos + 5.5);
  doc.text('Amount', pageWidth - 35, yPos + 5.5, { align: 'right' });
  yPos += 12;

  doc.setTextColor(0);
  doc.setFont('helvetica', 'normal');

  // Service/Item
  if (orderData.serviceName) {
    doc.text(orderData.serviceName, 25, yPos);
    doc.text(orderData.serviceType || 'Standard', 100, yPos);
    doc.text('Rs. ' + (orderData.basePrice?.toLocaleString() || '0'), pageWidth - 35, yPos, { align: 'right' });
    yPos += 8;
  }

  // Add-ons
  if (orderData.addOns && orderData.addOns.length > 0) {
    orderData.addOns.forEach(addon => {
      const addonName = typeof addon === 'string' ? addon : addon.name;
      const addonPrice = typeof addon === 'string' ? 0 : (addon.price || 0);
      doc.text(addonName, 25, yPos);
      doc.text('Add-on', 100, yPos);
      doc.text('Rs. ' + addonPrice.toLocaleString(), pageWidth - 35, yPos, { align: 'right' });
      yPos += 7;
    });
  }

  // Customizations (if any)
  if (orderData.neckDesign) {
    doc.text('Neck Design: ' + orderData.neckDesign, 25, yPos);
    doc.text('FREE', pageWidth - 35, yPos, { align: 'right' });
    yPos += 7;
  }
  if (orderData.sleeveStyle) {
    doc.text('Sleeve Style: ' + orderData.sleeveStyle, 25, yPos);
    doc.text('FREE', pageWidth - 35, yPos, { align: 'right' });
    yPos += 7;
  }
  if (orderData.fit) {
    doc.text('Fit: ' + orderData.fit, 25, yPos);
    doc.text('FREE', pageWidth - 35, yPos, { align: 'right' });
    yPos += 7;
  }

  yPos += 3;

  // Divider before totals
  doc.setDrawColor(200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  // Totals section
  doc.setFontSize(10);
  
  if (orderData.urgentSurcharge > 0) {
    doc.text('Urgent Surcharge (+30%):', 100, yPos);
    doc.setTextColor(139, 0, 0);
    doc.text('Rs. ' + orderData.urgentSurcharge.toLocaleString(), pageWidth - 35, yPos, { align: 'right' });
    doc.setTextColor(0);
    yPos += 8;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total Amount:', 100, yPos);
  doc.text('Rs. ' + (orderData.total?.toLocaleString() || '0'), pageWidth - 35, yPos, { align: 'right' });
  yPos += 12;

  // Advance Payment Details (if applicable)
  if (orderData.advanceAmount > 0) {
    doc.setFillColor(255, 250, 240);
    doc.rect(20, yPos - 3, pageWidth - 40, 35, 'F');
    doc.setDrawColor(201, 162, 39);
    doc.rect(20, yPos - 3, pageWidth - 40, 35, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(180, 142, 82);
    doc.text('Advance Payment (30%):', 25, yPos + 5);
    doc.text('Rs. ' + orderData.advanceAmount.toLocaleString(), pageWidth - 35, yPos + 5, { align: 'right' });
    yPos += 12;
    doc.setFont('helvetica', 'normal');
    doc.text('Balance Due on Delivery:', 25, yPos + 5);
    doc.text('Rs. ' + (orderData.balanceAmount?.toLocaleString() || '0'), pageWidth - 35, yPos + 5, { align: 'right' });
    yPos += 15;
    
    // Payment note
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Pay via scanner sent from +91 93102 82351 or Cash/UPI during doorstep visit', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;
  }

  yPos += 5;

  // Schedule & Delivery Section
  doc.setTextColor(0);
  doc.setFillColor(248, 248, 248);
  
  // Calculate box height based on content
  let scheduleBoxHeight = 52;
  if (orderData.measurementMethod === 'tailor' || orderData.tailorVisitDate) {
    scheduleBoxHeight += 8;
  }
  
  doc.rect(20, yPos - 3, pageWidth - 40, scheduleBoxHeight, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Schedule & Delivery', 25, yPos + 5);
  yPos += 14;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // Order Type
  doc.setFont('helvetica', 'bold');
  doc.text('Order Type:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  if (orderData.bookingType === 'urgent') {
    doc.setTextColor(139, 0, 0);
    doc.text('URGENT (Priority - 36 hours)', 65, yPos);
    doc.setTextColor(0);
  } else {
    doc.text('Normal (7-14 days)', 65, yPos);
  }
  yPos += 8;
  
  // Measurement Method
  doc.setFont('helvetica', 'bold');
  doc.text('Measurement:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  const measMethod = orderData.measurementMethod === 'tailor' ? 'Tailor Visit at Doorstep' : 
                     (orderData.measurements && Object.keys(orderData.measurements).some(k => orderData.measurements[k])) ? 'Self-Provided' : 
                     'To be taken at pickup';
  doc.text(measMethod, 65, yPos);
  yPos += 8;
  
  // Tailor Visit Date (if applicable)
  if (orderData.measurementMethod === 'tailor' || orderData.tailorVisitDate) {
    doc.setFont('helvetica', 'bold');
    doc.text('Tailor Visit:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    let visitDate = 'To be scheduled';
    if (orderData.tailorVisitDate) {
      try {
        visitDate = typeof orderData.tailorVisitDate === 'string' 
          ? (orderData.tailorVisitDate.includes('-') ? format(new Date(orderData.tailorVisitDate), 'dd MMM yyyy') : orderData.tailorVisitDate)
          : format(new Date(orderData.tailorVisitDate), 'dd MMM yyyy');
      } catch (e) {
        visitDate = String(orderData.tailorVisitDate);
      }
    }
    doc.text(visitDate, 65, yPos);
    yPos += 8;
  }
  
  // Expected Delivery
  doc.setFont('helvetica', 'bold');
  doc.text('Expected Delivery:', 25, yPos);
  doc.setFont('helvetica', 'normal');
  let deliveryText = 'To be confirmed after pickup';
  if (orderData.deliveryDate) {
    try {
      deliveryText = typeof orderData.deliveryDate === 'string' 
        ? (orderData.deliveryDate.includes('-') ? format(new Date(orderData.deliveryDate), 'dd MMM yyyy') : orderData.deliveryDate)
        : format(new Date(orderData.deliveryDate), 'dd MMM yyyy');
    } catch (e) {
      deliveryText = String(orderData.deliveryDate);
    }
  }
  doc.text(deliveryText, 65, yPos);
  yPos += 15;

  // Measurements Section (if provided)
  if (orderData.measurements && Object.keys(orderData.measurements).some(k => orderData.measurements[k])) {
    doc.setFillColor(248, 248, 248);
    doc.rect(20, yPos - 3, pageWidth - 40, 28, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Measurements (inches)', 25, yPos + 5);
    yPos += 12;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    const measurements = orderData.measurements;
    const measLabels = [
      ['Bust', measurements.bust],
      ['Waist', measurements.waist],
      ['Hips', measurements.hips],
      ['Shoulder', measurements.shoulderWidth],
      ['Sleeve', measurements.sleeveLength],
      ['Length', measurements.topLength || measurements.blouseLength],
      ['Height', measurements.height],
    ].filter(m => m[1]);
    
    let xPos = 25;
    measLabels.forEach((m, i) => {
      if (i > 0 && i % 4 === 0) {
        yPos += 7;
        xPos = 25;
      }
      doc.text(m[0] + ': ' + m[1], xPos, yPos);
      xPos += 42;
    });
    yPos += 15;
  }

  yPos += 5;

  // Footer
  doc.setDrawColor(180);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Thank you for choosing SLIQUES!', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  doc.setFontSize(8);
  doc.text('Free Pickup & Delivery | Free Alterations | ' + BUSINESS.website, pageWidth / 2, yPos, { align: 'center' });

  return doc;
};

/**
 * Download the PDF - unified function for both Book Slot and Customizer
 */
export const downloadOrderPDF = (orderData) => {
  const doc = generateOrderPDF(orderData);
  // Use orderId for filename, remove any special characters
  const safeOrderId = (orderData.orderId || 'order').replace(/[^a-zA-Z0-9]/g, '');
  const filename = 'SLIQUES_' + safeOrderId + '.pdf';
  doc.save(filename);
};

/**
 * Generate customizer summary PDF (uses same format as booking)
 * @deprecated Use downloadOrderPDF directly with proper orderData
 */
export const generateCustomizerPDF = (customization, pricing, isUrgent) => {
  // Generate non-guessable order ID for customizer
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const customOrderId = 'SLQ' + year + month + random + 'C1';
  
  const orderData = {
    orderId: customOrderId,
    serviceName: customization.baseOutfit?.name || 'Custom Design',
    serviceType: 'Custom Design',
    basePrice: customization.baseOutfit?.basePrice || 0,
    neckDesign: customization.neckDesign?.name,
    sleeveStyle: customization.sleeveStyle?.name,
    fit: customization.fit?.name,
    addOns: customization.selectedAddOns || [],
    urgentSurcharge: pricing.urgentSurcharge || 0,
    total: pricing.total,
    advanceAmount: pricing.advanceAmount,
    balanceAmount: pricing.balanceAmount,
    bookingType: isUrgent ? 'urgent' : 'normal',
  };
  
  return generateOrderPDF(orderData);
};

export const downloadCustomizerPDF = (customization, pricing, isUrgent) => {
  const doc = generateCustomizerPDF(customization, pricing, isUrgent);
  const timestamp = Date.now();
  doc.save('SLIQUES_Custom_' + timestamp + '.pdf');
};
