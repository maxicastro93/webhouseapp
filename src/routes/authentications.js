const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, yaEstaLogueado } = require('../lib/auth');



// REGISTRO USUARIO
router.get('/signup', yaEstaLogueado , (req, res) => {
    res.render('auth/signup');
})

router.post('/signup', yaEstaLogueado, passport.authenticate('local.signup', {
    successRedirect: '/perfil',
    failureRedirect: '/signup',
    failureFlash: true,
}))

// LOGIN USUARIO
router.get('/login', yaEstaLogueado, (req, res) => {
    res.render('auth/login');
});

router.post('/login', yaEstaLogueado, (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/perfil',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
});

router.get('/perfil', isLoggedIn, (req, res) => {
    res.render('perfil');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/login');
});


module.exports = router;