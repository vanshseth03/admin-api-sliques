const mongoose = require('mongoose');

const pushSubscriptionSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true
  },
  keys: {
    p256dh: String,
    auth: String
  },
  deviceType: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'admin'
  },
  deviceName: String,
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);
