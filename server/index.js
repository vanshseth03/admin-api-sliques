const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const webpush = require('web-push');
const ImageKit = require('imagekit');

const app = express();

// Check if running in serverless environment (Vercel)
const isServerless = process.env.VERCEL === '1';

// WebSocket setup - only for non-serverless environments
let server, wss, clients;
if (!isServerless) {
  const http = require('http');
  const { WebSocketServer } = require('ws');
  server = http.createServer(app);
  wss = new WebSocketServer({ server });
  clients = new Set();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Admin client connected');
    
    ws.on('close', () => {
      clients.delete(ws);
      console.log('Admin client disconnected');
    });
  });
}

// Broadcast to all connected admin clients (no-op in serverless)
const broadcastToAdmins = (data) => {
  if (!isServerless && clients) {
    clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ImageKit setup
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Web Push setup
try {
  if (!process.env.VAPID_EMAIL || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.error('❌ Missing VAPID environment variables!');
    console.error('  VAPID_EMAIL:', !!process.env.VAPID_EMAIL);
    console.error('  VAPID_PUBLIC_KEY:', !!process.env.VAPID_PUBLIC_KEY);
    console.error('  VAPID_PRIVATE_KEY:', !!process.env.VAPID_PRIVATE_KEY);
  } else {
    webpush.setVapidDetails(
      process.env.VAPID_EMAIL,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    console.log('✅ Web Push VAPID configured');
  }
} catch (error) {
  console.error('❌ VAPID setup error:', error.message);
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Import models
const Order = require('./models/Order');
const PushSubscription = require('./models/PushSubscription');

// ============ API ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Get VAPID public key for push notifications
app.get('/api/push/vapid-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Debug: Get push subscription count and test notifications
app.get('/api/push/debug', async (req, res) => {
  try {
    const subscriptions = await PushSubscription.find({ deviceType: 'admin' });
    res.json({
      totalAdminSubscriptions: subscriptions.length,
      subscriptions: subscriptions.map(s => ({
        endpoint: s.endpoint?.substring(0, 60) + '...',
        hasP256dh: !!s.keys?.p256dh,
        hasAuth: !!s.keys?.auth,
        lastActive: s.lastActive,
        createdAt: s.createdAt
      })),
      vapidConfigured: !!process.env.VAPID_PUBLIC_KEY && !!process.env.VAPID_PRIVATE_KEY
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test push notification endpoint
app.post('/api/push/test', async (req, res) => {
  try {
    const count = await sendPushNotification(
      '🧪 Test Notification',
      'Push notifications are working!',
      { type: 'test' }
    );
    res.json({ success: true, notificationsSent: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subscribe to push notifications
app.post('/api/push/subscribe', async (req, res) => {
  try {
    const { subscription, deviceType } = req.body;
    
    console.log('📱 Push subscription request:', {
      endpoint: subscription.endpoint?.substring(0, 50) + '...',
      hasKeys: !!subscription.keys,
      deviceType
    });
    
    // Save or update subscription - explicitly extract keys to ensure proper storage
    const saved = await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { 
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys?.p256dh,
          auth: subscription.keys?.auth
        },
        deviceType: deviceType || 'admin',
        lastActive: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log('✅ Subscription saved:', saved._id);
    
    res.json({ success: true, message: 'Subscribed to notifications' });
  } catch (error) {
    console.error('Push subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Send push notification to all admin devices
const sendPushNotification = async (title, body, data = {}) => {
  try {
    const subscriptions = await PushSubscription.find({ deviceType: 'admin' });
    
    console.log(`📢 Sending push notification to ${subscriptions.length} admin devices:`, { title, body });
    
    if (subscriptions.length === 0) {
      console.log('⚠️ No admin subscriptions found - no notifications sent');
      return 0;
    }
    
    const payload = JSON.stringify({
      title,
      body,
      icon: '/favicon.png',
      badge: '/favicon.png',
      data,
      timestamp: Date.now()
    });
    
    const results = await Promise.allSettled(
      subscriptions.map(sub => {
        console.log('  → Sending to:', sub.endpoint?.substring(0, 50) + '...');
        return webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.keys?.p256dh,
            auth: sub.keys?.auth
          }
        }, payload);
      })
    );
    
    // Log results and remove invalid subscriptions
    let successCount = 0;
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === 'rejected') {
        console.log('  ❌ Failed:', results[i].reason?.message || results[i].reason);
        await PushSubscription.deleteOne({ endpoint: subscriptions[i].endpoint });
      } else {
        successCount++;
        console.log('  ✅ Sent successfully');
      }
    }
    
    console.log(`📊 Push notification result: ${successCount}/${subscriptions.length} successful`);
    return successCount;
  } catch (error) {
    console.error('Push notification error:', error);
    return 0;
  }
};

// ImageKit auth endpoint
app.get('/api/imagekit/auth', (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.json(authParams);
});

// Upload image to ImageKit
app.post('/api/imagekit/upload', async (req, res) => {
  try {
    const { file, fileName, folder } = req.body;
    
    const result = await imagekit.upload({
      file: file, // base64 string
      fileName: fileName,
      folder: folder || '/sliques/orders'
    });
    
    res.json({ 
      success: true, 
      url: result.url,
      fileId: result.fileId 
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ============ ORDER ROUTES ============

// Create new order
// Generate unique order ID: SLQ + 4 digit sequence (e.g., SLQ1003)
const generateOrderId = async () => {
  // Get total count of all orders
  const orderCount = await Order.countDocuments();
  const sequence = String(orderCount + 1).padStart(4, '0');
  
  return `SLQ${sequence}`;
};

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Generate unique non-guessable order ID
    const orderId = await generateOrderId();
    
    // Upload custom neck image if present
    let customNeckImageUrl = null;
    if (orderData.customization?.customNeckImage) {
      try {
        const result = await imagekit.upload({
          file: orderData.customization.customNeckImage,
          fileName: `${orderId}-neck-design.jpg`,
          folder: '/sliques/orders/neck-designs'
        });
        customNeckImageUrl = result.url;
      } catch (uploadError) {
        console.error('Neck image upload error:', uploadError);
      }
    }
    
    // Upload additional images if present
    let additionalImagesUrls = [];
    if (orderData.additionalImages?.length > 0) {
      for (let i = 0; i < orderData.additionalImages.length; i++) {
        const img = orderData.additionalImages[i];
        try {
          const result = await imagekit.upload({
            file: img.data,
            fileName: `${orderId}-additional-${i + 1}.jpg`,
            folder: '/sliques/orders/additional'
          });
          additionalImagesUrls.push({
            url: result.url,
            description: img.description || '',
            uploadedAt: new Date()
          });
        } catch (uploadError) {
          console.error('Additional image upload error:', uploadError);
        }
      }
    }
    
    const order = new Order({
      ...orderData,
      orderId,
      status: 'pickup-awaited',
      createdAt: new Date(),
      // Ensure dates are properly parsed
      estimatedDelivery: orderData.estimatedDelivery ? new Date(orderData.estimatedDelivery) : null,
      bookingDate: orderData.bookingDate ? new Date(orderData.bookingDate) : new Date(),
      processingStartDate: orderData.processingStartDate ? new Date(orderData.processingStartDate) : null,
      customization: {
        ...orderData.customization,
        customNeckImageUrl
      },
      additionalImages: additionalImagesUrls
    });
    
    await order.save();
    
    // Send push notification
    const notifCount = await sendPushNotification(
      '🪡 New Order!',
      `${orderData.customerName} booked ${orderData.serviceName}`,
      { orderId, type: 'new_order' }
    );
    
    // Broadcast to connected admin clients
    broadcastToAdmins({
      type: 'NEW_ORDER',
      order: order.toObject()
    });
    
    console.log(`✅ Order ${orderId} created, ${notifCount} notifications sent`);
    
    res.json({ success: true, order: order.toObject() });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const { status, limit = 50, skip = 0 } = req.query;
    
    const query = status ? { status } : {};
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await Order.countDocuments(query);
    
    res.json({ orders, total });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { 
        status,
        $push: { 
          statusHistory: { 
            status, 
            note, 
            timestamp: new Date() 
          } 
        }
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Broadcast update
    broadcastToAdmins({
      type: 'ORDER_UPDATED',
      order: order.toObject()
    });
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Add image to order
app.post('/api/orders/:id/images', async (req, res) => {
  try {
    const { imageUrl, imageType, description } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { 
        $push: { 
          images: { 
            url: imageUrl, 
            type: imageType,
            description,
            uploadedAt: new Date() 
          } 
        }
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add image' });
  }
});

// Get today's stats
app.get('/api/stats/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = await Order.aggregate([
      {
        $facet: {
          todayOrders: [
            { $match: { createdAt: { $gte: today } } },
            { $count: 'count' }
          ],
          pendingOrders: [
            { $match: { status: 'pending' } },
            { $count: 'count' }
          ],
          inProgressOrders: [
            { $match: { status: 'in-progress' } },
            { $count: 'count' }
          ],
          todayRevenue: [
            { $match: { createdAt: { $gte: today } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
          ]
        }
      }
    ]);
    
    res.json({
      todayOrders: stats[0].todayOrders[0]?.count || 0,
      pendingOrders: stats[0].pendingOrders[0]?.count || 0,
      inProgressOrders: stats[0].inProgressOrders[0]?.count || 0,
      todayRevenue: stats[0].todayRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get available dates for normal orders (max 4 per day, starting from 1 week ahead)
app.get('/api/available-dates', async (req, res) => {
  try {
    const MAX_NORMAL_PER_DAY = 4;
    const MIN_DAYS_AHEAD = 7;
    const DAYS_TO_CHECK = 30;
    
    // Calculate the start date (1 week from today)
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() + MIN_DAYS_AHEAD);
    
    // Get order counts for the next 30 days
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + DAYS_TO_CHECK);
    
    // Aggregate orders by booking date
    const orderCounts = await Order.aggregate([
      {
        $match: {
          bookingDate: { $gte: startDate, $lte: endDate },
          bookingType: 'normal',
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$bookingDate' } },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Create a map of date -> count
    const countMap = {};
    orderCounts.forEach(item => {
      countMap[item._id] = item.count;
    });
    
    // Find available dates (less than 4 orders)
    const availableDates = [];
    const checkDate = new Date(startDate);
    
    for (let i = 0; i < DAYS_TO_CHECK; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const count = countMap[dateStr] || 0;
      const remainingSlots = MAX_NORMAL_PER_DAY - count;
      
      if (remainingSlots > 0) {
        availableDates.push({
          date: dateStr,
          remainingSlots,
          isFull: false
        });
      } else {
        availableDates.push({
          date: dateStr,
          remainingSlots: 0,
          isFull: true
        });
      }
      
      checkDate.setDate(checkDate.getDate() + 1);
    }
    
    // Find the first available date
    const firstAvailable = availableDates.find(d => !d.isFull);
    
    res.json({
      success: true,
      minDaysAhead: MIN_DAYS_AHEAD,
      maxPerDay: MAX_NORMAL_PER_DAY,
      firstAvailableDate: firstAvailable?.date || null,
      dates: availableDates
    });
  } catch (error) {
    console.error('Get available dates error:', error);
    res.status(500).json({ error: 'Failed to fetch available dates' });
  }
});

// Start server (only in non-serverless environments)
if (!isServerless) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 WebSocket ready for real-time updates`);
  });
}

// Export for Vercel serverless
module.exports = app;
