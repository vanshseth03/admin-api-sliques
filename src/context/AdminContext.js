import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { sampleBookings, orderStatuses } from '../data/bookings';

const AdminContext = createContext();

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }) {
  const [orders, setOrders] = useState(sampleBookings);
  const [filters, setFilters] = useState({
    date: '',
    status: '',
    bookingType: '',
  });

  // Update order status
  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss') }
        : order
    ));
  }, []);

  // Mark order as fulfilled
  const markAsFulfilled = useCallback((orderId) => {
    updateOrderStatus(orderId, 'ready');
  }, [updateOrderStatus]);

  // Get filtered orders
  const getFilteredOrders = useCallback(() => {
    return orders.filter(order => {
      if (filters.date && order.bookingDate !== filters.date) return false;
      if (filters.status && order.status !== filters.status) return false;
      if (filters.bookingType && order.bookingType !== filters.bookingType) return false;
      return true;
    });
  }, [orders, filters]);

  // Get booking counts by date
  const getBookingCountsByDate = useCallback((date) => {
    const dateStr = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
    const dateOrders = orders.filter(o => o.bookingDate === dateStr);
    
    return {
      normal: dateOrders.filter(o => o.bookingType === 'normal').length,
      urgent: dateOrders.filter(o => o.bookingType === 'urgent').length,
      total: dateOrders.length,
    };
  }, [orders]);

  // Get orders by status
  const getOrdersByStatus = useCallback((status) => {
    return orders.filter(o => o.status === status);
  }, [orders]);

  // Export orders to CSV
  const exportToCSV = useCallback(() => {
    const filteredOrders = getFilteredOrders();
    
    const headers = [
      'Order ID',
      'Customer Name',
      'Phone',
      'Email',
      'Service',
      'Booking Type',
      'Booking Date',
      'Slot',
      'Status',
      'Total Amount',
      'Advance Paid',
      'Created At'
    ];
    
    const rows = filteredOrders.map(order => [
      order.id,
      order.customerName,
      order.phone,
      order.email || '',
      order.serviceName,
      order.bookingType,
      order.bookingDate,
      order.preferredSlot,
      order.status,
      order.totalAmount,
      order.advancePaid ? 'Yes' : 'No',
      order.createdAt
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sliques-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [getFilteredOrders]);

  // Get dashboard stats
  const getDashboardStats = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayOrders = orders.filter(o => o.bookingDate === today);
    
    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      pendingOrders: orders.filter(o => o.status !== 'ready').length,
      completedOrders: orders.filter(o => o.status === 'ready').length,
      todayNormal: todayOrders.filter(o => o.bookingType === 'normal').length,
      todayUrgent: todayOrders.filter(o => o.bookingType === 'urgent').length,
      revenueTotal: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      advanceCollected: orders.filter(o => o.advancePaid).reduce((sum, o) => sum + (o.advanceAmount || 0), 0),
    };
  }, [orders]);

  const value = useMemo(() => ({
    orders,
    filters,
    setFilters,
    updateOrderStatus,
    markAsFulfilled,
    getFilteredOrders,
    getBookingCountsByDate,
    getOrdersByStatus,
    exportToCSV,
    getDashboardStats,
    orderStatuses,
  }), [
    orders,
    filters,
    updateOrderStatus,
    markAsFulfilled,
    getFilteredOrders,
    getBookingCountsByDate,
    getOrdersByStatus,
    exportToCSV,
    getDashboardStats,
  ]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export default AdminContext;
