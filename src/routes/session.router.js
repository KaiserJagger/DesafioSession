import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
// import CartModel from "../dao/models/cart.model.js";

const router = Router();

// Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register');
});

// API para crear usuarios en la DB
router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failureRegister' }), async(req, res) => {
    res.redirect('/session/login');
});

router.get('/failureRegister', (req, res) => {
    res.send({ error: 'failed!' });
});

// Vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login');
});

// API para login
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/failLogin' }), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    };

    const redirectToCart = req.session.redirectToCart;
    if (redirectToCart) {
        delete req.session.redirectToCart;
        res.redirect('/cart'); // Redirigir al usuario al carrito
    } else {
        res.redirect('/products'); // Redirigir al usuario a otra página
    }
});

router.get('/failLogin', (req, res) => {
    res.send({ error: 'Fail in login' });
});

// Cerrar Sesión
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(500).render('errors/base', { error: err });
        } else res.redirect('/session/login');
    });
});

export default router;
