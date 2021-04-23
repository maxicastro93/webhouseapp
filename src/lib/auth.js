module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/login');
    },
    yaEstaLogueado(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/perfil');
    }

}