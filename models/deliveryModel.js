const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Delivery Schema
const deliverySchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order',
    required: true,
  },
  deliveryBoy: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  status: {
    type: String,
    required: true,
    enum: ['assigned', 'in_transit', 'delivered', 'cancelled'], // Example status options
  },
  trackingURL: {
    type: String,
    required: true,
    match: /^https?:\/\/.+/, // Basic URL validation
  },
  estimatedDeliveryTime: {
    type: Number,
    required: true,
    min: 1, // Minimum 1 hour for estimated delivery
  },
});

// Joi Validation Schema for Delivery
const joiDeliverySchema = Joi.object({
  order: Joi.string().required(),
  deliveryBoy: Joi.string().min(3).max(50).required(),
  status: Joi.string()
    .valid('assigned', 'in_transit', 'delivered', 'cancelled')
    .required(),
  trackingURL: Joi.string().uri().required(),
  estimatedDeliveryTime: Joi.number().min(1).required(),
});

// Function to Validate Delivery Data with Joi
function validateDelivery(data) {
  return joiDeliverySchema.validate(data);
}

// Export Mongoose Model and Validation Function
const deliveryModel = mongoose.model('Delivery', deliverySchema);

module.exports = {
  deliveryModel,
  validateDelivery,
};
