var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const {userModel} = require('../models/userModel');
const Joi = require('joi');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
 async function(accessToken, refreshToken, profile, cb) {
     try{
    let user  =  await userModel.findOne({email : profile.emails[0].value});
    if(!user) {
      user = new userModel({
        name : profile.displayName,
        email : profile.emails[0].value
      });
    }

    await user.save();

    cb(null , user)
     }catch(err){
          cb(err , false)
     }
  }
));
passport.serializeUser(function(user, cb) {
  cb(null, user._id); // Use `cb` instead of `return`
});

passport.deserializeUser(async function(id, cb) {
  try {
      const user = await userModel.findById(id); // Use `findById` for clarity
      cb(null, user);
  } catch (err) {
      cb(err);
  }
});

module.exports = passport;