const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Payment Schema
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
  },
  signature: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
}, { timestamps: true });
// Joi Validation Schema for Payment
const joiPaymentSchema = Joi.object({
  order: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  method: Joi.string()
    .valid('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash')
    .required(),
  status: Joi.string()
    .valid('pending', 'completed', 'failed', 'refunded')
    .required(),
  transactionId: Joi.string().required(),
});

// Function to Validate Payment Data with Joi
function validatePayment(data) {
  return joiPaymentSchema.validate(data);
}

// Export Mongoose Model and Validation Function
const paymentModel = mongoose.model('Payment', paymentSchema);

module.exports = {
    paymentModel,
  validatePayment,
};
