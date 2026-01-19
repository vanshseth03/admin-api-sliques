import React, { useState, useEffect, useCallback, useRef } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Package, Clock, CheckCircle, Truck, Bell, Settings, 
  RefreshCw, Camera, ChevronRight, Phone, MapPin, 
  IndianRupee, AlertCircle, X, Check, Scissors, 
  Home, Search, Filter, Plus, Image, FileText, 
  Sparkles, User, Calendar
} from 'lucide-react';

// Production API URL - no localhost fallback for deployed app
const API_URL = process.env.REACT_APP_API_URL || 'https://admin-api-sliques.vercel.app';
// WebSocket disabled for Vercel serverless - using polling instead
const WS_ENABLED = false;

// Status configuration - Simplified workflow
const STATUS_CONFIG = {
  'pickup-awaited': { label: 'Pickup Awaited', icon: Clock, color: 'orange', next: 'fabric-received' },
  'fabric-received': { label: 'Fabric Received', icon: Package, color: 'blue', next: 'processing' },
  'processing': { label: 'Processing', icon: Scissors, color: 'purple', next: 'ready' },
  'ready': { label: 'Ready', icon: CheckCircle, color: 'lime', next: 'out-for-delivery' },
  'out-for-delivery': { label: 'Out for Delivery', icon: Truck, color: 'amber', next: 'delivered' },
  'delivered': { label: 'Delivered', icon: CheckCircle, color: 'green', next: null },
  'cancelled': { label: 'Cancelled', icon: X, color: 'red', next: null }
};

const ORDERS_PER_PAGE = 30;

function App() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ todayOrders: 0, pendingOrders: 0, inProgressOrders: 0, todayRevenue: 0 });
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const wsRef = useRef(null);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/stats/today`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // WebSocket connection with real-time selectedOrder sync (disabled for Vercel serverless)
  useEffect(() => {
    // WebSocket disabled for Vercel - using polling instead
    if (!WS_ENABLED) {
      // Poll for updates every 10 seconds
      const pollInterval = setInterval(() => {
        fetchOrders();
        fetchStats();
      }, 10000);
      
      return () => clearInterval(pollInterval);
    }
    
    // WebSocket code for non-serverless environments
    let reconnectTimeout;
    const WS_URL = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    
    const connectWS = () => {
      try {
        wsRef.current = new WebSocket(WS_URL);
        
        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
          setWsConnected(true);
        };
        
        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'NEW_ORDER') {
              setOrders(prev => [data.order, ...prev]);
              fetchStats();
              // Vibrate on new order
              if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
              }
            } else if (data.type === 'ORDER_UPDATED') {
              setOrders(prev => prev.map(o => 
                o.orderId === data.order.orderId ? data.order : o
              ));
              // Also update selectedOrder if it's the one being viewed
              setSelectedOrder(prev => 
                prev && prev.orderId === data.order.orderId ? data.order : prev
              );
              fetchStats();
            }
          } catch (e) {
            console.error('WS message parse error:', e);
          }
        };
        
        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          setWsConnected(false);
          // Reconnect after 3 seconds
          reconnectTimeout = setTimeout(connectWS, 3000);
        };
        
        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsConnected(false);
        };
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setWsConnected(false);
        reconnectTimeout = setTimeout(connectWS, 3000);
      }
    };
    
    connectWS();
    
    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [fetchOrders, fetchStats]);

  // Initial load
  useEffect(() => {
    fetchOrders();
    fetchStats();
    
    // Check notification permission
    if ('Notification' in window) {
      setNotifEnabled(Notification.permission === 'granted');
      if (Notification.permission === 'default') {
        setShowNotifPrompt(true);
      }
    }
  }, [fetchOrders, fetchStats]);

  // Subscribe to push notifications
  const subscribeToPush = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
      
      const registration = await navigator.serviceWorker.ready;
      
      // Get VAPID key
      const vapidRes = await fetch(`${API_URL}/api/push/vapid-key`);
      const { publicKey } = await vapidRes.json();
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
      
      await fetch(`${API_URL}/api/push/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, deviceType: 'admin' })
      });
      
      setNotifEnabled(true);
      setShowNotifPrompt(false);
    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  };

  // Update order status - with immediate local update for responsiveness
  const updateStatus = async (orderId, newStatus) => {
    // Optimistic update for instant feedback
    setOrders(prev => prev.map(o => 
      o.orderId === orderId ? { ...o, status: newStatus } : o
    ));
    setSelectedOrder(prev => 
      prev && prev.orderId === orderId ? { ...prev, status: newStatus } : prev
    );
    
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        const data = await res.json();
        // Update with server response
        setOrders(prev => prev.map(o => 
          o.orderId === orderId ? data.order : o
        ));
        setSelectedOrder(prev => 
          prev && prev.orderId === orderId ? data.order : prev
        );
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert on error by refetching
      fetchOrders();
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = !searchQuery || 
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#111317] text-[#FBF9F6] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#111317]/95 backdrop-blur-sm border-b border-[#2a2a2a] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#C9A227]">SLIQUES Admin</h1>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-xs text-gray-500">{wsConnected ? 'Live' : 'Connecting...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            {!notifEnabled && (
              <button 
                onClick={() => setShowNotifPrompt(true)}
                className="p-2 rounded-full bg-[#2a2a2a] active:scale-95 transition-transform relative"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}
            <button 
              onClick={() => { fetchOrders(); fetchStats(); }}
              className="p-2 rounded-full bg-[#2a2a2a] active:scale-95 transition-transform"
            >
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Notification Prompt */}
      {showNotifPrompt && (
        <div className="mx-4 mt-4 p-4 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-xl animate-slide-up">
          <div className="flex items-start gap-3">
            <Bell className="w-6 h-6 text-[#C9A227] flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">Enable Notifications</h3>
              <p className="text-xs text-gray-400 mb-3">Get instant alerts when new orders come in</p>
              <div className="flex gap-2">
                <button 
                  onClick={subscribeToPush}
                  className="px-4 py-2 bg-[#C9A227] text-[#111317] rounded-lg text-sm font-medium"
                >
                  Enable
                </button>
                <button 
                  onClick={() => setShowNotifPrompt(false)}
                  className="px-4 py-2 text-gray-400 text-sm"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-xs text-gray-500 mb-1">Today's Orders</p>
          <p className="text-2xl font-bold text-[#C9A227]">{stats.todayOrders}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-xs text-gray-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-400">{stats.pendingOrders}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-xs text-gray-500 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-400">{stats.inProgressOrders}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-xs text-gray-500 mb-1">Today's Revenue</p>
          <p className="text-2xl font-bold text-green-400">₹{stats.todayRevenue?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 pb-4 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-sm appearance-none"
          >
            <option value="all">All</option>
            <option value="pickup-awaited">Pickup Awaited</option>
            <option value="fabric-received">Fabric Received</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List with Pagination */}
      <div className="px-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <>
            {/* Paginated Orders */}
            {filteredOrders
              .slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE)
              .map((order, index) => (
                <OrderCard 
                  key={order.orderId || index}
                  order={order}
                  onSelect={() => setSelectedOrder(order)}
                  onStatusUpdate={updateStatus}
                />
              ))
            }
            
            {/* Pagination Controls */}
            {filteredOrders.length > ORDERS_PER_PAGE && (
              <div className="flex items-center justify-between py-4 border-t border-[#2a2a2a] mt-4">
                <p className="text-xs text-gray-500">
                  Showing {((currentPage - 1) * ORDERS_PER_PAGE) + 1} - {Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg text-sm bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm text-[#C9A227]">
                    {currentPage} / {Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredOrders.length / ORDERS_PER_PAGE), p + 1))}
                    disabled={currentPage >= Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetail 
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={updateStatus}
        />
      )}

      {/* Bottom Navigation - Removed, only Orders view needed */}
      {/* All controls are now in the header */}
    </div>
  );
}

// Order Card Component - Enhanced with custom order preview
function OrderCard({ order, onSelect, onStatusUpdate }) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG['pickup-awaited'];
  const StatusIcon = statusConfig?.icon || Package;
  const isCustomOrder = order.serviceType === 'custom';
  
  const handleQuickStatusUpdate = (e) => {
    e.stopPropagation();
    if (statusConfig?.next) {
      onStatusUpdate(order.orderId, statusConfig.next);
    }
  };

  return (
    <div className="order-card" onClick={onSelect}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs text-[#C9A227]">{order.orderId}</p>
            {isCustomOrder && (
              <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] rounded">
                CUSTOM
              </span>
            )}
          </div>
          <h3 className="font-medium mt-1">{order.customerName}</h3>
        </div>
        <span className={`status-${order.status} px-2 py-1 rounded-full text-xs font-medium`}>
          {statusConfig?.label || order.status}
        </span>
      </div>
      
      <p className="text-sm text-gray-400 mb-2">{order.serviceName}</p>
      
      {/* Show custom details preview and measurement indicator */}
      <div className="flex flex-wrap gap-1 mb-2">
        {/* Measurement indicator */}
        {order.measurements && Object.keys(order.measurements).length > 0 ? (
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded flex items-center gap-1">
            <Check className="w-2.5 h-2.5" />
            Measurements
          </span>
        ) : (
          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] rounded flex items-center gap-1">
            <AlertCircle className="w-2.5 h-2.5" />
            No Measurements
          </span>
        )}
        
        {/* Custom details */}
        {isCustomOrder && order.customization && (
          <>
            {order.customization.neckDesign && (
              <span className="px-2 py-0.5 bg-[#2a2a2a] text-gray-400 text-[10px] rounded">
                {order.customization.neckDesign}
              </span>
            )}
            {order.customization.sleeveStyle && (
              <span className="px-2 py-0.5 bg-[#2a2a2a] text-gray-400 text-[10px] rounded">
                {order.customization.sleeveStyle}
              </span>
            )}
            {order.customization.addOns?.length > 0 && (
              <span className="px-2 py-0.5 bg-[#2a2a2a] text-gray-400 text-[10px] rounded">
                +{order.customization.addOns.length} add-ons
              </span>
            )}
          </>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3 h-3" />
            {order.totalAmount}
          </span>
          <span>
            {order.createdAt && formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        {statusConfig?.next && (
          <button 
            onClick={handleQuickStatusUpdate}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#C9A227]/10 text-[#C9A227] rounded-lg active:scale-95 transition-transform"
          >
            <Check className="w-3 h-3" />
            <span>Next</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Order Detail Modal - Enhanced with full customization details
function OrderDetail({ order, onClose, onStatusUpdate }) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG['pickup-awaited'];
  const isCustomOrder = order.serviceType === 'custom';
  
  const handleCall = () => {
    window.location.href = `tel:${order.phone}`;
  };
  
  const handleWhatsApp = () => {
    window.open(`https://wa.me/91${order.phone}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="absolute inset-x-0 bottom-0 max-h-[90vh] bg-[#1a1a1a] rounded-t-3xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] px-4 py-4 border-b border-[#2a2a2a] flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-[#C9A227]">{order.orderId}</p>
              {isCustomOrder && (
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                  CUSTOM ORDER
                </span>
              )}
            </div>
            <h2 className="font-semibold text-lg">{order.customerName}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-[#2a2a2a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 space-y-4 pb-8">
          {/* Status */}
          <div className="bg-[#111317] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2">Status</p>
            <span className={`status-${order.status} px-3 py-1.5 rounded-full text-sm font-medium inline-block`}>
              {statusConfig?.label || order.status}
            </span>
            
            {/* Status buttons - Show all available status options */}
            <div className="mt-4 flex flex-wrap gap-2">
              {/* Show current status */}
              <span className="px-3 py-1.5 rounded-lg text-xs bg-[#C9A227] text-[#111317]">
                {statusConfig?.label || order.status}
              </span>
              
              {/* Show next status if available (highlighted) */}
              {statusConfig?.next && STATUS_CONFIG[statusConfig.next] && (
                <button
                  onClick={() => onStatusUpdate(order.orderId, statusConfig.next)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-green-500/20 text-green-400 active:scale-95 transition-all flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  {STATUS_CONFIG[statusConfig.next].label}
                </button>
              )}
              
              {/* Show all other statuses (except current, next, and cancelled) */}
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                order.status !== key && key !== statusConfig?.next && key !== 'cancelled' && key !== 'delivered' && (
                  <button
                    key={key}
                    onClick={() => onStatusUpdate(order.orderId, key)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-[#2a2a2a] text-gray-400 hover:bg-[#C9A227]/20 hover:text-[#C9A227] active:scale-95 transition-all"
                  >
                    {config.label}
                  </button>
                )
              ))}
              
              {/* Show cancel if not already cancelled/delivered */}
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <button
                  onClick={() => onStatusUpdate(order.orderId, 'cancelled')}
                  className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 active:scale-95 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          
          {/* Service Details */}
          <div className="bg-[#111317] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2">Service</p>
            <h3 className="font-medium text-lg">{order.serviceName}</h3>
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs ${order.bookingType === 'urgent' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {order.bookingType === 'urgent' ? '🔴 Urgent' : '🟢 Normal'}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">
                {order.serviceType === 'custom' ? '✨ Custom' : '📋 Standard'}
              </span>
            </div>
          </div>

          {/* Delivery Date - Portal Assigned */}
          <div className="bg-[#111317] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Delivery Schedule
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Booking Date</span>
                <span className="text-sm font-medium">
                  {order.bookingDate 
                    ? format(new Date(order.bookingDate), 'dd MMM yyyy')
                    : order.createdAt 
                    ? format(new Date(order.createdAt), 'dd MMM yyyy')
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Expected Delivery</span>
                <span className="text-sm font-medium text-[#C9A227]">
                  {order.estimatedDelivery 
                    ? format(new Date(order.estimatedDelivery), 'EEEE, dd MMM yyyy')
                    : 'Not set'}
                </span>
              </div>
              {order.preferredSlot && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Preferred Slot</span>
                  <span className="text-sm">{order.preferredSlot}</span>
                </div>
              )}
            </div>
          </div>

          {/* Measurements Section */}
          <div className="bg-[#111317] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
              <User className="w-3 h-3" />
              Measurements
            </p>
            {order.measurements && Object.keys(order.measurements).length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-medium">Measurements Provided</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {order.measurements.bust && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Bust</span>
                      <span>{order.measurements.bust}"</span>
                    </div>
                  )}
                  {order.measurements.waist && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Waist</span>
                      <span>{order.measurements.waist}"</span>
                    </div>
                  )}
                  {order.measurements.hips && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Hips</span>
                      <span>{order.measurements.hips}"</span>
                    </div>
                  )}
                  {order.measurements.shoulderWidth && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shoulder</span>
                      <span>{order.measurements.shoulderWidth}"</span>
                    </div>
                  )}
                  {order.measurements.sleeveLength && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Sleeve</span>
                      <span>{order.measurements.sleeveLength}"</span>
                    </div>
                  )}
                  {order.measurements.blouseLength && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Length</span>
                      <span>{order.measurements.blouseLength}"</span>
                    </div>
                  )}
                  {order.measurements.height && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Height</span>
                      <span>{order.measurements.height} cm</span>
                    </div>
                  )}
                  {order.measurements.armhole && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Armhole</span>
                      <span>{order.measurements.armhole}"</span>
                    </div>
                  )}
                </div>
                {order.measurementMethod && (
                  <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-[#2a2a2a]">
                    Method: {order.measurementMethod === 'tailor' ? '📏 Tailor Visit' : '✍️ Self-Provided'}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-400">Measurements Not Provided</span>
              </div>
            )}
          </div>

          {/* Custom Order Details */}
          {isCustomOrder && order.customization && (
            <div className="bg-[#111317] rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Customization Details
              </p>
              <div className="space-y-3">
                {order.customization.neckDesign && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Neck Design</span>
                    <span className="text-sm font-medium text-[#C9A227]">{order.customization.neckDesign}</span>
                  </div>
                )}
                {order.customization.sleeveStyle && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Sleeve Style</span>
                    <span className="text-sm font-medium">{order.customization.sleeveStyle}</span>
                  </div>
                )}
                {order.customization.fit && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Fit</span>
                    <span className="text-sm font-medium">{order.customization.fit}</span>
                  </div>
                )}
                {order.customization.addOns?.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">Add-ons</span>
                    <div className="flex flex-wrap gap-2">
                      {order.customization.addOns.map((addon, i) => (
                        <span key={i} className="px-2 py-1 bg-[#2a2a2a] text-[#C9A227] text-xs rounded">
                          {addon}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Images */}
          {(order.images?.length > 0 || order.customization?.customNeckImageUrl || order.additionalImages?.length > 0) && (
            <div className="bg-[#111317] rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                <Image className="w-3 h-3" />
                Reference Images
              </p>
              <div className="grid grid-cols-3 gap-2">
                {order.customization?.customNeckImageUrl && (
                  <a href={order.customization.customNeckImageUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-lg overflow-hidden bg-[#2a2a2a]">
                    <img 
                      src={order.customization.customNeckImageUrl} 
                      alt="Custom neck design"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-[10px] rounded">
                      Neck
                    </span>
                  </a>
                )}
                {order.additionalImages?.map((img, i) => (
                  <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-lg overflow-hidden bg-[#2a2a2a]">
                    <img 
                      src={img.url} 
                      alt={img.description || `Reference ${i+1}`}
                      className="w-full h-full object-cover"
                    />
                    {img.description && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-[10px] rounded truncate max-w-[90%]">
                        {img.description}
                      </span>
                    )}
                  </a>
                ))}
                {order.images?.map((img, i) => (
                  <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="relative aspect-square rounded-lg overflow-hidden bg-[#2a2a2a]">
                    <img 
                      src={img.url} 
                      alt={img.description || `Image ${i+1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-[10px] rounded">
                      {img.type || 'Ref'}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Additional Remarks */}
          {order.additionalRemarks && (
            <div className="bg-[#111317] rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Additional Remarks
              </p>
              <p className="text-sm text-gray-300">{order.additionalRemarks}</p>
              {order.extraChargesNote && (
                <p className="text-xs text-orange-400 mt-2">⚠️ Extra charges may apply</p>
              )}
            </div>
          )}
          
          {/* Bill Breakdown */}
          <div className="bg-[#111317] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
              <IndianRupee className="w-3 h-3" />
              Bill Breakdown
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Base Price ({order.serviceName})</span>
                <span>₹{order.basePrice || order.totalAmount}</span>
              </div>
              {order.customization?.addOns?.length > 0 && order.addOnsTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Add-ons ({order.customization.addOns.length})</span>
                  <span>+₹{order.addOnsTotal}</span>
                </div>
              )}
              {order.bookingType === 'urgent' && order.urgentSurcharge > 0 && (
                <div className="flex justify-between text-sm text-red-400">
                  <span>Urgent Surcharge (+30%)</span>
                  <span>+₹{order.urgentSurcharge}</span>
                </div>
              )}
              <div className="border-t border-[#2a2a2a] pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-xl text-[#C9A227]">₹{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
              {order.advanceAmount > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Advance (30%)</span>
                    <span className={order.advancePaid ? 'text-green-400' : 'text-orange-400'}>
                      ₹{order.advanceAmount} {order.advancePaid ? '✓ Paid' : '(Pending)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Balance Due</span>
                    <span>₹{(order.totalAmount - order.advanceAmount).toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Contact */}
          <div className="bg-[#111317] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-3">Contact</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <span className="text-sm text-gray-400">{order.address}</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-3">
              <button onClick={handleCall} className="flex-1 btn-outline flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button onClick={handleWhatsApp} className="flex-1 btn-gold flex items-center justify-center gap-2">
                WhatsApp
              </button>
            </div>
          </div>
          
          {/* Delivery */}
          <div className="bg-[#111317] rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2">Delivery</p>
            <p className="font-medium">
              {order.estimatedDelivery 
                ? format(new Date(order.estimatedDelivery), 'EEEE, dd MMM yyyy')
                : 'Not set'}
            </p>
            {order.measurementMethod && (
              <p className="text-xs text-gray-500 mt-1">
                Measurement: {order.measurementMethod === 'tailor' ? 'Tailor Visit' : 'Self-Provided'}
              </p>
            )}
          </div>
          
          {/* Notes */}
          {order.notes && (
            <div className="bg-[#111317] rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Customer Notes</p>
              <p className="text-sm text-gray-400">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default App;
