const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Order Schema
const orderSchema = mongoose.Schema({
  orderid : {
    type : String,
    required : true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  address: {
    type: String,
    minlength: 5,
    maxlength: 100,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'], // Example status options
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'payment',
    required: true,
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'delivery',
  },
});

// Joi Validation Schema for Order
const joiOrderSchema = Joi.object({
  user: Joi.string().required(),
  products: Joi.array().items(Joi.string().required()).required(),
  totalPrice: Joi.number().min(0).required(),
  address: Joi.string().min(5).max(100).required(),
  status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled').required(),
  payment: Joi.string().required(),
  delivery: Joi.string().optional(),
});

// Function to Validate Order Data with Joi
function validateOrder(data) {
  return joiOrderSchema.validate(data);
}

// Export Mongoose Model and Validation Function
const orderModel = mongoose.model('Order', orderSchema);

module.exports = {
    orderModel,
  validateOrder,
};
