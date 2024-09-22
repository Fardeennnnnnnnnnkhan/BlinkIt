const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to start Google authentication
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']  // Fix the scope array by removing the space
}));

// Callback route after Google authentication
router.get('/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/'  // Redirect to home if authentication fails
    }), 
    (req, res) => {
        res.redirect('/products');  // Redirect to profile page on successful authentication
    }
);

// Route to log out
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;