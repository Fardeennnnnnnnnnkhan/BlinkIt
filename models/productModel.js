const mongoose = require('mongoose');
const Joi = require('joi');


const productSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, minlength: 3, maxlength: 50 },
  stock: { type: Number, required: true },
  description: { type: String,},
  image: { type: Buffer },
});

// Joi Validation Schema for Product
const joiProductSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().min(3).max(50).required(),
  stock: Joi.number().required(),
  description: Joi.string().optional(),
  image: Joi.string().optional(),
});

// Function to Validate Product Data with Joi
function validateProduct(data) {
  return joiProductSchema.validate(data);
}

// Export Mongoose Model and Validation Function
const productModel = mongoose.model('Product', productSchema);

module.exports = {
    productModel,
  validateProduct,
};
