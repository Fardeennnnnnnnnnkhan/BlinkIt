const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Admin Schema
const adminSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    // required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, // Basic email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    required: true,
    enum: ['superadmin', 'admin', 'moderator'], // Example roles
  },
});

// Joi Validation Schema for Admin
const joiAdminSchema = Joi.object({
  user: Joi.string().required(),
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().min(5).max(255).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('superadmin', 'admin', 'moderator').required(),
});

// Function to Validate Admin Data with Joi
function validateAdmin(data) {
  return joiAdminSchema.validate(data);
}

// Export Mongoose Model and Validation Function
const adminModel  = mongoose.model('Admin', adminSchema);

module.exports = {
 adminModel ,
  validateAdmin,
};
