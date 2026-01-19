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
  doc.text(BUSINESS.tagline + ' • ' + BUSINESS.since, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Divider
  doc.setDrawColor(180);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // Order ID and Date
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Order ID:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(orderData.orderId || 'N/A', 55, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Date:', pageWidth - 70, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(format(new Date(), 'dd MMM yyyy'), pageWidth - 50, yPos);
  yPos += 15;

  // Customer Details Section
  // Calculate height based on address length
  const addressText = `Address: ${orderData.address || 'N/A'}`;
  const addressLines = doc.splitTextToSize(addressText, pageWidth - 50);
  const customerDetailsHeight = 30 + (addressLines.length * 6);
  
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPos - 5, pageWidth - 40, customerDetailsHeight, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Details', 25, yPos + 5);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${orderData.customerName || 'N/A'}`, 25, yPos);
  yPos += 8;
  doc.text(`Phone: ${orderData.phone || 'N/A'}`, 25, yPos);
  yPos += 8;
  
  // Address with word wrapping for long addresses
  doc.text(addressLines, 25, yPos);
  yPos += (addressLines.length * 6) + 12;

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
  doc.text('Description', 80, yPos + 5.5);
  doc.text('Amount', pageWidth - 40, yPos + 5.5);
  yPos += 12;

  doc.setTextColor(0);
  doc.setFont('helvetica', 'normal');

  // Service/Item
  if (orderData.serviceName) {
    doc.text(orderData.serviceName, 25, yPos);
    doc.text(orderData.serviceType || 'Standard', 80, yPos);
    doc.text(`Rs. ${orderData.basePrice?.toLocaleString() || '0'}`, pageWidth - 40, yPos);
    yPos += 8;
  }

  // Add-ons
  if (orderData.addOns && orderData.addOns.length > 0) {
    orderData.addOns.forEach(addon => {
      doc.text(addon.name, 25, yPos);
      doc.text('Add-on', 80, yPos);
      doc.text(`Rs. ${addon.price?.toLocaleString() || '0'}`, pageWidth - 40, yPos);
      yPos += 7;
    });
  }

  // Customizations (if any)
  if (orderData.neckDesign) {
    doc.text(`Neck: ${orderData.neckDesign}`, 25, yPos);
    doc.text('Free', pageWidth - 40, yPos);
    yPos += 7;
  }
  if (orderData.sleeveStyle) {
    doc.text(`Sleeves: ${orderData.sleeveStyle}`, 25, yPos);
    doc.text('Free', pageWidth - 40, yPos);
    yPos += 7;
  }
  if (orderData.fit) {
    doc.text(`Fit: ${orderData.fit}`, 25, yPos);
    doc.text('Free', pageWidth - 40, yPos);
    yPos += 7;
  }

  yPos += 5;

  // Divider before totals
  doc.setDrawColor(200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 8;

  // Totals
  doc.setFontSize(10);
  
  if (orderData.urgentSurcharge > 0) {
    doc.text('Urgent Surcharge (+30%):', pageWidth - 80, yPos);
    doc.text(`Rs. ${orderData.urgentSurcharge.toLocaleString()}`, pageWidth - 40, yPos);
    yPos += 8;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', pageWidth - 80, yPos);
  doc.text(`Rs. ${orderData.total?.toLocaleString() || '0'}`, pageWidth - 40, yPos);
  yPos += 10;

  if (orderData.advanceAmount > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(180, 142, 82); // Gold color
    doc.text('Advance Payment:', pageWidth - 80, yPos);
    doc.text(`Rs. ${orderData.advanceAmount.toLocaleString()}`, pageWidth - 40, yPos);
    yPos += 7;
    doc.text('Balance Due:', pageWidth - 80, yPos);
    doc.text(`Rs. ${orderData.balanceAmount?.toLocaleString() || '0'}`, pageWidth - 40, yPos);
    yPos += 10;
  }

  // Delivery info
  doc.setTextColor(0);
  yPos += 5;
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPos - 5, pageWidth - 40, 25, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Delivery Information', 25, yPos + 3);
  yPos += 12;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Expected Delivery: ${orderData.deliveryDate || 'To be confirmed'}`, 25, yPos);
  doc.text(`Type: ${orderData.bookingType === 'urgent' ? 'Urgent Order' : 'Normal Order'}`, 120, yPos);
  yPos += 20;

  // Footer with contact
  doc.setDrawColor(180);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Thank you for choosing SLIQUES!', pageWidth / 2, yPos, { align: 'center' });
  yPos += 7;
  doc.text(`Contact: ${BUSINESS.phone} | ${BUSINESS.area}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 7;
  doc.text('Free Pickup & Delivery | Free Alterations (for our stitching)', pageWidth / 2, yPos, { align: 'center' });

  return doc;
};

/**
 * Download the PDF
 */
export const downloadOrderPDF = (orderData) => {
  const doc = generateOrderPDF(orderData);
  const filename = `SLIQUES-Order-${orderData.orderId || 'summary'}.pdf`;
  doc.save(filename);
};

/**
 * Generate customizer summary PDF
 */
export const generateCustomizerPDF = (customization, pricing, isUrgent) => {
  const orderData = {
    orderId: `CUSTOM-${Date.now()}`,
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
    balanceAmount: pricing.balanceAmount,
    bookingType: isUrgent ? 'urgent' : 'normal',
  };
  
  return generateOrderPDF(orderData);
};

export const downloadCustomizerPDF = (customization, pricing, isUrgent) => {
  const doc = generateCustomizerPDF(customization, pricing, isUrgent);
  doc.save(`SLIQUES-Custom-Design-${Date.now()}.pdf`);
};
