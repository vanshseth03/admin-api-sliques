import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Check, Clock, Scissors, Truck, AlertCircle, MapPin, Phone } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { orderStatuses } from '../data/bookings';

// Production API URL
const API_URL = process.env.REACT_APP_API_URL || 'https://admin-api-sliques.vercel.app';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('id') || '';
  
  const [orderId, setOrderId] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { getBookingById, bookings } = useBooking();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);
    
    try {
      // First try API (backend database)
      const response = await fetch(`${API_URL}/api/orders/${orderId.trim().toUpperCase()}`);
      if (response.ok) {
        const orderData = await response.json();
        setSearchedOrder(orderData);
        setIsSearching(false);
        return;
      }
    } catch (err) {
      console.warn('API fetch failed, checking local storage:', err);
    }
    
    // Fallback to local state
    setTimeout(() => {
      const order = getBookingById(orderId.trim().toUpperCase());
      if (order) {
        setSearchedOrder(order);
      } else {
        setError('Order not found. Please check your order ID and try again.');
        setSearchedOrder(null);
      }
      setIsSearching(false);
    }, 500);
  };

  // Auto-search if order ID is in URL
  React.useEffect(() => {
    if (initialOrderId) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`${API_URL}/api/orders/${initialOrderId.trim().toUpperCase()}`);
          if (response.ok) {
            const orderData = await response.json();
            setSearchedOrder(orderData);
            return;
          }
        } catch (err) {
          console.warn('API fetch failed:', err);
        }
        
        // Fallback to local
        const order = getBookingById(initialOrderId.trim().toUpperCase());
        if (order) {
          setSearchedOrder(order);
        }
      };
      fetchOrder();
    }
  }, [initialOrderId, getBookingById]);

  const getStatusStep = (status) => {
    return orderStatuses[status]?.step || 1;
  };

  const statusIcons = {
    'pickup-awaited': Package,
    'fabric-received': Package,
    'processing': Scissors,
    'ready': Check,
    'out-for-delivery': Truck,
    'delivered': Check,
    'cancelled': AlertCircle,
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="bg-white py-6 sm:py-8 md:py-12 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="section-title mb-3 sm:mb-4">Track Your Order</h1>
            <p className="section-subtitle mx-auto">
              Enter your order ID to see the current status
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Search Form */}
        <div className="bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label htmlFor="orderId" className="sr-only">Order ID</label>
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-charcoal/40" />
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order ID (e.g., SLQ2601XK7P01)"
                  className="input-field pl-10 sm:pl-12 text-sm sm:text-base"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={!orderId.trim() || isSearching}
              className="btn-primary whitespace-nowrap"
            >
              {isSearching ? 'Searching...' : 'Track Order'}
            </button>
          </form>
          
          {error && (
            <div className="mt-3 sm:mt-4 bg-wine/10 text-wine text-xs sm:text-sm p-3 sm:p-4 rounded-sm flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p>{error}</p>
                <p className="mt-1 sm:mt-2 text-charcoal/70">
                  Need help? <a href="https://wa.me/919310282351" className="text-gold hover:underline">WhatsApp us</a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order Details */}
        {searchedOrder && (
          <div className="bg-white rounded-sm border border-charcoal/10 overflow-hidden">
            {/* Order Header */}
            <div className="bg-charcoal text-ivory p-4 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
                <div>
                  <span className="text-ivory/60 text-xs sm:text-sm">Order ID</span>
                  <h2 className="font-mono text-base sm:text-xl font-bold">{searchedOrder.orderId || searchedOrder.id}</h2>
                </div>
                <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                  searchedOrder.status === 'ready' 
                    ? 'bg-gold text-charcoal' 
                    : 'bg-white/20 text-ivory'
                }`}>
                  {orderStatuses[searchedOrder.status]?.label || 'Processing'}
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="p-4 sm:p-6 md:p-8 border-b border-charcoal/10">
              <h3 className="font-playfair text-base sm:text-lg font-medium text-charcoal mb-4 sm:mb-6">
                Order Progress
              </h3>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 sm:top-6 left-5 sm:left-6 right-5 sm:right-6 h-0.5 bg-charcoal/10" />
                <div 
                  className="absolute top-5 sm:top-6 left-5 sm:left-6 h-0.5 bg-gold transition-all duration-500"
                  style={{ 
                    width: `${((getStatusStep(searchedOrder.status) - 1) / 5) * 100}%`,
                    maxWidth: 'calc(100% - 2.5rem)'
                  }}
                />
                
                {/* Steps - Show 6 key milestones */}
                <div className="relative flex justify-between">
                  {[
                    { key: 'pickup-awaited', label: 'Pickup' },
                    { key: 'fabric-received', label: 'Received' },
                    { key: 'processing', label: 'Processing' },
                    { key: 'ready', label: 'Ready' },
                    { key: 'out-for-delivery', label: 'Delivery' },
                    { key: 'delivered', label: 'Delivered' }
                  ].map(({ key, label }, index) => {
                    const currentStep = getStatusStep(searchedOrder.status);
                    const stepNum = orderStatuses[key]?.step;
                    const isCompleted = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;
                    const Icon = statusIcons[key] || Package;
                    
                    return (
                      <div key={key} className="flex flex-col items-center" style={{ width: '16.66%' }}>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-gold text-charcoal' 
                            : isCurrent 
                            ? 'bg-charcoal text-ivory ring-4 ring-gold/30' 
                            : 'bg-charcoal/10 text-charcoal/40'
                        }`}>
                          {isCompleted ? (
                            <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                          ) : (
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </div>
                        <span className={`text-xs mt-3 text-center ${
                          isCurrent ? 'text-charcoal font-medium' : 'text-charcoal/60'
                        }`}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Current Status Description */}
              <div className="mt-8 bg-gold/10 rounded-sm p-4">
                <p className="text-charcoal">
                  <strong>Current Status:</strong> {orderStatuses[searchedOrder.status]?.description}
                </p>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-6 md:p-8">
              <h3 className="font-playfair text-lg font-medium text-charcoal mb-4">
                Order Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-charcoal/60 text-sm">Service</span>
                    <p className="font-medium text-charcoal">{searchedOrder.serviceName}</p>
                  </div>
                  <div>
                    <span className="text-charcoal/60 text-sm">Booking Date</span>
                    <p className="font-medium text-charcoal">{searchedOrder.bookingDate}</p>
                  </div>
                  <div>
                    <span className="text-charcoal/60 text-sm">Preferred Slot</span>
                    <p className="font-medium text-charcoal">{searchedOrder.preferredSlot}</p>
                  </div>
                  <div>
                    <span className="text-charcoal/60 text-sm">Booking Type</span>
                    <p className={`font-medium ${
                      searchedOrder.bookingType === 'urgent' ? 'text-wine' : 'text-charcoal'
                    }`}>
                      {searchedOrder.bookingType === 'urgent' ? 'Urgent' : 'Normal'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-charcoal/60 text-sm">Customer Name</span>
                    <p className="font-medium text-charcoal">{searchedOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-charcoal/60 text-sm">Total Amount</span>
                    <p className="font-medium text-charcoal">₹{searchedOrder.totalAmount}</p>
                  </div>
                  <div>
                    <span className="text-charcoal/60 text-sm">Advance Paid</span>
                    <p className="font-medium text-gold">₹{searchedOrder.advanceAmount}</p>
                  </div>
                  <div>
                    <span className="text-charcoal/60 text-sm">Balance Due</span>
                    <p className="font-medium text-charcoal">₹{searchedOrder.totalAmount - searchedOrder.advanceAmount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-charcoal/5 p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-charcoal/70">
                <p>Questions about your order?</p>
              </div>
              <div className="flex gap-4">
                <a
                  href={`https://wa.me/919310282351?text=Hi%20SLIQUES,%20I%20have%20a%20question%20about%20order%20${searchedOrder.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-sm py-2"
                >
                  Contact on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* No Order Searched Yet */}
        {!searchedOrder && !error && (
          <div className="bg-white rounded-sm border border-charcoal/10 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-charcoal/5 flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-charcoal/30" />
            </div>
            <h3 className="font-playfair text-xl font-medium text-charcoal mb-2">
              Track Your Order
            </h3>
            <p className="text-charcoal/60 mb-6">
              Enter your order ID above to see the current status and details of your outfit.
            </p>
            <p className="text-sm text-charcoal/50">
              Your order ID was sent to you via SMS and WhatsApp when you made the booking.
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gold/10 rounded-sm p-6">
          <h3 className="font-playfair text-lg font-medium text-charcoal mb-4">
            Status Guide
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {Object.entries(orderStatuses).map(([key, status]) => (
              <div key={key} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-charcoal/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-charcoal">{status.step}</span>
                </div>
                <div>
                  <p className="font-medium text-charcoal">{status.label}</p>
                  <p className="text-charcoal/60 text-xs">{status.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
