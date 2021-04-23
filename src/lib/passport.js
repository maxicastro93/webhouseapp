const passport = require("passport");
const LocalStrategy = require("passport-local");
const pool = require("../database");
const helpers = require("../lib/helpers");

// INICIO SESION USUARIOS

passport.use('local.login', new LocalStrategy ({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
   console.log(req.body);
   const rows = await pool.query('SELECT * FROM users WHERE username = ?' , [username]);
   if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
           done(null, user, req.flash('success','Bienvenido' + user.fullname));
        }
        else {
            done(null, false, req.flash('message','Contrasenia Incorrecta'));
        }
   } else {
        return done(null, false, req.flash('message','El usuario no existe')) 
   }
    
}));

// obtiene los datos de registro
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) =>{
    const {fullname} = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    //encripta la contrasenia
    newUser.password = await helpers.encryptPassword(password);
    // guarda en la db los datos de usuario
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser( async (id, done) =>{
    const filas = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    done(null, filas[0]);
});