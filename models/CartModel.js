const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Cart Schema
const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const joiCartSchema = Joi.object({
  user: Joi.string().required(),
  products: Joi.array().items(Joi.string().required()).required(),
  totalPrice: Joi.number().min(0).required(),
});

// Function to Validate Cart Data with Joi
function validateCart(data) {
  return joiCartSchema.validate(data);
}

// Export Mongoose Model and Validation Function
const cartModel = mongoose.model('Cart', cartSchema);

module.exports = {
  cartModel,
  validateCart,
};
