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

// Generate non-guessable order ID
const generateOrderId = () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Format: SLQ + YYMMDD + 5 random chars = SLQ260122KX3PY (16 chars total)
  return `SLQ${year}${month}${day}${random}`;
};

/**
 * Generate a PDF invoice/order summary
 * @param {Object} orderData - Order details
 * @returns {jsPDF} - The PDF document
 */
export const generateOrderPDF = (orderData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Use provided orderId or generate new one
  const orderId = orderData.orderId || generateOrderId();

  // Header - Logo text
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('SLIQUES', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(BUSINESS.tagline + ' | ' + BUSINESS.since, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Divider
  doc.setDrawColor(180);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // Order ID and Date Row
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Order ID:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 142, 82); // Gold color
  doc.text(orderId, 50, yPos);

  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', pageWidth - 65, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(format(new Date(), 'dd MMM yyyy'), pageWidth - 45, yPos);
  yPos += 12;

  // Expected Delivery Row
  if (orderData.deliveryDate) {
    doc.setFont('helvetica', 'bold');
    doc.text('Expected Delivery:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    let deliveryText = orderData.deliveryDate;
    try {
      deliveryText = format(new Date(orderData.deliveryDate), 'EEEE, MMMM d, yyyy');
    } catch (e) {
      // Use as-is if parsing fails
    }
    doc.text(deliveryText, 65, yPos);
    yPos += 15;
  }

  // Customer Details Section
  const customerName = orderData.customerName || 'N/A';
  const phone = orderData.phone || 'N/A';
  const address = orderData.address || 'N/A';
  
  const addressLines = doc.splitTextToSize(`Address: ${address}`, pageWidth - 60);
  const customerDetailsHeight = 45 + (addressLines.length * 5);
  
  doc.setFillColor(248, 248, 248);
  doc.rect(20, yPos - 5, pageWidth - 40, customerDetailsHeight, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Customer Details', 28, yPos + 5);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${customerName}`, 28, yPos);
  yPos += 8;
  doc.text(`Phone: ${phone}`, 28, yPos);
  yPos += 8;
  doc.text(addressLines, 28, yPos);
  yPos += (addressLines.length * 5) + 15;

  // Order Details Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Details', 20, yPos);
  yPos += 8;

  // Table header
  doc.setFillColor(51, 51, 51);
  doc.rect(20, yPos, pageWidth - 40, 8, 'F');
  doc.setTextColor(255);
  doc.setFontSize(9);
  doc.text('Item', 25, yPos + 5.5);
  doc.text('Description', 90, yPos + 5.5);
  doc.text('Amount', pageWidth - 40, yPos + 5.5);
  yPos += 12;

  doc.setTextColor(0);
  doc.setFont('helvetica', 'normal');

  // Service/Item
  const serviceName = orderData.serviceName || 'Tailoring Service';
  const serviceType = orderData.bookingType === 'urgent' ? 'Urgent Order' : 'Standard';
  const basePrice = orderData.basePrice || orderData.total || 0;
  
  doc.text(serviceName, 25, yPos);
  doc.text(serviceType, 90, yPos);
  doc.text(`Rs. ${basePrice.toLocaleString()}`, pageWidth - 40, yPos);
  yPos += 10;

  // Add-ons
  if (orderData.addOns && orderData.addOns.length > 0) {
    orderData.addOns.forEach(addon => {
      doc.text(addon.name, 25, yPos);
      doc.text('Add-on', 90, yPos);
      doc.text(`Rs. ${(addon.price || 0).toLocaleString()}`, pageWidth - 40, yPos);
      yPos += 7;
    });
  }

  // Customizations (if any)
  if (orderData.neckDesign) {
    doc.text(`Neck Design: ${orderData.neckDesign}`, 25, yPos);
    doc.text('Included', pageWidth - 40, yPos);
    yPos += 7;
  }
  if (orderData.sleeveStyle) {
    doc.text(`Sleeve Style: ${orderData.sleeveStyle}`, 25, yPos);
    doc.text('Included', pageWidth - 40, yPos);
    yPos += 7;
  }

  yPos += 5;

  // Divider before totals
  doc.setDrawColor(200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  // Totals
  doc.setFontSize(10);
  
  // Urgent surcharge
  const urgentSurcharge = orderData.urgentSurcharge || 0;
  if (urgentSurcharge > 0) {
    doc.text('Urgent Surcharge (+30%):', pageWidth - 85, yPos);
    doc.text(`Rs. ${urgentSurcharge.toLocaleString()}`, pageWidth - 40, yPos);
    yPos += 8;
  }

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const total = orderData.total || orderData.totalAmount || 0;
  doc.text('Total:', pageWidth - 85, yPos);
  doc.text(`Rs. ${total.toLocaleString()}`, pageWidth - 40, yPos);
  yPos += 12;

  // Advance Payment Details
  const advanceAmount = orderData.advanceAmount || orderData.advanceRequired || 0;
  if (advanceAmount > 0) {
    doc.setFillColor(255, 250, 240);
    doc.rect(20, yPos - 3, pageWidth - 40, 35, 'F');
    doc.setDrawColor(201, 162, 39);
    doc.rect(20, yPos - 3, pageWidth - 40, 35, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(180, 142, 82);
    doc.text('Payment Details', 28, yPos + 5);
    yPos += 12;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Advance Required (30%):`, 28, yPos);
    doc.text(`Rs. ${advanceAmount.toLocaleString()}`, pageWidth - 45, yPos);
    yPos += 7;
    
    const balanceAmount = total - advanceAmount;
    doc.text(`Balance Due on Delivery:`, 28, yPos);
    doc.text(`Rs. ${balanceAmount.toLocaleString()}`, pageWidth - 45, yPos);
    yPos += 15;
    
    doc.setTextColor(0);
  }

  // Measurement / Visit Details
  yPos += 5;
  doc.setFillColor(248, 248, 248);
  doc.rect(20, yPos - 3, pageWidth - 40, 30, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Appointment Details', 28, yPos + 5);
  yPos += 12;
  
  doc.setFont('helvetica', 'normal');
  const isTailorVisit = orderData.measurementMethod === 'tailor' || orderData.tailorAtDoorstep;
  doc.text(`Measurement: ${isTailorVisit ? 'Tailor Visit at Doorstep' : 'Self-Provided'}`, 28, yPos);
  yPos += 7;
  
  if (orderData.bookingDate || orderData.tailorVisitDate) {
    let visitDate = orderData.tailorVisitDate || orderData.bookingDate;
    try {
      visitDate = format(new Date(visitDate), 'EEEE, MMMM d, yyyy');
    } catch (e) {}
    doc.text(`${isTailorVisit ? 'Tailor Visit' : 'Pickup'} Date: ${visitDate}`, 28, yPos);
  }
  yPos += 15;

  // Measurements (if self-provided)
  if (orderData.measurements && Object.keys(orderData.measurements).some(k => orderData.measurements[k])) {
    doc.setFont('helvetica', 'bold');
    doc.text('Measurements (in inches):', 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const measurements = orderData.measurements;
    const measurementLabels = {
      bust: 'Bust/Chest',
      waist: 'Waist',
      hips: 'Hips',
      shoulderWidth: 'Shoulder',
      sleeveLength: 'Sleeve',
      topLength: 'Top Length',
      blouseLength: 'Blouse Length',
      bottomLength: 'Bottom Length',
      totalLength: 'Total Length',
      height: 'Height'
    };
    
    let measurementText = [];
    Object.keys(measurements).forEach(key => {
      if (measurements[key]) {
        const label = measurementLabels[key] || key;
        measurementText.push(`${label}: ${measurements[key]}"`);
      }
    });
    
    // Display measurements in columns
    const midPoint = Math.ceil(measurementText.length / 2);
    measurementText.slice(0, midPoint).forEach((text, idx) => {
      doc.text(text, 25, yPos + (idx * 6));
      if (measurementText[midPoint + idx]) {
        doc.text(measurementText[midPoint + idx], 100, yPos + (idx * 6));
      }
    });
    yPos += (midPoint * 6) + 10;
  }

  // Payment Note
  if (advanceAmount > 0) {
    yPos += 3;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Note: Pay advance via QR scanner sent from our WhatsApp (+91 93102 82351) or in cash/UPI during tailor visit.', 20, yPos);
    yPos += 10;
  }

  // Footer
  doc.setDrawColor(180);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Thank you for choosing SLIQUES!', pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  doc.text(`Contact: ${BUSINESS.phone} | ${BUSINESS.area}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 6;
  doc.text('Free Pickup and Delivery | Free Alterations', pageWidth / 2, yPos, { align: 'center' });

  return doc;
};

/**
 * Download the PDF
 */
export const downloadOrderPDF = (orderData) => {
  // Generate order ID if not provided
  const orderId = orderData.orderId || orderData.id || generateOrderId();
  const dataWithOrderId = { ...orderData, orderId };
  
  const doc = generateOrderPDF(dataWithOrderId);
  const filename = `SLIQUES-Order-${orderId}.pdf`;
  doc.save(filename);
};

/**
 * Generate customizer summary PDF
 */
export const generateCustomizerPDF = (customization, pricing, isUrgent) => {
  const orderId = generateOrderId();
  
  const orderData = {
    orderId,
    serviceName: customization.baseOutfit?.name || 'Custom Design',
    serviceType: 'Customized',
    basePrice: customization.baseOutfit?.basePrice || 0,
    neckDesign: customization.neckDesign?.name,
    sleeveStyle: customization.sleeveStyle?.name,
    fit: customization.fit?.name,
    addOns: customization.selectedAddOns || [],
    urgentSurcharge: pricing.urgentSurcharge || 0,
    total: pricing.total,
    advanceAmount: pricing.advanceAmount,
    bookingType: isUrgent ? 'urgent' : 'normal',
  };
  
  return generateOrderPDF(orderData);
};

export const downloadCustomizerPDF = (customization, pricing, isUrgent) => {
  const doc = generateCustomizerPDF(customization, pricing, isUrgent);
  const orderId = generateOrderId();
  doc.save(`SLIQUES-Custom-${orderId}.pdf`);
};
