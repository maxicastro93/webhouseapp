const { request } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../database');// hace referencia a la db
const { isLoggedIn } = require('../lib/auth');

router.get('/add',isLoggedIn , (req, res) => {
    res.render('links/add');
});

//---ADD-----
// realiza el POST en la base de datos con lo ingresado por el user
// usa async await porque puede demorar la respuesta
router.post('/add', isLoggedIn ,async (req, res) =>{
    const {title, url, description} = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO propiedades set ?', [newLink]);
    req.flash('success','Link guardado!'); //dos parametros, como queda guardado y el mensaje a mostrar
    res.redirect('/links');
});
// solo parametro '/' porque si ponemos /links tomara como ruta
// '/links/links/ osea se repitiria
router.get('/', isLoggedIn ,async (req, res) => {
    const links = await pool.query('SELECT * FROM propiedades WHERE user_id = ?', [req.user.id]);
    console.log(links);
    res.render('links/list', {links});
});

//---ELIMINAR---
//eliminar un registro con el boton delete segun el id
router.get('/delete/:id', isLoggedIn ,async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM propiedades WHERE ID = ?', [id]);
    req.flash('success', 'Eliminado correctamente!')
    res.redirect('/links'); //una vez eliminado redirige a la pantalla principal 
})
//---EDITAR---
router.get('/edit/:id', isLoggedIn ,async (req, res) => {
    const {id} = req.params;
    const link = await pool.query('SELECT * FROM propiedades WHERE id = ?', [id]);
    res.render('links/edit', {link: link[0]});
    });

router.post('/edit/:id', isLoggedIn ,async (req, res) => {
    const { id } = req.params;
    const {title, url, description} = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('UPDATE propiedades set ? WHERE id = ?', [newLink,id]);
    req.flash('success', 'Editado correctamente!')
    res.redirect('/links');
});

router.get('/table', isLoggedIn ,async (req, res) => {
    const table = await pool.query('SELECT * FROM propiedades WHERE user_id = ?', [req.user.id]);
    console.log(table);
    res.render('links/table', {table});
});


module.exports = router;