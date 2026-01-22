import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  LayoutDashboard, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw, 
  ChevronDown,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  IndianRupee,
  Scissors,
  Truck
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { BOOKING_RULES } from '../context/BookingContext';

const Admin = () => {
  const {
    orders,
    filters,
    setFilters,
    updateOrderStatus,
    markAsFulfilled,
    getFilteredOrders,
    getDashboardStats,
    exportToCSV,
    orderStatuses,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFilters, setShowFilters] = useState(false);

  const stats = getDashboardStats();
  const filteredOrders = getFilteredOrders();

  const statusColors = {
    received: 'bg-blue-100 text-blue-800',
    cutting: 'bg-yellow-100 text-yellow-800',
    stitching: 'bg-orange-100 text-orange-800',
    trial_ready: 'bg-purple-100 text-purple-800',
    ready: 'bg-green-100 text-green-800',
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="bg-charcoal text-ivory py-4 sm:py-6 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-xl sm:text-2xl md:text-3xl font-medium">Admin Dashboard</h1>
              <p className="text-ivory/60 text-xs sm:text-sm mt-0.5 sm:mt-1">Manage bookings and orders</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-ivory/60 hidden sm:block">
                {format(new Date(), 'dd MMM yyyy, h:mm a')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-charcoal/10 sticky top-[72px] sm:top-[88px] md:top-[104px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 sm:gap-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 sm:py-4 px-1 sm:px-2 border-b-2 transition-colors text-sm sm:text-base ${
                activeTab === 'dashboard' 
                  ? 'border-gold text-charcoal font-medium' 
                  : 'border-transparent text-charcoal/60 hover:text-charcoal'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-1 sm:mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 sm:py-4 px-1 sm:px-2 border-b-2 transition-colors text-sm sm:text-base ${
                activeTab === 'orders' 
                  ? 'border-gold text-charcoal font-medium' 
                  : 'border-transparent text-charcoal/60 hover:text-charcoal'
              }`}
            >
              <Package className="w-4 h-4 inline mr-1 sm:mr-2" />
              Orders
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-white rounded-sm border border-charcoal/10 p-3 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Package className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <span className="text-xl sm:text-3xl font-bold text-charcoal">{stats.totalOrders}</span>
                </div>
                <p className="text-charcoal/60 text-xs sm:text-sm">Total Orders</p>
              </div>
              
              <div className="bg-white rounded-sm border border-charcoal/10 p-3 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-gold" />
                  </div>
                  <span className="text-xl sm:text-3xl font-bold text-charcoal">{stats.todayOrders}</span>
                </div>
                <p className="text-charcoal/60 text-xs sm:text-sm">Today</p>
              </div>
              
              <div className="bg-white rounded-sm border border-charcoal/10 p-3 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <span className="text-xl sm:text-3xl font-bold text-charcoal">{stats.pendingOrders}</span>
                </div>
                <p className="text-charcoal/60 text-xs sm:text-sm">Pending</p>
              </div>
              
              <div className="bg-white rounded-sm border border-charcoal/10 p-3 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <span className="text-xl sm:text-3xl font-bold text-charcoal">{stats.completedOrders}</span>
                </div>
                <p className="text-charcoal/60 text-xs sm:text-sm">Completed</p>
              </div>
            </div>

            {/* Today's Booking Limits */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6">
                <h3 className="font-playfair text-base sm:text-lg font-medium text-charcoal mb-3 sm:mb-4">
                  Booking Status
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                      <span className="text-charcoal/70">Normal</span>
                      <span className="font-medium text-charcoal">
                        {stats.todayNormal} / {BOOKING_RULES.MAX_NORMAL_PER_DAY}
                      </span>
                    </div>
                    <div className="h-2 bg-charcoal/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-charcoal rounded-full transition-all"
                        style={{ width: `${(stats.todayNormal / BOOKING_RULES.MAX_NORMAL_PER_DAY) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                      <span className="text-charcoal/70">Urgent</span>
                      <span className="font-medium text-wine">
                        {stats.todayUrgent} / {BOOKING_RULES.MAX_URGENT_PER_DAY}
                      </span>
                    </div>
                    <div className="h-2 bg-wine/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-wine rounded-full transition-all"
                        style={{ width: `${(stats.todayUrgent / BOOKING_RULES.MAX_URGENT_PER_DAY) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6">
                <h3 className="font-playfair text-base sm:text-lg font-medium text-charcoal mb-3 sm:mb-4">
                  Revenue
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/70 text-xs sm:text-sm">Total Revenue</span>
                    <span className="text-lg sm:text-2xl font-bold text-charcoal">
                      ₹{stats.revenueTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/70 text-xs sm:text-sm">Advance Collected</span>
                    <span className="text-base sm:text-lg font-medium text-gold">
                      ₹{stats.advanceCollected.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-sm border border-charcoal/10 p-4 sm:p-6">
              <h3 className="font-playfair text-base sm:text-lg font-medium text-charcoal mb-3 sm:mb-4">
                Orders by Status
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
                {Object.entries(orderStatuses).map(([key, status]) => {
                  const count = orders.filter(o => o.status === key).length;
                  return (
                    <div key={key} className="text-center p-2 sm:p-4 bg-charcoal/5 rounded-sm">
                      <span className="text-lg sm:text-2xl font-bold text-charcoal">{count}</span>
                      <p className="text-xs sm:text-sm text-charcoal/60 mt-1">{status.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`btn-secondary text-sm py-2 ${showFilters ? 'bg-charcoal text-ivory' : ''}`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {(filters.date || filters.status || filters.bookingType) && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-gold text-charcoal text-xs flex items-center justify-center">
                      {[filters.date, filters.status, filters.bookingType].filter(Boolean).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setFilters({ date: '', status: '', bookingType: '' })}
                  className="text-sm text-charcoal/60 hover:text-charcoal"
                >
                  Clear All
                </button>
              </div>
              <button onClick={exportToCSV} className="btn-primary text-sm py-2">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-sm border border-charcoal/10 p-6 mb-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Date</label>
                    <input
                      type="date"
                      value={filters.date}
                      onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">All Statuses</option>
                      {Object.entries(orderStatuses).map(([key, status]) => (
                        <option key={key} value={key}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Booking Type</label>
                    <select
                      value={filters.bookingType}
                      onChange={(e) => setFilters(prev => ({ ...prev, bookingType: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">All Types</option>
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-sm border border-charcoal/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-charcoal/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-charcoal/70 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-charcoal/70 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-charcoal/70 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-charcoal/70 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-charcoal/70 uppercase tracking-wider">
                        Measurement
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-charcoal/70 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-charcoal/70 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-charcoal/70 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-charcoal/70 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal/10">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-charcoal/50">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-charcoal/5">
                          <td className="px-4 py-4">
                            <span className="font-mono text-sm font-medium text-charcoal">
                              {order.id}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-charcoal">{order.customerName}</p>
                              <p className="text-sm text-charcoal/60">{order.phone}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-charcoal">
                            {order.serviceName}
                          </td>
                          <td className="px-4 py-4 text-sm text-charcoal">
                            {order.bookingDate}
                          </td>
                          <td className="px-4 py-4 text-sm text-charcoal">
                            {order.measurementMethod === 'tailor' || order.tailorVisitDate
                              ? (
                                  order.tailorVisitDate 
                                    ? (typeof order.tailorVisitDate === 'string' 
                                        ? order.tailorVisitDate.split('T')[0]
                                        : new Date(order.tailorVisitDate).toISOString().split('T')[0]
                                      )
                                    : 'Tailor'
                                )
                              : 'Self-measured'
                            }
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.bookingType === 'urgent' 
                                ? 'bg-wine/10 text-wine' 
                                : 'bg-charcoal/10 text-charcoal'
                            }`}>
                              {order.bookingType}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-charcoal">₹{order.totalAmount}</p>
                              <p className="text-xs text-gold">Adv: ₹{order.advanceAmount}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer ${statusColors[order.status]}`}
                            >
                              {Object.entries(orderStatuses).map(([key, status]) => (
                                <option key={key} value={key}>{status.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            {order.status !== 'ready' && (
                              <button
                                onClick={() => markAsFulfilled(order.id)}
                                className="text-sm text-gold hover:text-gold-dark font-medium"
                              >
                                Mark Ready
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-charcoal/60">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
