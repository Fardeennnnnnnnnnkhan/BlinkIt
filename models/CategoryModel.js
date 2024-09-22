const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Category Schema
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
});

// Joi Validation Schema for Category
const joiCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});

// Function to Validate Category Data with Joi
function validateCategory(data) {
  return joiCategorySchema.validate(data);
}

// Export Mongoose Model and Validation Function
const categoryModel = mongoose.model('Category', categorySchema);

module.exports = {
  categoryModel,
  validateCategory,
};
