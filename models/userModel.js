const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Address Schema
const addressSchema = mongoose.Schema({
  state: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: Number, required: true },
  address: { type: String, required: true },
});

// Mongoose User Schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/, // Basic email validation
    },
    password: { type: String, minlength: 8 },
    phone: {
      type: String, // Stored as a string to handle leading zeros
      match: /^[0-9]{10}$/, // Ensures phone is a 10-digit number
    },
    addresses: { type: [addressSchema], required: true },
  },
  { timestamps: true }
);

// Joi Validation Schema for Address
const joiAddressSchema = Joi.object({
  state: Joi.string().min(2).max(50).required(),
  city: Joi.string().min(2).max(50).required(),
  zip: Joi.number().required(),
  address: Joi.string().min(5).max(100).required(),
});

// Joi Validation Schema for User
const joiUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(), // Ensures phone is a 10-digit number
  addresses: Joi.array().items(joiAddressSchema).required(),
});

// Function to Validate User Data with Joi
function validateUser(data) {
  return joiUserSchema.validate(data);
}

// Export Mongoose Model and Validation Function
const userModel = mongoose.model('User', userSchema);

module.exports = {
    userModel,
  validateUser,
};
