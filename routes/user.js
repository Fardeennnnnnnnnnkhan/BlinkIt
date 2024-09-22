const express = require('express');
const router= express.Router();
const {userModel , validateUser}  = require('../models/userModel')
router.get('/login' , function(req,res){
  res.render("user_login");
})
router.get('/profile' , function(req,res){
  res.send("profile page");
})
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            // Clear the cookie that holds the session ID
            res.clearCookie("connect.sid", { path: '/' });
            // Redirect to the login page after logout
            res.redirect('/users/login');
        });
    });
});

module.exports = router;